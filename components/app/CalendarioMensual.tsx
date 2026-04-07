"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  startOfMonth, endOfMonth, eachDayOfInterval,
  format, getDay, isFuture, isToday,
  addMonths, subMonths, isSameMonth,
} from "date-fns"
import { es } from "date-fns/locale"
import { DailyEntry } from "@/lib/types"

type Props = { entries: DailyEntry[] }
type DayState = "clean" | "used" | "unregistered" | "future" | "today-empty" | "today-clean" | "today-used"

function buildEntryMap(entries: DailyEntry[]): Map<string, DailyEntry> {
  return new Map(entries.map(e => [e.entry_date, e]))
}

export function CalendarioMensual({ entries }: Props) {
  const router = useRouter()
  const [mesActual, setMesActual] = useState(startOfMonth(new Date()))
  const entryMap = buildEntryMap(entries)
  const diasDelMes = eachDayOfInterval({ start: startOfMonth(mesActual), end: endOfMonth(mesActual) })
  const primerDia = getDay(startOfMonth(mesActual))
  const offsetInicio = primerDia === 0 ? 6 : primerDia - 1

  function getDayState(fecha: Date): DayState {
    const key = format(fecha, "yyyy-MM-dd")
    const entry = entryMap.get(key)
    const hoy = isToday(fecha)
    const futuro = isFuture(fecha) && !hoy
    if (futuro) return "future"
    if (!entry) return hoy ? "today-empty" : "unregistered"
    if (hoy) return entry.used_substance ? "today-used" : "today-clean"
    return entry.used_substance ? "used" : "clean"
  }

  function cellStyle(state: DayState): string {
    switch (state) {
      case "clean": return "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200 hover:bg-neutral-300"
      case "used": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-red-200"
      case "unregistered": return "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400 hover:bg-amber-100"
      case "today-empty": return "ring-2 ring-neutral-400 text-neutral-600 dark:text-neutral-300"
      case "today-clean": return "ring-2 ring-neutral-500 bg-neutral-200 text-neutral-800 dark:bg-neutral-700"
      case "today-used": return "ring-2 ring-red-400 bg-red-100 text-red-800 dark:bg-red-900"
      case "future": return "text-neutral-200 dark:text-neutral-700"
      default: return ""
    }
  }

  const mesLabel = format(mesActual, "MMMM yyyy", { locale: es })
  const esEsteMes = isSameMonth(mesActual, new Date())

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <button onClick={() => setMesActual(m => subMonths(m, 1))} className="p-2 rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M10 12L6 8l4-4"/></svg>
        </button>
        <span className="text-sm font-medium capitalize">{mesLabel}</span>
        <button onClick={() => setMesActual(m => addMonths(m, 1))} disabled={esEsteMes} className="p-2 rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 12l4-4-4-4"/></svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {["Lu","Ma","Mi","Ju","Vi","Sa","Do"].map(d => (
          <div key={d} className="text-center text-xs text-neutral-400 py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: offsetInicio }).map((_, i) => <div key={`e-${i}`} />)}
        {diasDelMes.map(dia => {
          const state = getDayState(dia)
          const meditated = entryMap.get(format(dia, "yyyy-MM-dd"))?.meditated ?? false
          return (
            <button key={dia.toISOString()} onClick={() => { if (!isFuture(dia) || isToday(dia)) router.push(`/dashboard/registro?fecha=${format(dia, "yyyy-MM-dd")}`) }}
              disabled={state === "future"}
              className={`relative aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-medium transition-colors ${cellStyle(state)} ${state === "future" ? "cursor-default" : "cursor-pointer"}`}
            >
              <span>{format(dia, "d")}</span>
              {meditated && state !== "future" && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-current opacity-50" />}
            </button>
          )
        })}
      </div>
      <div className="flex gap-3 flex-wrap pt-1">
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-neutral-200 dark:bg-neutral-700"/><span className="text-xs text-neutral-400">Limpio</span></div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-100 dark:bg-red-900"/><span className="text-xs text-neutral-400">Consumo</span></div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-50 dark:bg-amber-950"/><span className="text-xs text-neutral-400">Sin registrar</span></div>
      </div>
    </div>
  )
}
