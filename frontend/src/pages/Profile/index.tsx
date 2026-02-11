import { useQuery } from "@apollo/client/react"
import { ME } from "@/lib/graphql/queries/Me"
import type { User } from "@/types"
import { Page } from "@/components/Page"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/auth"

type MeQueryData = {
  me: User
}

export function ProfilePage() {
  const { data } = useQuery<MeQueryData>(ME)
  const user = data?.me
  const logout = useAuthStore((state) => state.logout)

  return (
    <Page>
      <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
        <Card className="w-full max-w-sm rounded-2xl border-border/60">
          <CardContent className="flex flex-col items-center gap-6 pt-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-sm font-semibold">
              {user?.name?.charAt(0) ?? "U"}
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold">{user?.name ?? "Conta teste"}</p>
              <p className="text-xs text-muted-foreground">{user?.email ?? "-"}</p>
            </div>
            <div className="w-full space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Nome completo
                </label>
                <input
                  value={user?.name ?? ""}
                  readOnly
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  E-mail
                </label>
                <input
                  value={user?.email ?? ""}
                  readOnly
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                />
                <span className="text-xs text-muted-foreground">
                  O e-mail não pode ser alterado
                </span>
              </div>
            </div>
            <Button className="w-full">Salvar alterações</Button>
            <Button variant="outline" className="w-full" onClick={logout}>
              Sair da conta
            </Button>
          </CardContent>
        </Card>
      </div>
    </Page>
  )
}
