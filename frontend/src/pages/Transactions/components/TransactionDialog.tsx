import { useEffect, useState } from "react"
import { useMutation } from "@apollo/client/react"
import { CREATE_TRANSACTION, UPDATE_TRANSACTION } from "@/lib/graphql/mutations/Transaction"
import type { Category, Transaction, TransactionType } from "@/types"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

type TransactionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
  transaction?: Transaction | null
  onCompleted: () => void
}

const todayString = () => new Date().toISOString().slice(0, 10)

export function TransactionDialog({
  open,
  onOpenChange,
  categories,
  transaction,
  onCompleted,
}: TransactionDialogProps) {
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [type, setType] = useState<TransactionType>("expense")
  const [date, setDate] = useState(todayString())
  const [categoryId, setCategoryId] = useState("")
  const isEdit = Boolean(transaction)

  const [createTransaction, { loading: creating }] = useMutation(CREATE_TRANSACTION, {
    onCompleted: () => {
      toast.success("Transação criada com sucesso!")
      onCompleted()
      onOpenChange(false)
    },
    onError: () => toast.error("Erro ao criar transação."),
  })

  const [updateTransaction, { loading: updating }] = useMutation(UPDATE_TRANSACTION, {
    onCompleted: () => {
      toast.success("Transação atualizada com sucesso!")
      onCompleted()
      onOpenChange(false)
    },
    onError: () => toast.error("Erro ao atualizar transação."),
  })

  useEffect(() => {
    if (transaction) {
      setTitle(transaction.title)
      setAmount(transaction.amount.toString())
      setType(transaction.type)
      setDate(new Date(transaction.date).toISOString().slice(0, 10))
      setCategoryId(transaction.categoryId)
      return
    }

    setTitle("")
    setAmount("")
    setType("expense")
    setDate(todayString())
    setCategoryId(categories[0]?.id ?? "")
  }, [transaction, categories, open])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!title.trim() || !amount || !categoryId) return

    const payload = {
      title,
      amount: Number(amount),
      type,
      date: new Date(date).toISOString(),
      categoryId,
    }

    if (isEdit && transaction) {
      await updateTransaction({
        variables: { id: transaction.id, data: payload },
      })
      return
    }

    await createTransaction({
      variables: { data: payload },
    })
  }

  const isLoading = creating || updating

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar transação" : "Nova transação"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ex.: Supermercado"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="0,00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <select
                id="type"
                value={type}
                onChange={(event) => setType(event.target.value as TransactionType)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="income">Receita</option>
                <option value="expense">Despesa</option>
              </select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <select
                id="category"
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isEdit ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
