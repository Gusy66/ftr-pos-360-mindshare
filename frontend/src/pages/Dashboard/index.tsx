import { useMemo } from "react"
import { useQuery } from "@apollo/client/react"
import { LIST_TRANSACTIONS } from "@/lib/graphql/queries/Transaction"
import type { Transaction } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Page } from "@/components/Page"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import {
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react"

type ListTransactionsData = {
  listTransactions: Transaction[]
}

export function Dashboard() {
  const { data } = useQuery<ListTransactionsData>(LIST_TRANSACTIONS)
  const transactions = data?.listTransactions ?? []

  const summary = useMemo(() => {
    const income = transactions
      .filter((item) => item.type === "income")
      .reduce((acc, item) => acc + item.amount, 0)
    const expense = transactions
      .filter((item) => item.type === "expense")
      .reduce((acc, item) => acc + item.amount, 0)
    return {
      income,
      expense,
      balance: income - expense,
    }
  }, [transactions])

  const categoryStats = useMemo(() => {
    const map = new Map<
      string,
      { name: string; total: number; count: number }
    >()
    transactions.forEach((transaction) => {
      const categoryId = transaction.categoryId
      const name = transaction.category?.name || "Sem categoria"
      const current = map.get(categoryId) ?? { name, total: 0, count: 0 }
      current.total += transaction.amount
      current.count += 1
      map.set(categoryId, current)
    })
    return Array.from(map.values()).sort((a, b) => b.total - a.total)
  }, [transactions])

  const badgeClasses = (name: string) => {
    const palette: Record<string, string> = {
      Alimentação: "bg-blue-100 text-blue-700",
      Transporte: "bg-purple-100 text-purple-700",
      Mercado: "bg-orange-100 text-orange-700",
      Entretenimento: "bg-pink-100 text-pink-700",
      Saúde: "bg-red-100 text-red-700",
      Salário: "bg-emerald-100 text-emerald-700",
      Utilidades: "bg-amber-100 text-amber-700",
    }
    return palette[name] ?? "bg-muted text-muted-foreground"
  }

  const latestTransactions = transactions.slice(0, 5)

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("pt-BR")

  return (
    <Page>
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="rounded-2xl border-border/60">
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Saldo total</p>
                <CardTitle className="mt-2 text-xl">
                  {formatCurrency(summary.balance)}
                </CardTitle>
              </div>
              <div className="rounded-full bg-muted p-2">
                <ArrowUpRight className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
          </Card>
          <Card className="rounded-2xl border-border/60">
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Receitas do mês</p>
                <CardTitle className="mt-2 text-xl">
                  {formatCurrency(summary.income)}
                </CardTitle>
              </div>
              <div className="rounded-full bg-emerald-50 p-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
          </Card>
          <Card className="rounded-2xl border-border/60">
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Despesas do mês</p>
                <CardTitle className="mt-2 text-xl">
                  {formatCurrency(summary.expense)}
                </CardTitle>
              </div>
              <div className="rounded-full bg-rose-50 p-2">
                <TrendingDown className="h-4 w-4 text-rose-600" />
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
          <Card className="rounded-2xl border-border/60">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Transações recentes
              </CardTitle>
              <Button variant="ghost" size="sm" asChild className="gap-2">
                <Link to="/transactions">
                  Ver todas <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {latestTransactions.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nenhuma transação cadastrada ainda.
                </p>
              )}
              {latestTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between rounded-xl border px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                        transaction.type === "income"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{transaction.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${badgeClasses(
                      transaction.category?.name || "Sem categoria"
                    )}`}
                  >
                    {transaction.category?.name || "Sem categoria"}
                  </span>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full gap-2" asChild>
                <Link to="/transactions">+ Nova transação</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/60">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Categorias
              </CardTitle>
              <Button variant="ghost" size="sm" asChild className="gap-2">
                <Link to="/categories">
                  Gerenciar <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {categoryStats.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhuma categoria cadastrada ainda.
                </p>
              ) : (
                categoryStats.slice(0, 5).map((category) => (
                  <div
                    key={category.name}
                    className="flex items-center justify-between rounded-xl border px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{category.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {category.count} itens
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatCurrency(category.total)}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Page>
  )
}
