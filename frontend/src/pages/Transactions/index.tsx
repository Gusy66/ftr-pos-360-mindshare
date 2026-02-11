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
import {
  ChevronDown,
  Pencil,
  Search,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react"

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
  const [type, setType] = useState<string>("")
  const [categoryId, setCategoryId] = useState<string>("")

  const variables = useMemo(() => {
    return {
      search: search.trim() || undefined,
      month: month ? Number(month) : undefined,
      year: year ? Number(year) : undefined,
      type: type || undefined,
      categoryId: categoryId || undefined,
    }
  }, [search, month, year, type, categoryId])

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
    setType("")
    setCategoryId("")
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

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("pt-BR")

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

  return (
    <Page>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Transações</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie todas as suas transações financeiras
            </p>
          </div>
          <Button onClick={handleCreate} disabled={categories.length === 0}>
            + Nova transação
          </Button>
        </div>

        <Card>
          <CardContent className="grid gap-4 pt-6 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar por descrição"
                  className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Tipo
              </label>
              <div className="relative">
                <select
                  value={type}
                  onChange={(event) => setType(event.target.value)}
                  className="h-10 w-full appearance-none rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Todos</option>
                  <option value="income">Entrada</option>
                  <option value="expense">Saída</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Categoria
              </label>
              <div className="relative">
                <select
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                  className="h-10 w-full appearance-none rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Todas</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Período
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <select
                    value={month}
                    onChange={(event) => setMonth(event.target.value)}
                    className="h-10 w-full appearance-none rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Mês</option>
                    {monthOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
                <input
                  type="number"
                  value={year}
                  onChange={(event) => setYear(event.target.value)}
                  placeholder="Ano"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                />
              </div>
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
            <CardTitle>Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-4 border-b pb-3 text-xs font-medium text-muted-foreground">
              <span className="col-span-2">Descrição</span>
              <span>Data</span>
              <span>Categoria</span>
              <span>Tipo</span>
              <span className="text-right">Valor</span>
            </div>
            {transactions.length === 0 ? (
              <p className="py-6 text-sm text-muted-foreground">
                Nenhuma transação cadastrada ainda.
              </p>
            ) : (
              <div className="divide-y">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="grid grid-cols-6 items-center gap-4 py-4 text-sm"
                  >
                    <div className="col-span-2 flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                          transaction.type === "income"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                      </div>
                      <span className="font-medium">{transaction.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(transaction.date)}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${badgeClasses(
                        transaction.category?.name || "Sem categoria"
                      )}`}
                    >
                      {transaction.category?.name || "Sem categoria"}
                    </span>
                    <span
                      className={
                        transaction.type === "income"
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }
                    >
                      {transaction.type === "income" ? "Entrada" : "Saída"}
                    </span>
                    <div className="flex items-center justify-end gap-3 text-right">
                      <span
                        className={
                          transaction.type === "income"
                            ? "text-emerald-600"
                            : "text-rose-600"
                        }
                      >
                        {transaction.type === "income" ? "+ " : "- "}
                        {formatCurrency(transaction.amount)}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(transaction)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDelete(transaction.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
