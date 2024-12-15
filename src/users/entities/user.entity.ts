import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
class Name {
  @Column()
  firstName: string;

  @Column()
  lastName: string;
}

@ObjectType()
class GeoLocation {
  @Column()
  lat: string;

  @Column()
  long: string;
}

@ObjectType()
class Address {
  @Column()
  city: string;

  @Column()
  street: string;

  @Column()
  number: number;

  @Column()
  zipcode: string;

  @Column(() => GeoLocation)
  geolocation: GeoLocation;
}

@Entity({ name: 'users' })
@ObjectType({ description: 'User entity' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'A unique identifier' })
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column({ select: false })
  @HideField()
  passwordHash: string;

  @Column(() => Name)
  name: Name;

  @Column(() => Address)
  address: Address;

  @Column()
  phone: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
