import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

@Module({
  controllers: [OrderController],
  providers: [OrderService, PrismaService],
})
export class OrderModule {}
