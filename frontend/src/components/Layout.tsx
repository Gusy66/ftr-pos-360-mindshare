import { Toaster } from "@/components/ui/sonner"
import { Header } from "./Header"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto w-full max-w-6xl px-6 py-6">{children}</main>
      <Toaster />
    </div>
  )
}
