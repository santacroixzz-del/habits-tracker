import { login } from "@/actions/auth"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div>
          <h1 className="text-xl font-medium">Acceso</h1>
          <p className="text-sm text-neutral-400 mt-1">Seguimiento personal</p>
        </div>
        <form action={login} className="space-y-3">
          <div>
            <label className="text-xs text-neutral-500 block mb-1">Email</label>
            <input name="email" type="email" required autoComplete="email"
              className="w-full border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-3 text-sm bg-transparent"
            />
          </div>
          <div>
            <label className="text-xs text-neutral-500 block mb-1">Contrasena</label>
            <input name="password" type="password" required autoComplete="current-password"
              className="w-full border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-3 text-sm bg-transparent"
            />
          </div>
          {params.error && (
            <p className="text-sm text-red-500">Credenciales incorrectas.</p>
          )}
          <button type="submit"
            className="w-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 py-3 rounded-lg text-sm font-medium hover:bg-neutral-700 transition-colors"
          >Ingresar</button>
        </form>
      </div>
    </div>
  )
}
