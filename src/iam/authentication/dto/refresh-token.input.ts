import { InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class RefreshTokenInput {
  @IsNotEmpty()
  readonly refreshToken: string;
}
