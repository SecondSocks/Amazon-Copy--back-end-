import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { UserService } from '../user/user.service'
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';

@Module({
  controllers: [StatisticsController],
  providers: [StatisticsService, PrismaService, UserService],
})
export class StatisticsModule {}
