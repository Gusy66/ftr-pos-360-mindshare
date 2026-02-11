import { useState } from "react"
import { useMutation, useQuery } from "@apollo/client/react"
import { LIST_CATEGORIES } from "@/lib/graphql/queries/Category"
import { LIST_TRANSACTIONS } from "@/lib/graphql/queries/Transaction"
import { DELETE_CATEGORY } from "@/lib/graphql/mutations/Category"
import type { Category } from "@/types"
import { Page } from "@/components/Page"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CategoryDialog } from "./components/CategoryDialog"
import { toast } from "sonner"
import { Pencil, Tag, Trash2 } from "lucide-react"

type ListCategoriesData = {
  listCategories: Category[]
}

export function CategoriesPage() {
  const { data, refetch } = useQuery<ListCategoriesData>(LIST_CATEGORIES)
  const categories = data?.listCategories ?? []
  const { data: transactionData } = useQuery(LIST_TRANSACTIONS)
  const transactions = transactionData?.listTransactions ?? []
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    onCompleted: () => {
      toast.success("Categoria removida com sucesso!")
      refetch()
    },
    onError: () => toast.error("Erro ao remover categoria."),
  })

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setSelectedCategory(null)
    setDialogOpen(true)
  }

  const handleDelete = async (categoryId: string) => {
    await deleteCategory({ variables: { id: categoryId } })
  }

  const categoryTotals = categories.map((category) => {
    const related = transactions.filter((item: any) => item.categoryId === category.id)
    return {
      id: category.id,
      name: category.name,
      count: related.length,
    }
  })
  const mostUsed = categoryTotals.sort((a, b) => b.count - a.count)[0]
  const totalTransactions = transactions.length

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
            <h1 className="text-2xl font-semibold">Categorias</h1>
            <p className="text-sm text-muted-foreground">
              Organize suas transações por categorias
            </p>
          </div>
          <Button onClick={handleCreate}>+ Nova categoria</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="rounded-2xl border-border/60">
            <CardHeader className="flex-row items-center gap-3">
              <div className="rounded-full bg-muted p-2">
                <Tag className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total de categorias</p>
                <CardTitle className="text-xl">{categories.length}</CardTitle>
              </div>
            </CardHeader>
          </Card>
          <Card className="rounded-2xl border-border/60">
            <CardHeader className="flex-row items-center gap-3">
              <div className="rounded-full bg-muted p-2">
                <Tag className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total de transações</p>
                <CardTitle className="text-xl">{totalTransactions}</CardTitle>
              </div>
            </CardHeader>
          </Card>
          <Card className="rounded-2xl border-border/60">
            <CardHeader className="flex-row items-center gap-3">
              <div className="rounded-full bg-muted p-2">
                <Tag className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Categoria mais utilizada</p>
                <CardTitle className="text-xl">
                  {mostUsed?.name ?? "-"}
                </CardTitle>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {categories.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhuma categoria cadastrada ainda.
            </p>
          )}
          {categories.map((category) => (
            <Card key={category.id} className="rounded-2xl border-border/60">
              <CardContent className="flex h-full flex-col gap-4 pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                    <Tag className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(category)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-base font-semibold">{category.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {categoryTotals.find((item) => item.id === category.id)?.count ?? 0} itens
                  </p>
                </div>
                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs ${badgeClasses(
                    category.name
                  )}`}
                >
                  {category.name}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={selectedCategory}
        onCompleted={refetch}
      />
    </Page>
  )
}
