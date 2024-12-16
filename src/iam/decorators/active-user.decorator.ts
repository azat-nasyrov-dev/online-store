import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ActiveUserDataInterface } from '../interfaces/active-user-data.interface';
import { REQUEST_USER_KEY } from '../iam.constants';

export const ActiveUserDecorator = createParamDecorator(
  (field: keyof ActiveUserDataInterface | undefined, ctx: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(ctx);
    const isGraphQL = ctx.getType().toString() === 'graphql';

    const user: ActiveUserDataInterface | undefined = isGraphQL
      ? gqlContext.getContext()?.[REQUEST_USER_KEY]
      : ctx.switchToHttp().getRequest()?.[REQUEST_USER_KEY];

    return field ? user?.[field] : user;
  },
);
