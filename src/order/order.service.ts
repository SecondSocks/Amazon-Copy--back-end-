import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'

@Injectable()
export class OrderService {
	constructor(private readonly prisma: PrismaService) {}
	
	async getAll(userId: string) {
		return this.prisma.order.findMany({
			where: {
				userId
			},
			orderBy: {
				createdAt: 'desc'
			}
		})
	}
}
