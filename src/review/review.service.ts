import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { ReviewDto } from './dto/review.dto'
import { returnReviewObject } from './return-review.object'

@Injectable()
export class ReviewService {
	constructor(private readonly prisma: PrismaService) {}
	
	async getById(id: string) {
		const review = await this.prisma.review.findUnique({
			where: { id },
			select: returnReviewObject
		})
		
		if (!review) throw new NotFoundException('Review not found')
		
		return review
	}
	
	async getAll() {
		return this.prisma.review.findMany({
			select: returnReviewObject,
			orderBy: {
				createdAt: 'desc'
			}
		})
	}
	
	async createReview(userId: string, productId: string, dto: ReviewDto) {
		return this.prisma.review.create({
			data: {
				...dto,
				Product: {
					connect: {
						id: productId
					}
				},
				user: {
					connect: {
						id: userId
					}
				}
			}
		})
	}
	
	async getAverageValueByProductId(productId: string) {
		return this.prisma.review
			.aggregate({
				where: { productId },
				_avg: { rating: true }
			})
			.then(data => data._avg)
	}
}
