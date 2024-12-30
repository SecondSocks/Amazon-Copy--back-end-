import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { UserService } from '../user/user.service'

@Injectable()
export class StatisticsService {
	constructor(
		private readonly userService: UserService,
		private readonly prisma: PrismaService
	) {}
	
	async getMain(userId: string) {
		const user = await this.userService.getById(userId, {
			orders: {
				select: {
					items: true
				}
			},
			reviews: true
		})
		
		// TODO: This solve need redevelop to SQL
		
		
		return [
			{
				name: 'Orders',
				value: user.orders.length
			},
			{
				name: 'Review',
				value: user.reviews.length
			},
			{
				name: 'Favorites',
				value: user.favorites.length
			},
			{
				name: 'Total amount',
				value: 1000
			},
		]
	}
}
