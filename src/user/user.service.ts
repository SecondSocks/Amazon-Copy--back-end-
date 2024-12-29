import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { hash } from 'argon2'
import { PrismaService } from '../prisma.service'
import { UserDto } from './dto/user.dto'
import { returnUserObject } from './return-user.object'

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}
	
	async getById(id: string, selectObject: Prisma.UserSelect = {}) {
		const user = await this.prisma.user.findUnique({
			where: { id },
			select: {
				...returnUserObject,
				favorites: {
					select: {
						id: true,
						name: true,
						price: true,
						images: true,
						slug: true
					}
				},
				...selectObject
			}
		})
		
		if (!user) throw new NotFoundException('User not found')
		
		return user
	}
	
	async updateProfile(id: string, dto: UserDto) {
		const isSameUser = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		})
		
		if (isSameUser && id !== isSameUser.id) throw new BadRequestException('Email already in use')
		
		const user = await this.getById(id)
		
		return this.prisma.user.update({
			where: { id },
			data: {
				email: dto.email,
				name: dto.name,
				avatarPath: dto.avatarPath,
				phone: dto.phone,
				password: dto.password ? await hash(dto.password) : user.password
			}
		})
	}
	
	async toggleFavorite(userId: string, productId: string) {
		const user = await this.getById(userId)
		
		if (!user) throw new NotFoundException('User not found')
		
		const isExists = user.favorites.some(product => product.id === productId)
		
		await this.prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				favorites: {
					[isExists ? 'disconnect' : 'connect']: {
						id: productId
					}
				}
			}
		})
		
		return { message: 'Success' }
	}
}
