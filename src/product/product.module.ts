import { Module } from '@nestjs/common';
import { PaginationService } from '../pagination/pagination.service'
import { PrismaService } from '../prisma.service'
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService, PaginationService],
})
export class ProductModule {}
