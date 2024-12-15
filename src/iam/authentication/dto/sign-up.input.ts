import { InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

@InputType()
class NameInput {
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  readonly lastName: string;
}

@InputType()
class GeoLocationInput {
  @IsNotEmpty()
  @IsString()
  @IsLatitude()
  readonly lat: string;

  @IsNotEmpty()
  @IsString()
  @IsLongitude()
  readonly long: string;
}

@InputType()
class AddressInput {
  @IsNotEmpty()
  @IsString()
  readonly city: string;

  @IsNotEmpty()
  @IsString()
  readonly street: string;

  @IsNotEmpty()
  @IsNumber()
  readonly number: number;

  @IsNotEmpty()
  @IsString()
  readonly zipcode: string;

  @IsNotEmpty()
  readonly geolocation: GeoLocationInput;
}

@InputType({ description: 'SignUp input object type.' })
export class SignUpInput {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;

  @IsNotEmpty()
  readonly name: NameInput;

  @IsNotEmpty()
  readonly address: AddressInput;

  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('US')
  readonly phone: string;
}
