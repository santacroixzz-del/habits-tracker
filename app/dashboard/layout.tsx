import { logout } from "@/actions/auth"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-lg mx-auto px-4 pb-16">
      <header className="flex justify-between items-center py-4 border-b border-neutral-100 dark:border-neutral-800 mb-6">
        <a href="/dashboard" className="text-sm font-medium">Seguimiento</a>
        <nav className="flex items-center gap-4">
          <a href="/dashboard/historial" className="text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200">Historial</a>
          <form action={logout}>
            <button type="submit" className="text-sm text-neutral-400 hover:text-neutral-600">Salir</button>
          </form>
        </nav>
      </header>
      {children}
    </div>
  )
}
