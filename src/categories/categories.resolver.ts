import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { CategoryEntity } from './entities/category.entity';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { AuthTypeEnum } from '../iam/authentication/enums/auth-type.enum';
import { Roles } from '../iam/authorization/decorators/role.decorator';
import { RoleEnum } from '../users/enums/role.enum';

@Auth(AuthTypeEnum.Bearer)
@Resolver('Category')
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Roles(RoleEnum.Admin)
  @Mutation(() => CategoryEntity, { name: 'createCategory' })
  public async createCategory(
    @Args('title', { type: () => String }) title: string,
  ): Promise<CategoryEntity> {
    return await this.categoriesService.createCategory(title);
  }

  @Query(() => [CategoryEntity], { name: 'categories' })
  public async findAllCategories(): Promise<CategoryEntity[]> {
    return await this.categoriesService.findAllCategories();
  }

  @Query(() => CategoryEntity, { name: 'category' })
  public async findOneCategory(
    @Args('id', { type: () => String }) id: string,
  ): Promise<CategoryEntity> {
    return await this.categoriesService.findOneCategory(id);
  }

  @Roles(RoleEnum.Admin)
  @Mutation(() => CategoryEntity, { name: 'updateCategory' })
  public async updateCategory(
    @Args('id', { type: () => String }) id: string,
    @Args('title', { type: () => String }) title: string,
  ): Promise<CategoryEntity> {
    return await this.categoriesService.updateCategory(id, title);
  }

  @Roles(RoleEnum.Admin)
  @Mutation(() => Boolean, { name: 'deleteCategory' })
  public async deleteCategory(@Args('id', { type: () => String }) id: string): Promise<boolean> {
    return await this.categoriesService.deleteCategory(id);
  }
}
