import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthenticationService } from './authentication.service';
import { UserEntity } from '../../users/entities/user.entity';
import { SignUpInput } from './dto/sign-up.input';
import { SignInInput } from './dto/sign-in.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { TokenResponse } from './responses/token.response';

@Resolver('Authentication')
export class AuthenticationResolver {
  constructor(private readonly authService: AuthenticationService) {}

  @Mutation(() => UserEntity, { name: 'signUp' })
  public async signUp(
    @Args('signUpInput', { type: () => SignUpInput }) signUpInput: SignUpInput,
  ): Promise<UserEntity> {
    return await this.authService.signUp(signUpInput);
  }

  @Mutation(() => TokenResponse, { name: 'signIn' })
  public async signIn(
    @Args('signInInput', { type: () => SignInInput }) signInInput: SignInInput,
  ): Promise<TokenResponse> {
    return await this.authService.signIn(signInInput);
  }

  @Mutation(() => TokenResponse, { name: 'refreshTokens' })
  public async refreshTokens(
    @Args('refreshTokenInput', { type: () => RefreshTokenInput })
    refreshTokenInput: RefreshTokenInput,
  ): Promise<TokenResponse> {
    return await this.authService.refreshTokens(refreshTokenInput);
  }
}
