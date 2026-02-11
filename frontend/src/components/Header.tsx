import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/auth"
import { Button } from "./ui/button"
import { LogOut } from "lucide-react"
import { Avatar, AvatarFallback } from "./ui/avatar"
import logo from "@/assets/financy-logo.png"

export function Header() {
  const { user, logout, isAuthenticated } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()
  const isDashboardPage = location.pathname === "/"
  const isTransactionsPage = location.pathname === "/transactions"
  const isCategoriesPage = location.pathname === "/categories"

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const linkClass = (active: boolean) =>
    active
      ? "text-primary border-b-2 border-primary pb-2"
      : "text-muted-foreground hover:text-foreground pb-2"

  return (
    <header className="w-full border-b bg-background">
      {isAuthenticated && (
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Financy" className="h-6" />
          </div>

          <nav className="flex items-center gap-6 text-sm">
            <Link to="/" className={linkClass(isDashboardPage)}>
              Dashboard
            </Link>
            <Link to="/transactions" className={linkClass(isTransactionsPage)}>
              Transações
            </Link>
            <Link to="/categories" className={linkClass(isCategoriesPage)}>
              Categorias
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-muted text-foreground">
                {user?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
