import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, PrismaService],
})
export class ReviewModule {}
