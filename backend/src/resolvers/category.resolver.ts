import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { CategoryModel } from '../models/category.model'
import { IsAuth } from '../middlewares/auth.middleware'
import { GqlUser } from '../graphql/decorators/user.decorator'
import { UserModel } from '../models/user.model'
import { CategoryService } from '../services/category.service'
import { CreateCategoryInput, UpdateCategoryInput } from '../dtos/input/category.input'

@Resolver(() => CategoryModel)
@UseMiddleware(IsAuth)
export class CategoryResolver {
  private categoryService = new CategoryService()

  @Query(() => [CategoryModel])
  async listCategories(@GqlUser() user: UserModel): Promise<CategoryModel[]> {
    if (!user) throw new Error('Usuário não encontrado.')
    return this.categoryService.listCategories(user.id)
  }

  @Mutation(() => CategoryModel)
  async createCategory(
    @GqlUser() user: UserModel,
    @Arg('data', () => CreateCategoryInput) data: CreateCategoryInput
  ): Promise<CategoryModel> {
    if (!user) throw new Error('Usuário não encontrado.')
    return this.categoryService.createCategory(user.id, data)
  }

  @Mutation(() => CategoryModel)
  async updateCategory(
    @GqlUser() user: UserModel,
    @Arg('id', () => String) id: string,
    @Arg('data', () => UpdateCategoryInput) data: UpdateCategoryInput
  ): Promise<CategoryModel> {
    if (!user) throw new Error('Usuário não encontrado.')
    return this.categoryService.updateCategory(user.id, id, data)
  }

  @Mutation(() => Boolean)
  async deleteCategory(
    @GqlUser() user: UserModel,
    @Arg('id', () => String) id: string
  ): Promise<boolean> {
    if (!user) throw new Error('Usuário não encontrado.')
    return this.categoryService.deleteCategory(user.id, id)
  }
}
