import { InputType, PartialType } from '@nestjs/graphql';
import { CreateProductInput } from './create-product.input';

@InputType({ description: 'Update product input object type.' })
export class UpdateProductInput extends PartialType(CreateProductInput) {}
