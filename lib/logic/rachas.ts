import { DailyEntry } from "../types"
import { eachDayOfInterval, parseISO, format, subDays } from "date-fns"

export function buildEntryMap(entries: DailyEntry[]): Map<string, DailyEntry> {
  return new Map(entries.map(e => [e.entry_date, e]))
}

export function calcularRachaActual(entries: DailyEntry[]): number {
  if (entries.length === 0) return 0
  const sorted = [...entries].sort((a, b) => b.entry_date.localeCompare(a.entry_date))
  const map = buildEntryMap(entries)
  let racha = 0
  let cursor = parseISO(sorted[0].entry_date)
  while (true) {
    const key = format(cursor, "yyyy-MM-dd")
    const entry = map.get(key)
    if (!entry || entry.used_substance) break
    racha++
    cursor = subDays(cursor, 1)
  }
  return racha
}

export function calcularMejorRacha(entries: DailyEntry[]): number {
  if (entries.length === 0) return 0
  const sorted = [...entries].sort((a, b) => a.entry_date.localeCompare(b.entry_date))
  const map = buildEntryMap(entries)
  const diasCalendario = eachDayOfInterval({
    start: parseISO(sorted[0].entry_date),
    end: parseISO(sorted[sorted.length - 1].entry_date),
  })
  let rachaActual = 0
  let mejorRacha = 0
  for (const dia of diasCalendario) {
    const key = format(dia, "yyyy-MM-dd")
    const entry = map.get(key)
    if (entry && !entry.used_substance) {
      rachaActual++
      if (rachaActual > mejorRacha) mejorRacha = rachaActual
    } else {
      rachaActual = 0
    }
  }
  return mejorRacha
}
