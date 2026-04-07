export type DailyEntry = {
  id: string
  user_id: string
  entry_date: string
  meditated: boolean
  meditation_minutes: number | null
  used_substance: boolean
  anxiety_level: 1 | 2 | 3 | 4 | 5
  mood_level: 1 | 2 | 3 | 4 | 5
  sleep_quality: 1 | 2 | 3 | 4 | 5
  energy_level: 1 | 2 | 3 | 4 | 5
  notes: string | null
  created_at: string
  updated_at: string
}

export type DailyEntryInsert = {
  entry_date: string
  meditated: boolean
  meditation_minutes: number | null
  used_substance: boolean
  anxiety_level: number
  mood_level: number
  sleep_quality: number
  energy_level: number
  notes: string | null
}

export type DayStatus = "clean" | "used" | "unregistered"
