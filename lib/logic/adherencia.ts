import { DailyEntry } from "../types"
import { eachDayOfInterval, format, startOfDay } from "date-fns"
import { buildEntryMap } from "./rachas"

export function calcularDiasSinRegistrar(entries: DailyEntry[], desde: Date, hasta: Date): number {
  const map = buildEntryMap(entries)
  const dias = eachDayOfInterval({ start: startOfDay(desde), end: startOfDay(hasta) })
  return dias.filter(d => !map.has(format(d, "yyyy-MM-dd"))).length
}

export function calcularAdherencia(entries: DailyEntry[], desde: Date, hasta: Date): number {
  const total = eachDayOfInterval({ start: desde, end: hasta }).length
  if (total === 0) return 0
  const sinRegistrar = calcularDiasSinRegistrar(entries, desde, hasta)
  return Math.round(((total - sinRegistrar) / total) * 100)
}
