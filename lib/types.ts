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

export type MeditationSession = {
  id: string
  user_id: string
  session_date: string
  start_time: string | null
  duration_minutes: number
  created_at: string
}

export type MeditationSessionInsert = {
  session_date: string
  start_time: string | null
  duration_minutes: number
}

export type CheckinType = "midday" | "night"

export type Checkin = {
  id: string
  user_id: string
  checkin_date: string
  checkin_type: CheckinType
  anxiety_level: 1 | 2 | 3 | 4 | 5
  mood_level: 1 | 2 | 3 | 4 | 5
  energy_level: 1 | 2 | 3 | 4 | 5
  used_substance: boolean | null
  notes: string | null
  prayed: boolean | null
  went_to_church: boolean | null
  prayer_notes: string | null
  created_at: string
}

export type CheckinInsert = {
  checkin_date: string
  checkin_type: CheckinType
  anxiety_level: number
  mood_level: number
  energy_level: number
  used_substance?: boolean
  notes?: string | null
  prayed?: boolean
  went_to_church?: boolean
  prayer_notes?: string | null
}

export type Gratitude = {
  id: string
  user_id: string
  gratitude_date: string
  text_1: string
  text_2: string
  text_3: string
  created_at: string
}

export type GratitudeInsert = {
  gratitude_date: string
  text_1: string
  text_2: string
  text_3: string
}

export type DayStatus = "clean" | "used" | "unregistered"
