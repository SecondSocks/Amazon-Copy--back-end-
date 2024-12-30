import { Controller, Get } from '@nestjs/common'
import { UseAuth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  
  @Get()
  @UseAuth()
  async getAll(@CurrentUser('id') userId: string) {
    return this.orderService.getAll(userId)
  }
}
