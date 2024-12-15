import { InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

@InputType({ description: 'SignIn input object type.' })
export class SignInInput {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly username?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;
}
