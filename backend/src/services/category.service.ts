import { prismaClient } from '../../prisma/prisma'
import { CreateCategoryInput, UpdateCategoryInput } from '../dtos/input/category.input'

export class CategoryService {
  async listCategories(userId: string) {
    return prismaClient.category.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async createCategory(userId: string, data: CreateCategoryInput) {
    return prismaClient.category.create({
      data: {
        name: data.name,
        userId,
      },
    })
  }

  async updateCategory(userId: string, id: string, data: UpdateCategoryInput) {
    const existing = await prismaClient.category.findFirst({
      where: { id, userId },
    })
    if (!existing) throw new Error('Categoria não encontrada.')

    return prismaClient.category.update({
      where: { id },
      data: {
        name: data.name,
      },
    })
  }

  async deleteCategory(userId: string, id: string) {
    const existing = await prismaClient.category.findFirst({
      where: { id, userId },
    })
    if (!existing) throw new Error('Categoria não encontrada.')

    await prismaClient.category.delete({ where: { id } })
    return true
  }
}
