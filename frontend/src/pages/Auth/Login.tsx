import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useAuthStore } from "@/stores/auth"
import { toast } from "sonner"
import { Lock, Mail, UserPlus } from "lucide-react"
import logo from "@/assets/financy-logo.png"

export function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((state) => state.login)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const loginMutate = await login({
        email,
        password,
      })
      if (loginMutate) {
        toast.success("Login realizado com sucesso!")
      }
    } catch (error) {
      toast.error("Falha ao realizar o login!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] items-center justify-center gap-6">
      <img src={logo} alt="Financy" className="h-7" />
      <Card className="w-full max-w-sm rounded-2xl border-border/60">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Fazer login</CardTitle>
          <CardDescription>
            Entre na sua conta para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="mail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10 pl-9"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-10 pl-9"
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border" />
                Lembrar-me
              </label>
              <button type="button" className="text-primary">
                Recuperar senha
              </button>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              Entrar
            </Button>
            <div className="rounded-md border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
              <p className="font-medium text-foreground">Usuário teste (dados fictícios)</p>
              <div className="mt-1 flex flex-col gap-1 sm:flex-row sm:gap-4">
                <span>
                  Email: <strong className="text-foreground">demo@financy.com</strong>
                </span>
                <span>
                  Senha: <strong className="text-foreground">demo123</strong>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              ou
              <span className="h-px flex-1 bg-border" />
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/signup" className="gap-2">
                <UserPlus className="h-4 w-4" />
                Criar conta
              </Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
