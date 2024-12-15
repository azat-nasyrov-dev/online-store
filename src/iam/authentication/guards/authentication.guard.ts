import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessTokenGuard } from './access-token.guard';
import { AuthTypeEnum } from '../enums/auth-type.enum';
import { AUTH_TYPE_KEY } from '../decorators/auth.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthTypeEnum.Bearer;
  private readonly authTypeGuardMap: Record<AuthTypeEnum, CanActivate | CanActivate[]> = {
    [AuthTypeEnum.Bearer]: this.accessTokenGuard,
    [AuthTypeEnum.None]: { canActivate: () => true },
  };

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isGraphQL = context.getType().toString() === 'graphql';
    const gqlContext = isGraphQL ? GqlExecutionContext.create(context) : context;

    const authTypes = this.reflector.getAllAndOverride<AuthTypeEnum[]>(AUTH_TYPE_KEY, [
      gqlContext.getHandler(),
      gqlContext.getClass(),
    ]) ?? [AuthenticationGuard.defaultAuthType];
    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();
    let error = new UnauthorizedException();

    for (const instance of guards) {
      const canActivate = await Promise.resolve(instance.canActivate(context)).catch((err) => {
        error = err;
      });

      if (canActivate) {
        return true;
      }
    }
    throw error;
  }
}
