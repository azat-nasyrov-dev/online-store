import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RoleEnum } from '../../../users/enums/role.enum';
import { ROLES_KEY } from '../decorators/role.decorator';
import { ActiveUserDataInterface } from '../../interfaces/active-user-data.interface';
import { REQUEST_USER_KEY } from '../../iam.constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const contextRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!contextRoles) {
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context);
    const isGraphQL = context.getType().toString() === 'graphql';

    const user: ActiveUserDataInterface = isGraphQL
      ? gqlContext.getContext()?.[REQUEST_USER_KEY]
      : context.switchToHttp().getRequest()?.[REQUEST_USER_KEY];

    if (!user) {
      return false;
    }
    return contextRoles.some((role) => user.role === role);
  }
}
