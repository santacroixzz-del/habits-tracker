"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/Badge"
import { DailyEntry } from "@/lib/types"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"

type Filter = "all" | "clean" | "used" | "meditated" | "no-meditated"

export function HistorialList({ entries }: { entries: DailyEntry[] }) {
  const router = useRouter()
  const [filter, setFilter] = useState<Filter>("all")
  const filtered = entries.filter(e => {
    if (filter === "clean") return !e.used_substance
    if (filter === "used") return e.used_substance
    if (filter === "meditated") return e.meditated
    if (filter === "no-meditated") return !e.meditated
    return true
  })
  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "clean", label: "Limpios" },
    { key: "used", label: "Con consumo" },
    { key: "meditated", label: "Medito" },
    { key: "no-meditated", label: "No medito" },
  ]
  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {filters.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${filter === f.key ? "bg-neutral-900 text-white border-neutral-900 dark:bg-neutral-100 dark:text-neutral-900" : "border-neutral-200 text-neutral-500 dark:border-neutral-700 hover:border-neutral-400"}`}
          >{f.label}</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="text-sm text-neutral-400 py-8 text-center">Sin registros para este filtro.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map(entry => (
            <div key={entry.id} className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  {format(parseISO(entry.entry_date), "d 'de' MMMM", { locale: es })}
                </p>
                <div className="flex gap-1.5 mt-1 flex-wrap">
                  <Badge status={entry.used_substance ? "used" : "clean"} />
                  <Badge status={entry.meditated ? "meditated" : "no-meditated"} />
                  {entry.meditated && entry.meditation_minutes && (
                    <span className="text-xs text-neutral-400">{entry.meditation_minutes} min</span>
                  )}
                </div>
              </div>
              <button onClick={() => router.push(`/dashboard/registro?fecha=${entry.entry_date}`)}
                className="text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors shrink-0"
              >Editar</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
