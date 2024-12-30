import { Controller, Get } from '@nestjs/common'
import { UseAuth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}
  
  @Get('main')
  @UseAuth()
  async getMain(@CurrentUser('id') userId: string) {
    return this.statisticsService.getMain(userId)
  }
}
