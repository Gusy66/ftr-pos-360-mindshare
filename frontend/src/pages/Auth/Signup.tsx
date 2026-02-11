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
import { Lock, Mail, User, LogIn } from "lucide-react"
import logo from "@/assets/financy-logo.png"

export function Signup() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const signup = useAuthStore((state) => state.signup)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const signupMutate = await signup({
        name,
        email,
        password,
      })
      if (signupMutate) {
        toast.success("Cadastro realizado com sucesso!")
      }
    } catch (error: any) {
      toast.error("Erro ao realizar o cadastro")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center min-h-[calc(100vh-4rem)] justify-center flex-col gap-6">
      <img src={logo} alt="Financy" className="h-7" />
      <Card className="w-full max-w-sm rounded-2xl border-border/60">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Criar conta</CardTitle>
          <CardDescription>Comece a controlar suas finanças ainda hoje</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-10 pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
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
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
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
              <span className="text-xs text-muted-foreground">
                A senha deve ter no mínimo 8 caracteres
              </span>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              Cadastrar
            </Button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              ou
              <span className="h-px flex-1 bg-border" />
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/login" className="gap-2">
                <LogIn className="h-4 w-4" />
                Fazer login
              </Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
