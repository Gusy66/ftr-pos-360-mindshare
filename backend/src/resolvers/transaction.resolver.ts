import { Arg, Int, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { TransactionModel } from '../models/transaction.model'
import { IsAuth } from '../middlewares/auth.middleware'
import { GqlUser } from '../graphql/decorators/user.decorator'
import { UserModel } from '../models/user.model'
import { TransactionService } from '../services/transaction.service'
import {
  CreateTransactionInput,
  UpdateTransactionInput,
} from '../dtos/input/transaction.input'

@Resolver(() => TransactionModel)
@UseMiddleware(IsAuth)
export class TransactionResolver {
  private transactionService = new TransactionService()

  @Query(() => [TransactionModel])
  async listTransactions(
    @GqlUser() user: UserModel,
    @Arg('search', () => String, { nullable: true }) search?: string,
    @Arg('month', () => Int, { nullable: true }) month?: number,
    @Arg('year', () => Int, { nullable: true }) year?: number,
    @Arg('type', () => String, { nullable: true }) type?: 'income' | 'expense',
    @Arg('categoryId', () => String, { nullable: true }) categoryId?: string
  ): Promise<TransactionModel[]> {
    if (!user) throw new Error('Usuário não encontrado.')
    return this.transactionService.listTransactions(user.id, {
      search: search?.trim() || undefined,
      month,
      year,
      type,
      categoryId,
    })
  }

  @Mutation(() => TransactionModel)
  async createTransaction(
    @GqlUser() user: UserModel,
    @Arg('data', () => CreateTransactionInput) data: CreateTransactionInput
  ): Promise<TransactionModel> {
    if (!user) throw new Error('Usuário não encontrado.')
    return this.transactionService.createTransaction(user.id, data)
  }

  @Mutation(() => TransactionModel)
  async updateTransaction(
    @GqlUser() user: UserModel,
    @Arg('id', () => String) id: string,
    @Arg('data', () => UpdateTransactionInput) data: UpdateTransactionInput
  ): Promise<TransactionModel> {
    if (!user) throw new Error('Usuário não encontrado.')
    return this.transactionService.updateTransaction(user.id, id, data)
  }

  @Mutation(() => Boolean)
  async deleteTransaction(
    @GqlUser() user: UserModel,
    @Arg('id', () => String) id: string
  ): Promise<boolean> {
    if (!user) throw new Error('Usuário não encontrado.')
    return this.transactionService.deleteTransaction(user.id, id)
  }
}
