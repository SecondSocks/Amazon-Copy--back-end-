import {
  Body,
  Controller,
  Get,
  HttpCode, Param, Patch, Put,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { UseAuth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { UserDto } from './dto/user.dto'
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Get('profile')
  @UseAuth()
  async getProfile(@CurrentUser('id') userId: string) {
    return this.userService.getById(userId)
  }
  
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put('profile')
  @UseAuth()
  async updateProfile(@CurrentUser('id') userId: string, @Body() dto: UserDto) {
    return this.userService.updateProfile(userId, dto)
  }
  
  @HttpCode(200)
  @Patch('profile/favorites/:productId')
  @UseAuth()
  async toggleFavorite(@Param('productId') productId: string, @CurrentUser('id') userId: string) {
    return this.userService.toggleFavorite(userId, productId)
  }
}
