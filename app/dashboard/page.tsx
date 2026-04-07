import Link from "next/link"
import { getAllEntries } from "@/actions/entries"
import { calcularResumen } from "@/lib/logic/metricas"
import { DashboardMetrics } from "@/components/app/DashboardMetrics"
import { CalendarioMensual } from "@/components/app/CalendarioMensual"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default async function DashboardPage() {
  const entries = await getAllEntries()
  const metricas = calcularResumen(entries)
  const hoy = format(new Date(), "yyyy-MM-dd")
  const registroHoy = entries.find(e => e.entry_date === hoy)
  const fechaLabel = format(new Date(), "EEEE d 'de' MMMM", { locale: es })

  return (
    <div className="space-y-6">
      <Card>
        <p className="text-xs text-neutral-400 capitalize mb-1">{fechaLabel}</p>
        {registroHoy ? (
          <div className="space-y-2">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Registro completado.</p>
            <div className="flex gap-2 flex-wrap text-xs text-neutral-500">
              <span>{registroHoy.used_substance ? "Hubo consumo" : "Sin consumo"}</span>
              <span>.</span>
              <span>{registroHoy.meditated ? `Medito ${registroHoy.meditation_minutes ?? 0} min` : "No medito"}</span>
            </div>
            <Link href={`/dashboard/registro?fecha=${hoy}`}>
              <Button variant="ghost">Editar registro de hoy</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-neutral-500">Hoy todavia no registraste tu seguimiento.</p>
            <Link href="/dashboard/registro">
              <Button fullWidth>Registrar hoy</Button>
            </Link>
          </div>
        )}
      </Card>
      <DashboardMetrics m={metricas} />
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-neutral-500">Calendario</h2>
        <Card>
          <CalendarioMensual entries={entries} />
        </Card>
      </div>
    </div>
  )
}
