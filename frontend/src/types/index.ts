export interface User {
  id: string
  name: string
  email: string
  createdAt?: string
  updatedAt?: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface Category {
  id: string
  createdAt: string
  updatedAt?: string
  name: string
}

export type TransactionType = "income" | "expense"

export interface Transaction {
  id: string
  title: string
  amount: number
  type: TransactionType
  date: string
  categoryId: string
  category?: Category
  createdAt: string
  updatedAt?: string
}
