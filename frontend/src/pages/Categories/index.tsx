import { useState } from "react"
import { useMutation, useQuery } from "@apollo/client/react"
import { LIST_CATEGORIES } from "@/lib/graphql/queries/Category"
import { DELETE_CATEGORY } from "@/lib/graphql/mutations/Category"
import type { Category } from "@/types"
import { Page } from "@/components/Page"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CategoryDialog } from "./components/CategoryDialog"
import { toast } from "sonner"

type ListCategoriesData = {
  listCategories: Category[]
}

export function CategoriesPage() {
  const { data, refetch } = useQuery<ListCategoriesData>(LIST_CATEGORIES)
  const categories = data?.listCategories ?? []
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

  return (
    <Page>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Categorias</h1>
            <p className="text-sm text-muted-foreground">
              Organize suas transações com categorias personalizadas
            </p>
          </div>
          <Button onClick={handleCreate}>Nova categoria</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Suas categorias</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {categories.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhuma categoria cadastrada ainda.
              </p>
            )}
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between rounded-lg border px-4 py-3"
              >
                <span>{category.name}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                    Editar
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(category.id)}>
                    Excluir
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
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
