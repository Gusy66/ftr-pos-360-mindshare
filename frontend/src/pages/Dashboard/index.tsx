import { useMemo } from "react"
import { useQuery } from "@apollo/client/react"
import { LIST_TRANSACTIONS } from "@/lib/graphql/queries/Transaction"
import type { Transaction } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Page } from "@/components/Page"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

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

  const categoryTotals = useMemo(() => {
    const map = new Map<
      string,
      { name: string; income: number; expense: number }
    >()
    transactions.forEach((transaction) => {
      const categoryId = transaction.categoryId
      const name = transaction.category?.name || "Sem categoria"
      const current = map.get(categoryId) ?? { name, income: 0, expense: 0 }
      if (transaction.type === "income") {
        current.income += transaction.amount
      } else {
        current.expense += transaction.amount
      }
      map.set(categoryId, current)
    })
    return Array.from(map.values()).sort(
      (a, b) => b.income + b.expense - (a.income + a.expense)
    )
  }, [transactions])

  const maxCategoryTotal = Math.max(
    1,
    ...categoryTotals.map((item) => item.income + item.expense)
  )

  const totalVolume = summary.income + summary.expense

  const latestTransactions = transactions.slice(0, 5)

  return (
    <Page>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Visão geral das suas finanças
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link to="/categories">Nova categoria</Link>
            </Button>
            <Button asChild>
              <Link to="/transactions">Nova transação</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Receitas</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold text-emerald-600">
                {summary.income.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Despesas</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold text-rose-600">
                {summary.expense.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Saldo</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold">
                {summary.balance.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Receitas x Despesas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {totalVolume === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Adicione transações para visualizar o gráfico.
                </p>
              ) : (
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Receitas</span>
                      <span className="text-emerald-600">
                        {summary.income.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-emerald-100">
                      <div
                        className="h-2 rounded-full bg-emerald-500"
                        style={{
                          width: `${(summary.income / totalVolume) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Despesas</span>
                      <span className="text-rose-600">
                        {summary.expense.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-rose-100">
                      <div
                        className="h-2 rounded-full bg-rose-500"
                        style={{
                          width: `${(summary.expense / totalVolume) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Totais por categoria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {categoryTotals.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhuma categoria com transações ainda.
                </p>
              ) : (
                categoryTotals.map((category) => {
                  const total = category.income + category.expense
                  return (
                    <div key={category.name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>{category.name}</span>
                        <span className="font-medium">
                          {total.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{
                            width: `${(total / maxCategoryTotal) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          Receitas:{" "}
                          {category.income.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                        <span>
                          Despesas:{" "}
                          {category.expense.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Últimas transações</CardTitle>
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
                className="flex items-center justify-between rounded-lg border px-4 py-3"
              >
                <div>
                  <p className="font-medium">{transaction.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.category?.name || "Sem categoria"} •{" "}
                    {new Date(transaction.date).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <span
                  className={
                    transaction.type === "income"
                      ? "text-emerald-600"
                      : "text-rose-600"
                  }
                >
                  {transaction.amount.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </Page>
  )
}
