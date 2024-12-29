import { faker } from '@faker-js/faker/locale/en'
import { PrismaClient, Product } from '@prisma/client'
import * as dotenv from 'dotenv'
import { generatingSlug } from '../src/utils/generate-slug'
import { getRandomNumber } from '../src/utils/random-number'

dotenv.config()
const prisma = new PrismaClient()

const createProducts = async (quantity: number) => {
	const products: Product[] = []
	
	for (let i = 0; i < quantity; i++) {
		const productName = faker.commerce.productName()
		const categoryName = faker.commerce.department()
		
		const product = await prisma.product.create({
			data: {
				name: productName,
				description: faker.commerce.productDescription(),
				price: +faker.commerce.price({
					min: 0,
					max: 999,
					dec: 0
				}),
				slug: faker.helpers.slugify(productName),
				images: Array.from({ length: getRandomNumber(2, 6) })
					.map(() => faker.image.urlPicsumPhotos()),
				category: {
					create: {
						name: categoryName,
						slug: faker.helpers.slugify(categoryName)
					}
				},
				reviews: {
					create: [
						{
							rating: getRandomNumber(1, 5),
							text: faker.lorem.paragraph(),
							user: {
								connect: {
									id: "cm59tvql50000149t4yb7p2y7"
								}
							}
						},
						{
							rating: getRandomNumber(1, 5),
							text: faker.lorem.paragraph(),
							user: {
								connect: {
									id: "cm59tvql50000149t4yb7p2y7"
								}
							}
						}
					]
				},
				user: {
					connect: {
						id: "cm59tvql50000149t4yb7p2y7"
					}
				}
			}
		})
		
		products.push(product)
	}
	
	console.log(`Created ${products.length} products`)
}

async function main() {
	console.log('Start seeding...')
	await createProducts(10)
}

main()
	.catch(error => console.error(error))
	.finally(async () => await prisma.$disconnect())