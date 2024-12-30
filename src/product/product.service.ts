import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PaginationService } from '../pagination/pagination.service'
import { PrismaService } from '../prisma.service'
import { generatingSlug } from '../utils/generate-slug'
import { EnumProductSort, GetAllProductDto } from './dto/get-all.product.dto'
import { ProductDto } from './dto/product.dto'
import {
	returnProductObject,
	returnProductObjectFullset
} from './return-product.object'

@Injectable()
export class ProductService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly pagination: PaginationService
	) {}
	
	async getAll(dto: GetAllProductDto = {}) {
		const { page, sort, searchTerm } = dto
		
		const prismaSort: Prisma.ProductOrderByWithRelationInput[] = []
		
		switch (sort) {
			case EnumProductSort.HIGH_PRICE:
				prismaSort.push({ price: 'desc' })
				break
			case EnumProductSort.LOW_PRICE:
				prismaSort.push({ price: 'asc' })
				break
			case EnumProductSort.OLDEST:
				prismaSort.push({ createdAt: 'asc' })
				break
			default:
				prismaSort.push({ createdAt: 'desc' })
		}
		
		const prismaSearchTermFilter: Prisma.ProductWhereInput = searchTerm ? {
			OR: [
				{
					category: {
						name: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					}
				},
				{
					name: {
						contains: searchTerm,
						mode: 'insensitive'
					}
				},
				{
					description: {
						contains: searchTerm,
						mode: 'insensitive'
					}
				}
			]
		} : {}
		
		const { perPage, skip } = this.pagination.getPagination(dto)
		
		const products = await this.prisma.product.findMany({
			where: prismaSearchTermFilter,
			orderBy: prismaSort,
			skip,
			take: perPage,
			select: returnProductObject
		})
		
		return {
			products,
			length: await this.prisma.product.count({
				where: prismaSearchTermFilter
			})
		}
	}
	
	async getById(id: string) {
		const product = await this.prisma.product.findUnique({
			where: { id },
			select: returnProductObjectFullset
		})
		
		if (!product) throw new NotFoundException('Product not found')
		
		return product
	}
	
	async getBySlug(slug: string) {
		const product = await this.prisma.product.findUnique({
			where: { slug },
			select: returnProductObjectFullset
		})
		
		if (!product) throw new NotFoundException('Product not found')
		
		return product
	}
	
	async getByCategory(categorySlug: string) {
		const product = await this.prisma.product.findMany({
			where: {
				category: {
					slug: categorySlug
				}
			},
			select: returnProductObjectFullset
		})
		
		if (!product) throw new NotFoundException('Product not found')
		
		return product
	}
	
	async getSimilarProducts(id: string) {
		const currentProduct = await this.getById(id)
		
		if (!currentProduct) throw new NotFoundException('Product not found')
		
		const products = await this.prisma.product.findMany({
			where: {
				category: {
					name: currentProduct.category.name
				},
				NOT: {
					id: currentProduct.id
				}
			},
			orderBy: {
				createdAt: 'desc'
			},
			select: returnProductObject
		})
		
		return products
	}
	
	async createProduct() {
		const product = await this.prisma.product.create({
			data: {
				description: '',
				name: '',
				price: 0,
				slug: ''
			}
		})
		
		return product.id
	}
	
	async updateProduct(id: string, dto: ProductDto) {
		const { description, images, price, name, categoryId } = dto
		
		return this.prisma.product.update({
			where: { id },
			data: {
				description,
				images,
				name,
				price,
				slug: generatingSlug(name),
				category: {
					connect: {
						id: categoryId
					}
				}
			}
		})
	}
	
	async deleteProduct(id: string) {
		return this.prisma.product.delete({
			where: { id }
		})
	}
}
