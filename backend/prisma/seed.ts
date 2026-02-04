import { prismaClient } from './prisma'
import { hashPassword } from '../src/utils/hash'
import { TransactionType } from '@prisma/client'

const demoEmail = 'demo@financy.com'

const categories = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Lazer',
  'Saúde',
  'Educação',
  'Salário',
]

const randomAmount = (min: number, max: number) => {
  return Number((Math.random() * (max - min) + min).toFixed(2))
}

const randomDateInLastMonths = (monthsBack: number) => {
  const now = new Date()
  const monthOffset = Math.floor(Math.random() * monthsBack)
  const day = Math.max(1, Math.floor(Math.random() * 28))
  return new Date(now.getFullYear(), now.getMonth() - monthOffset, day)
}

const randomTitle = (type: TransactionType) => {
  const incomes = ['Salário', 'Freelance', 'Bônus', 'Venda extra']
  const expenses = ['Supermercado', 'Uber', 'Internet', 'Farmácia', 'Restaurante']
  const list = type === 'income' ? incomes : expenses
  return list[Math.floor(Math.random() * list.length)]
}

async function main() {
  const existing = await prismaClient.user.findUnique({
    where: { email: demoEmail },
  })

  if (existing) {
    console.log('Usuário demo já existe, seed ignorado.')
    return
  }

  const password = await hashPassword('demo123')

  const user = await prismaClient.user.create({
    data: {
      name: 'Usuário Demo',
      email: demoEmail,
      password,
    },
  })

  const createdCategories = await Promise.all(
    categories.map((name) =>
      prismaClient.category.create({
        data: {
          name,
          userId: user.id,
        },
      })
    )
  )

  const selectedCategories = createdCategories.filter(
    (category) => category.name !== 'Salário'
  )
  const salaryCategory = createdCategories.find(
    (category) => category.name === 'Salário'
  )

  const transactionsCount = 15
  const transactions = Array.from({ length: transactionsCount }).map(() => {
    const isIncome = Math.random() > 0.7
    const type = isIncome ? TransactionType.income : TransactionType.expense
    const category =
      type === TransactionType.income
        ? salaryCategory ?? createdCategories[0]
        : selectedCategories[Math.floor(Math.random() * selectedCategories.length)]

    return {
      title: randomTitle(type),
      amount: randomAmount(type === TransactionType.income ? 1500 : 25, type === TransactionType.income ? 5200 : 450),
      type,
      date: randomDateInLastMonths(6),
      userId: user.id,
      categoryId: category.id,
    }
  })

  await prismaClient.transaction.createMany({ data: transactions })

  console.log('Seed concluído com usuário demo e transações.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prismaClient.$disconnect()
  })
