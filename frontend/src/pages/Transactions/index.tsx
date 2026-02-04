import { useMemo, useState } from "react"
import { useMutation, useQuery } from "@apollo/client/react"
import { LIST_TRANSACTIONS } from "@/lib/graphql/queries/Transaction"
import { LIST_CATEGORIES } from "@/lib/graphql/queries/Category"
import { DELETE_TRANSACTION } from "@/lib/graphql/mutations/Transaction"
import type { Category, Transaction } from "@/types"
import { Page } from "@/components/Page"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionDialog } from "./components/TransactionDialog"
import { toast } from "sonner"
import { Link } from "react-router-dom"

type ListTransactionsData = {
  listTransactions: Transaction[]
}

type ListCategoriesData = {
  listCategories: Category[]
}

export function TransactionsPage() {
  const [search, setSearch] = useState("")
  const [month, setMonth] = useState<string>("")
  const [year, setYear] = useState<string>("")

  const variables = useMemo(() => {
    return {
      search: search.trim() || undefined,
      month: month ? Number(month) : undefined,
      year: year ? Number(year) : undefined,
    }
  }, [search, month, year])

  const { data: transactionData, refetch: refetchTransactions } =
    useQuery<ListTransactionsData>(LIST_TRANSACTIONS, {
      variables,
    })
  const { data: categoryData } = useQuery<ListCategoriesData>(LIST_CATEGORIES)
  const transactions = transactionData?.listTransactions ?? []
  const categories = categoryData?.listCategories ?? []

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  const [deleteTransaction] = useMutation(DELETE_TRANSACTION, {
    onCompleted: () => {
      toast.success("Transação removida com sucesso!")
      refetchTransactions()
    },
    onError: () => toast.error("Erro ao remover transação."),
  })

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setSelectedTransaction(null)
    setDialogOpen(true)
  }

  const handleDelete = async (transactionId: string) => {
    await deleteTransaction({ variables: { id: transactionId } })
  }

  const handleClearFilters = () => {
    setSearch("")
    setMonth("")
    setYear("")
  }

  const monthOptions = [
    { value: "1", label: "Janeiro" },
    { value: "2", label: "Fevereiro" },
    { value: "3", label: "Março" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Maio" },
    { value: "6", label: "Junho" },
    { value: "7", label: "Julho" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ]

  return (
    <Page>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Transações</h1>
            <p className="text-sm text-muted-foreground">
              Registre entradas e saídas do seu orçamento
            </p>
          </div>
          <div className="flex gap-3">
            {categories.length === 0 && (
              <Button variant="outline" asChild>
                <Link to="/categories">Criar categoria</Link>
              </Button>
            )}
            <Button onClick={handleCreate} disabled={categories.length === 0}>
              Nova transação
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Buscar por título</label>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Ex.: Supermercado"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mês</label>
              <select
                value={month}
                onChange={(event) => setMonth(event.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Todos</option>
                {monthOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ano</label>
              <input
                type="number"
                value={year}
                onChange={(event) => setYear(event.target.value)}
                placeholder="Todos"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
            </div>
            <div className="md:col-span-4">
              <Button variant="outline" onClick={handleClearFilters}>
                Limpar filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Suas transações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {transactions.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhuma transação cadastrada ainda.
              </p>
            )}
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex flex-col gap-2 rounded-lg border px-4 py-3 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-medium">{transaction.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.category?.name || "Sem categoria"} •{" "}
                    {new Date(transaction.date).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4 md:justify-end">
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
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(transaction)}>
                      Editar
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(transaction.id)}>
                      Excluir
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        categories={categories}
        transaction={selectedTransaction}
        onCompleted={refetchTransactions}
      />
    </Page>
  )
}
