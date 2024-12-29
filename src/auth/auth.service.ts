import { faker } from '@faker-js/faker/locale/en'
import {
	BadRequestException,
	Injectable, NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { hash, verify } from 'argon2'
import { PrismaService } from '../prisma.service'
import { AuthDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly jwtService: JwtService
	) {}
	
	
	async register(dto: AuthDto) {
		const oldUser = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		})
		
		if (oldUser) throw new BadRequestException('User with this email already exists')
		
		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				password: await hash(dto.password),
				name: faker.person.firstName(),
				avatarPath: faker.image.avatar(),
				phone: faker.phone.number()
			}
		})  // TODO: Декомпозировать логику через UserService
		
		const tokens = await this.issueToken(user.id)
		
		return {
			user: this.returnUserField(user),
			tokens
		}
	}

	async login(dto: AuthDto) {
		const user = await this.validateUser(dto)
		const tokens = await this.issueToken(user.id)
		
		return {
			user: this.returnUserField(user),
			tokens
		}
	}
	
	async getNewTokens(refreshToken: string) {
		const result = await this.jwtService.verifyAsync(refreshToken)
		
		if (!result) throw new UnauthorizedException('Invalid token')
		
		const user = await this.prisma.user.findUnique({
			where: { id: result.id }
		})  // TODO: Декомпозировать логику через UserService
		
		const tokens = await this.issueToken(user.id)
		
		return {
			user: this.returnUserField(user),
			tokens
		}
	}
	
	private async issueToken(userId: string) {
		const data = {id: userId}
		
		const accessToken = this.jwtService.sign(data, {
			expiresIn: '1h'
		})
		
		const refreshToken = this.jwtService.sign(data, {
			expiresIn: '7d'
		})
		
		return { accessToken, refreshToken }
	}
	
	private returnUserField(user: User) {
		return {
			id: user.id,
			email: user.email
		}
	}  // TODO: Декомпозировать логику через UserService
	
	private async validateUser(dto: AuthDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		})
		
		if (!user) throw new NotFoundException('User with this email does not exist')
		
		const isValid = await verify(user.password, dto.password)
		
		if (!isValid) throw new UnauthorizedException('Invalid password')
		
		return user
	}
}
