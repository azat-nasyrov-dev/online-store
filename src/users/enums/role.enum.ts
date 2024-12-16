import { registerEnumType } from '@nestjs/graphql';

export enum RoleEnum {
  Regular = 'regular',
  Admin = 'admin',
}

registerEnumType(RoleEnum, {
  name: 'RoleEnum',
  description: 'User roles available in the system',
});
