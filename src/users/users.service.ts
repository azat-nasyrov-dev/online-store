import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserInputError } from '@nestjs/apollo';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async findAllUsers(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  public async findOneUser(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new UserInputError(`User #${id} does not exist`);
    }
    return user;
  }
}
