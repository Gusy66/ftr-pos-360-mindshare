import { useQuery } from "@apollo/client/react"
import { ME } from "@/lib/graphql/queries/Me"
import type { User } from "@/types"
import { Page } from "@/components/Page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type MeQueryData = {
  me: User
}

export function ProfilePage() {
  const { data } = useQuery<MeQueryData>(ME)
  const user = data?.me

  return (
    <Page>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold">Perfil</h1>
          <p className="text-sm text-muted-foreground">
            Dados da sua conta
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-xs text-muted-foreground">Nome</p>
              <p className="font-medium">{user?.name || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Criado em</p>
              <p className="font-medium">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("pt-BR")
                  : "-"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Page>
  )
}
