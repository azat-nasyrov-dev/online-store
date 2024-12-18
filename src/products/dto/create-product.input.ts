import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { InputType } from '@nestjs/graphql';

@InputType({ description: 'Create product input object type.' })
export class CreateProductInput {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  readonly images: string[];
}
