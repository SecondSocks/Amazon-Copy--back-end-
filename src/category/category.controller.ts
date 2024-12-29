import {
  Body,
  Controller, Delete,
  Get, HttpCode,
  Param, Post,
  Put,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { UseAuth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto'

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  
  @Get()
  async getAll() {
    return this.categoryService.getAll()
  }
  
  @Get('by-slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.categoryService.getBySlug(slug)
  }
  
  @Get(':id')
  @UseAuth()
  async getById(@Param('id') categoryId: string) {
    return this.categoryService.getById(categoryId)
  }
  
  @UsePipes(new ValidationPipe())
  @UseAuth()
  @HttpCode(200)
  @Put(':id')
  async updateCategory(
    @Param('id') categoryId: string,
    @Body() dto: CategoryDto
  ) {
    return this.categoryService.updateCategory(categoryId, dto)
  }
  
  @UseAuth()
  @HttpCode(200)
  @Post()
  async createCategory(
  ) {
    return this.categoryService.createCategory()
  }
  
  @UseAuth()
  @HttpCode(200)
  @Delete(':id')
  async deleteCategory(@Param('id') categoryId: string) {
    return this.categoryService.deleteCategory(categoryId)
  }
}
