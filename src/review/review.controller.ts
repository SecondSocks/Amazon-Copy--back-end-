import {
  Body,
  Controller,
  Get,
  HttpCode, Param,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { UseAuth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { ReviewDto } from './dto/review.dto'
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {
  }
  
  @Get()
  async getAll() {
    return this.reviewService.getAll()
  }
  
  @UsePipes(new ValidationPipe())
  @UseAuth()
  @HttpCode(200)
  @Post('leave/:productId')
  async leaveReview(
    @Param('productId') productId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: ReviewDto
  ) {
    return this.reviewService.createReview(userId, productId, dto)
  }
}