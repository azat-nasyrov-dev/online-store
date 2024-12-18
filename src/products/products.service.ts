import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInputError } from '@nestjs/apollo';
import { ProductEntity } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  public async createProduct(createProductInput: CreateProductInput): Promise<ProductEntity> {
    try {
      this.logger.log(`Creating product: ${JSON.stringify(createProductInput)}`);
      const product = this.productRepository.create(createProductInput);
      const savedProduct = await this.productRepository.save(product);
      this.logger.log(`Product created successfully: ${JSON.stringify(savedProduct)}`);
      return savedProduct;
    } catch (err) {
      this.logger.error(`Failed to create product: ${err.message}`, err.stack);
      throw err;
    }
  }

  public async findAllProducts(): Promise<ProductEntity[]> {
    try {
      this.logger.log(`Fetching all products`);
      const products = await this.productRepository.find();
      this.logger.log(`Found ${products.length} products`);
      return products;
    } catch (err) {
      this.logger.error(`Failed to fetch products: ${err.message}`, err.stack);
      throw err;
    }
  }

  public async findOneProduct(id: string): Promise<ProductEntity> {
    try {
      this.logger.log(`Fetching product with id: ${id}`);
      const product = await this.productRepository.findOne({ where: { id } });
      if (!product) {
        this.logger.warn(`Product #${id} not found`);
        throw new UserInputError(`Product #${id} does not exist`);
      }
      this.logger.log(`Product found: ${JSON.stringify(product)}`);
      return product;
    } catch (err) {
      this.logger.error(`Failed to fetch product #${id}: ${err.message}`, err.stack);
      throw err;
    }
  }

  public async updateProduct(
    id: string,
    updateProductInput: UpdateProductInput,
  ): Promise<ProductEntity> {
    try {
      this.logger.log(
        `Updating product with id: ${id}, data: ${JSON.stringify(updateProductInput)}`,
      );
      const product = await this.findOneProduct(id);
      const updatedProduct = this.productRepository.merge(product, updateProductInput);
      const savedProduct = await this.productRepository.save(updatedProduct);
      this.logger.log(`Product updated successfully: ${JSON.stringify(savedProduct)}`);
      return savedProduct;
    } catch (err) {
      this.logger.error(`Failed to update product #${id}: ${err.message}`, err.stack);
      throw err;
    }
  }

  public async deleteProduct(id: string): Promise<boolean> {
    try {
      this.logger.log(`Deleting product with id: ${id}`);
      const result = await this.productRepository.delete(id);
      if (result.affected === 0) {
        this.logger.warn(`Product #${id} not found for deletion`);
        throw new UserInputError(`Product #${id} does not exist`);
      }
      this.logger.log(`Product #${id} deleted successfully`);
      return true;
    } catch (err) {
      this.logger.error(`Failed to delete product #${id}: ${err.message}`, err.stack);
      throw err;
    }
  }
}
