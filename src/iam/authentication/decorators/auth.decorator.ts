import { SetMetadata } from '@nestjs/common';
import { AuthTypeEnum } from '../enums/auth-type.enum';

export const AUTH_TYPE_KEY = 'authType';

export const Auth = (...authTypes: AuthTypeEnum[]) => SetMetadata(AUTH_TYPE_KEY, authTypes);
