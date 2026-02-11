import { prismaClient } from '../../prisma/prisma'
import {
  CreateTransactionInput,
  UpdateTransactionInput,
} from '../dtos/input/transaction.input'

type ListTransactionFilters = {
  search?: string
  month?: number
  year?: number
  type?: 'income' | 'expense'
  categoryId?: string
}

export class TransactionService {
  async listTransactions(userId: string, filters?: ListTransactionFilters) {
    const where: {
      userId: string
      title?: { contains: string }
      date?: { gte?: Date; lt?: Date }
      type?: 'income' | 'expense'
      categoryId?: string
    } = { userId }

    if (filters?.search) {
      where.title = { contains: filters.search }
    }

    if (filters?.month || filters?.year) {
      const year = filters?.year ?? new Date().getFullYear()
      const month = filters?.month ? filters.month - 1 : 0
      const start = new Date(year, month, 1)
      const end = filters?.month
        ? new Date(year, month + 1, 1)
        : new Date(year + 1, 0, 1)

      where.date = { gte: start, lt: end }
    }

    if (filters?.type) {
      where.type = filters.type
    }

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId
    }

    return prismaClient.transaction.findMany({
      where,
      include: { category: true },
      orderBy: { date: 'desc' },
    })
  }

  async createTransaction(userId: string, data: CreateTransactionInput) {
    const category = await prismaClient.category.findFirst({
      where: { id: data.categoryId, userId },
    })
    if (!category) throw new Error('Categoria inválida.')

    return prismaClient.transaction.create({
      data: {
        title: data.title,
        amount: data.amount,
        type: data.type,
        date: data.date,
        userId,
        categoryId: data.categoryId,
      },
      include: { category: true },
    })
  }

  async updateTransaction(userId: string, id: string, data: UpdateTransactionInput) {
    const existing = await prismaClient.transaction.findFirst({
      where: { id, userId },
    })
    if (!existing) throw new Error('Transação não encontrada.')

    if (data.categoryId) {
      const category = await prismaClient.category.findFirst({
        where: { id: data.categoryId, userId },
      })
      if (!category) throw new Error('Categoria inválida.')
    }

    return prismaClient.transaction.update({
      where: { id },
      data: {
        title: data.title ?? undefined,
        amount: data.amount ?? undefined,
        type: data.type ?? undefined,
        date: data.date ?? undefined,
        categoryId: data.categoryId ?? undefined,
      },
      include: { category: true },
    })
  }

  async deleteTransaction(userId: string, id: string) {
    const existing = await prismaClient.transaction.findFirst({
      where: { id, userId },
    })
    if (!existing) throw new Error('Transação não encontrada.')

    await prismaClient.transaction.delete({ where: { id } })
    return true
  }
}
