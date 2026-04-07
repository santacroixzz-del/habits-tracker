import { Card } from "@/components/ui/Card"
import { ResumenMetricas } from "@/lib/logic/metricas"

export function DashboardMetrics({ m }: { m: ResumenMetricas }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <p className="text-xs text-neutral-500 mb-1">Racha actual</p>
          <p className="text-3xl font-medium text-neutral-900 dark:text-neutral-100">{m.rachaActual}</p>
          <p className="text-xs text-neutral-400">dias sin consumo</p>
        </Card>
        <Card>
          <p className="text-xs text-neutral-500 mb-1">Mejor racha</p>
          <p className="text-3xl font-medium text-neutral-900 dark:text-neutral-100">{m.mejorRacha}</p>
          <p className="text-xs text-neutral-400">dias consecutivos</p>
        </Card>
      </div>
      <Card>
        <p className="text-xs text-neutral-500 mb-3">Ultimos 30 dias</p>
        <div className="space-y-2">
          <Row label="Dias limpios"     value={m.diasLimpios} />
          <Row label="Dias con consumo" value={m.diasConConsumo} accent="red" />
          <Row label="Sin registrar"    value={m.diasSinRegistrar} accent="amber" />
          <Row label="Con meditacion"   value={m.diasConMeditacion} />
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <Row label="Adherencia" value={`${m.adherencia}%`} />
          </div>
        </div>
      </Card>
    </div>
  )
}

function Row({ label, value, accent }: {
  label: string
  value: string | number
  accent?: "red" | "amber"
}) {
  const color = accent === "red"
    ? "text-red-600 dark:text-red-400"
    : accent === "amber"
    ? "text-amber-600 dark:text-amber-400"
    : "text-neutral-900 dark:text-neutral-100"
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-neutral-500">{label}</span>
      <span className={`text-sm font-medium ${color}`}>{value}</span>
    </div>
  )
}
