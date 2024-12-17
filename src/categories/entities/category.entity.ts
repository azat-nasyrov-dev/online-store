import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@Entity({ name: 'categories' })
@ObjectType({ description: 'Category entity' })
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'A unique identifier' })
  id: string;

  @Column({ unique: true })
  title: string;
}
