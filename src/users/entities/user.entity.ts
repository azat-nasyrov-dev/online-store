import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
class Name {
  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
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

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column(() => Name)
  name: Name;

  @Column(() => Address)
  address: Address;

  @Column()
  phone: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
