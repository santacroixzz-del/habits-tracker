import Link from "next/link"
import { getAllEntries } from "@/actions/entries"
import { getCheckinsByDate } from "@/actions/checkins"
import { calcularResumen } from "@/lib/logic/metricas"
import { DashboardMetrics } from "@/components/app/DashboardMetrics"
import { CalendarioMensual } from "@/components/app/CalendarioMensual"
import { Card } from "@/components/ui/Card"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default async function DashboardPage() {
  const today = format(new Date(), "yyyy-MM-dd")
  const [entries, checkins] = await Promise.all([
    getAllEntries(),
    getCheckinsByDate(today),
  ])

  const metricas = calcularResumen(entries)
  const registroHoy = entries.find(e => e.entry_date === today)
  const middayDone = checkins.some(c => c.checkin_type === "midday")
  const nightDone = checkins.some(c => c.checkin_type === "night")
  const fechaLabel = format(new Date(), "EEEE d 'de' MMMM", { locale: es })

  return (
    <div className="space-y-6">
      <Card>
        <p className="text-xs text-neutral-400 capitalize mb-3">{fechaLabel}</p>
        <div className="space-y-2">
          <Link href="/dashboard/registro">
            <div className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-colors ${registroHoy ? "border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900" : "border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-900"}`}>
              <div>
                <p className="text-sm font-medium">Registro diario</p>
                <p className="text-xs text-neutral-400">{registroHoy ? (registroHoy.used_substance ? "Hubo consumo" : "Sin consumo") : "Sin completar"}</p>
              </div>
              <span className="text-lg">{registroHoy ? "✓" : "→"}</span>
            </div>
          </Link>
          <Link href="/dashboard/checkin/midday">
            <div className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-colors ${middayDone ? "border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900" : "border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-900"}`}>
              <div>
                <p className="text-sm font-medium">Check-in mediodia</p>
                <p className="text-xs text-neutral-400">{middayDone ? "Completado" : "Como estas ahora?"}</p>
              </div>
              <span className="text-lg">{middayDone ? "✓" : "→"}</span>
            </div>
          </Link>
          <Link href="/dashboard/checkin/night">
            <div className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-colors ${nightDone ? "border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900" : "border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-900"}`}>
              <div>
                <p className="text-sm font-medium">Check-in noche</p>
                <p className="text-xs text-neutral-400">{nightDone ? "Completado" : "Cierre del dia"}</p>
              </div>
              <span className="text-lg">{nightDone ? "✓" : "→"}</span>
            </div>
          </Link>
        </div>
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
