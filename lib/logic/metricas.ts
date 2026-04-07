import { DailyEntry } from "../types"
import { subDays, startOfDay, parseISO, isWithinInterval } from "date-fns"
import { calcularDiasSinRegistrar, calcularAdherencia } from "./adherencia"
import { calcularRachaActual, calcularMejorRacha } from "./rachas"

export type ResumenMetricas = {
  rachaActual: number
  mejorRacha: number
  diasLimpios: number
  diasConConsumo: number
  diasSinRegistrar: number
  diasConMeditacion: number
  adherencia: number
}

export function calcularResumen(entries: DailyEntry[], diasRango = 30): ResumenMetricas {
  const hoy = startOfDay(new Date())
  const desde = subDays(hoy, diasRango - 1)
  const enRango = entries.filter(e =>
    isWithinInterval(parseISO(e.entry_date), { start: desde, end: hoy })
  )
  return {
    rachaActual:       calcularRachaActual(entries),
    mejorRacha:        calcularMejorRacha(entries),
    diasLimpios:       enRango.filter(e => !e.used_substance).length,
    diasConConsumo:    enRango.filter(e => e.used_substance).length,
    diasSinRegistrar:  calcularDiasSinRegistrar(entries, desde, hoy),
    diasConMeditacion: enRango.filter(e => e.meditated).length,
    adherencia:        calcularAdherencia(entries, desde, hoy),
  }
}
