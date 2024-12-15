import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { UserEntity } from '../../users/entities/user.entity';
import { HashingService } from '../hashing/hashing.service';
import jwtConfig from '../../config/jwt.config';
import { SignUpInput } from './dto/sign-up.input';
import { SignInInput } from './dto/sign-in.input';
import { InvalidateRefreshTokenError, RefreshTokenIdsStorage } from './refresh-token-ids.storage';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { ActiveUserDataInterface } from '../interfaces/active-user-data.interface';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) {}

  public async signUp(signUpInput: SignUpInput): Promise<UserEntity> {
    try {
      const user = Object.assign(new UserEntity(), {
        ...signUpInput,
        passwordHash: await this.hashingService.hash(signUpInput.password),
      });

      return await this.userRepository.save(user);
    } catch (err) {
      this.logger.error(`Error during sign-up: ${err.message}`, err.stack);
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw err;
    }
  }

  public async signIn(
    signInInput: SignInInput,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findOne({
      where: { email: signInInput.email },
      select: [
        'id',
        'email',
        'username',
        'passwordHash',
        'name',
        'address',
        'phone',
        'createdAt',
        'updatedAt',
      ],
    });
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }
    const isEqual = await this.hashingService.compare(signInInput.password, user.passwordHash);
    if (!isEqual) {
      throw new UnauthorizedException('Password does not match');
    }

    return await this.generateTokens(user);
  }

  public async generateTokens(
    user: UserEntity,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserDataInterface>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        {
          email: user.email,
        },
      ),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
        refreshTokenId,
      }),
    ]);
    await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);
    return {
      accessToken,
      refreshToken,
    };
  }

  public async refreshTokens(
    refreshTokenInput: RefreshTokenInput,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<ActiveUserDataInterface, 'sub'> & { refreshTokenId: string }
      >(refreshTokenInput.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });
      const user = await this.userRepository.findOneByOrFail({
        id: sub,
      });
      const isValid = await this.refreshTokenIdsStorage.validate(user.id, refreshTokenId);
      if (isValid) {
        await this.refreshTokenIdsStorage.invalidate(user.id);
      } else {
        throw new Error('Refresh token is invalid');
      }
      return this.generateTokens(user);
    } catch (err) {
      this.logger.error(`Refresh token error: ${err.message}`, err.stack);
      if (err instanceof InvalidateRefreshTokenError) {
        // Take action: notify user that his refresh token might have been stolen?
        throw new UnauthorizedException('Access denied');
      }
      throw new UnauthorizedException();
    }
  }

  private async signToken<T>(userId: string, expiresIn: number, payload?: T): Promise<string> {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }
}
