import {
  Body,
  Controller, Delete,
  Get, HttpCode, Param, Post, Put,
  Query,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { UseAuth } from '../auth/decorators/auth.decorator'
import { GetAllProductDto } from './dto/get-all.product.dto'
import { ProductDto } from './dto/product.dto'
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  
  @UsePipes(new ValidationPipe())
  @Get()
  async getAll(@Query() queryDto: GetAllProductDto) {
    return this.productService.getAll(queryDto)
  }
  
  @Get('similar/:id')
  async getSimilarProducts(@Param('id') id: string) {
    return this.productService.getSimilarProducts(id)
  }
  
  @Get('by-slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.productService.getBySlug(slug)
  }
  
  @Get('by-category/:categorySlug')
  async getByCategory(@Param('categorySlug') categorySlug: string) {
    return this.productService.getByCategory(categorySlug)
  }
  
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.productService.getById(id)
  }
  
  @UseAuth()
  @HttpCode(200)
  @Post()
  async createProduct() {
    return this.productService.createProduct()
  }
  
  @UsePipes(new ValidationPipe())
  @UseAuth()
  @HttpCode(200)
  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() dto: ProductDto) {
    return this.productService.updateProduct(id, dto)
  }
  
  @HttpCode(200)
  @UseAuth()
  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id)
  }
}
