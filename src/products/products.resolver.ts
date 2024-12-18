import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { ProductEntity } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { AuthTypeEnum } from '../iam/authentication/enums/auth-type.enum';
import { Roles } from '../iam/authorization/decorators/role.decorator';
import { RoleEnum } from '../users/enums/role.enum';

@Auth(AuthTypeEnum.Bearer)
@Resolver('Product')
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(RoleEnum.Admin)
  @Mutation(() => ProductEntity, { name: 'createProduct' })
  public async createProduct(
    @Args('createProductInput', { type: () => CreateProductInput })
    createProductInput: CreateProductInput,
  ): Promise<ProductEntity> {
    return await this.productsService.createProduct(createProductInput);
  }

  @Query(() => [ProductEntity], { name: 'products' })
  public async findAllProducts(): Promise<ProductEntity[]> {
    return await this.productsService.findAllProducts();
  }

  @Query(() => ProductEntity, { name: 'product' })
  public async findOneProduct(
    @Args('id', { type: () => String }) id: string,
  ): Promise<ProductEntity> {
    return await this.productsService.findOneProduct(id);
  }

  @Roles(RoleEnum.Admin)
  @Mutation(() => ProductEntity, { name: 'updateProduct' })
  public async updateProduct(
    @Args('id', { type: () => String }) id: string,
    @Args('updateProductInput', { type: () => UpdateProductInput })
    updateProductInput: UpdateProductInput,
  ): Promise<ProductEntity> {
    return await this.productsService.updateProduct(id, updateProductInput);
  }

  @Roles(RoleEnum.Admin)
  @Mutation(() => Boolean, { name: 'deleteProduct' })
  public async deleteProduct(@Args('id', { type: () => String }) id: string): Promise<boolean> {
    return await this.productsService.deleteProduct(id);
  }
}
