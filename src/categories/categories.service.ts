import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { UserInputError } from '@nestjs/apollo';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  public async createCategory(title: string): Promise<CategoryEntity> {
    try {
      this.logger.log(`Creating category with title: ${title}`);
      const category = this.categoryRepository.create({ title });
      const savedCategory = await this.categoryRepository.save(category);
      this.logger.log(`Category created successfully: ${JSON.stringify(savedCategory)}`);
      return savedCategory;
    } catch (err) {
      this.logger.error(`Failed to create category: ${err.message}`, err.stack);
      throw err;
    }
  }

  public async findAllCategories(): Promise<CategoryEntity[]> {
    try {
      this.logger.log(`Fetching all categories`);
      const categories = await this.categoryRepository.find();
      this.logger.log(`Found ${categories.length} categories`);
      return categories;
    } catch (err) {
      this.logger.error(`Failed to fetch categories: ${err.message}`, err.stack);
      throw err;
    }
  }

  public async findOneCategory(id: string): Promise<CategoryEntity> {
    try {
      this.logger.log(`Fetching category with id: ${id}`);
      const category = await this.categoryRepository.findOne({ where: { id } });
      if (!category) {
        this.logger.warn(`Category #${id} not found`);
        throw new UserInputError(`Category #${id} does not exist`);
      }
      this.logger.log(`Category found: ${JSON.stringify(category)}`);
      return category;
    } catch (err) {
      this.logger.error(`Failed to fetch category #${id}: ${err.message}`, err.stack);
      throw err;
    }
  }

  public async updateCategory(id: string, title: string): Promise<CategoryEntity> {
    try {
      this.logger.log(`Updating category with id: ${id}, new title: ${title}`);
      const category = await this.findOneCategory(id);
      category.title = title;
      const updatedCategory = await this.categoryRepository.save(category);
      this.logger.log(`Category updated successfully: ${JSON.stringify(updatedCategory)}`);
      return updatedCategory;
    } catch (err) {
      this.logger.error(`Failed to update category #${id}: ${err.message}`, err.stack);
      throw err;
    }
  }

  public async deleteCategory(id: string): Promise<boolean> {
    try {
      this.logger.log(`Deleting category with id: ${id}`);
      const result = await this.categoryRepository.delete(id);
      if (result.affected === 0) {
        this.logger.warn(`Category #${id} not found for deletion`);
        throw new UserInputError(`Category #${id} does not exist`);
      }
      this.logger.log(`Category #${id} deleted successfully`);
      return true;
    } catch (err) {
      this.logger.error(`Failed to delete category #${id}: ${err.message}`, err.stack);
      throw err;
    }
  }
}
