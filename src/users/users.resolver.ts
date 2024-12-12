import { Args, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';

@Resolver('User')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserEntity], { name: 'users' })
  public async findAllUsers(): Promise<UserEntity[]> {
    return await this.usersService.findAllUsers();
  }

  @Query(() => UserEntity, { name: 'user' })
  public async findOneUser(@Args('id') id: string): Promise<UserEntity> {
    return await this.usersService.findOneUser(id);
  }
}
