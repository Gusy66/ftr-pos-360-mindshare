import { useEffect, useState } from "react"
import { useMutation } from "@apollo/client/react"
import { CREATE_CATEGORY, UPDATE_CATEGORY } from "@/lib/graphql/mutations/Category"
import type { Category } from "@/types"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

type CategoryDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
  onCompleted: () => void
}

export function CategoryDialog({ open, onOpenChange, category, onCompleted }: CategoryDialogProps) {
  const [name, setName] = useState("")
  const isEdit = Boolean(category)

  const [createCategory, { loading: creating }] = useMutation(CREATE_CATEGORY, {
    onCompleted: () => {
      toast.success("Categoria criada com sucesso!")
      onCompleted()
      onOpenChange(false)
    },
    onError: () => toast.error("Erro ao criar categoria."),
  })

  const [updateCategory, { loading: updating }] = useMutation(UPDATE_CATEGORY, {
    onCompleted: () => {
      toast.success("Categoria atualizada com sucesso!")
      onCompleted()
      onOpenChange(false)
    },
    onError: () => toast.error("Erro ao atualizar categoria."),
  })

  useEffect(() => {
    setName(category?.name ?? "")
  }, [category, open])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!name.trim()) return

    if (isEdit && category) {
      await updateCategory({
        variables: { id: category.id, data: { name } },
      })
      return
    }

    await createCategory({
      variables: { data: { name } },
    })
  }

  const isLoading = creating || updating

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar categoria" : "Nova categoria"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">Nome da categoria</Label>
            <Input
              id="category-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex.: Alimentação"
            />
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
