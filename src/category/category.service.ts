import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { generatingSlug } from '../utils/generate-slug'
import { CategoryDto } from './dto/category.dto'
import { returnCategoryObject } from './return-category.object'

@Injectable()
export class CategoryService {
	constructor(private readonly prisma: PrismaService) {}
	
	async getById(id: string) {
		const category = await this.prisma.category.findUnique({
			where: { id },
			select: returnCategoryObject
		})
		
		if (!category) throw new NotFoundException('Category not found')
		
		return category
	}
	
	async getBySlug(slug: string) {
		const category = await this.prisma.category.findUnique({
			where: { slug },
			select: returnCategoryObject
		})
		
		if (!category) throw new NotFoundException('Category not found')
		
		return category
	}
	
	async getAll() {
		return this.prisma.category.findMany({
			select: returnCategoryObject
		})
	}
	
	async createCategory() {
		return this.prisma.category.create({
			data: {
				name: '',
				slug: ''
			}
		})
	}
	
	async updateCategory(id: string, dto: CategoryDto) {
		return this.prisma.category.update({
			where: { id },
			data: {
				name: dto.name,
				slug: generatingSlug(dto.name)
			}
		})
	}
	
	async deleteCategory(id: string) {
		return this.prisma.category.delete({
			where: { id }
		})
	}
}
