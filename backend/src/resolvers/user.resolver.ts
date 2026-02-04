import { Query, Resolver, UseMiddleware } from 'type-graphql'
import { UserModel } from '../models/user.model'
import { IsAuth } from '../middlewares/auth.middleware'
import { GqlUser } from '../graphql/decorators/user.decorator'

@Resolver(() => UserModel)
@UseMiddleware(IsAuth)
export class UserResolver {
  @Query(() => UserModel)
  async me(@GqlUser() user: UserModel): Promise<UserModel> {
    if (!user) throw new Error('Usuário não encontrado.')
    return user
  }
}
