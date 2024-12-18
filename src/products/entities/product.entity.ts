import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@Entity({ name: 'products' })
@ObjectType({ description: 'Product entity' })
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'A unique identifier' })
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('text')
  description: string;

  @Column('simple-array')
  image: string[];
}
