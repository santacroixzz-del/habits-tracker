"use server"

import { revalidatePath } from "next/cache"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { CheckinInsert, MeditationSessionInsert, GratitudeInsert } from "@/lib/types"

async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}

export async function upsertCheckin(data: CheckinInsert) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "No autenticado." }

  const { data: result, error } = await supabase
    .from("checkins")
    .upsert(
      { ...data, user_id: user.id },
      { onConflict: "user_id,checkin_date,checkin_type" }
    )
    .select()
    .single()

  if (error) return { error: "No se pudo guardar el check-in." }
  revalidatePath("/dashboard")
  return { success: true, id: result?.id }
}

export async function addMeditationSession(data: MeditationSessionInsert) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "No autenticado." }

  const { error } = await supabase
    .from("meditation_sessions")
    .insert({ ...data, user_id: user.id })

  if (error) return { error: "No se pudo guardar la sesion." }
  revalidatePath("/dashboard")
  return { success: true }
}

export async function deleteMeditationSession(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "No autenticado." }

  const { error } = await supabase
    .from("meditation_sessions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) return { error: "No se pudo eliminar la sesion." }
  revalidatePath("/dashboard")
  return { success: true }
}

export async function upsertGratitude(data: GratitudeInsert) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "No autenticado." }

  const { error } = await supabase
    .from("gratitudes")
    .upsert(
      { ...data, user_id: user.id },
      { onConflict: "user_id,gratitude_date" }
    )

  if (error) return { error: "No se pudo guardar." }
  revalidatePath("/dashboard")
  return { success: true }
}

export async function getCheckinsByDate(date: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from("checkins")
    .select("*")
    .eq("user_id", user.id)
    .eq("checkin_date", date)

  return data ?? []
}

export async function getMeditationSessionsByDate(date: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from("meditation_sessions")
    .select("*")
    .eq("user_id", user.id)
    .eq("session_date", date)
    .order("start_time", { ascending: true })

  return data ?? []
}

export async function getRecentCheckins(days: number = 30) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const desde = new Date()
  desde.setDate(desde.getDate() - days)

  const { data } = await supabase
    .from("checkins")
    .select("*")
    .eq("user_id", user.id)
    .gte("checkin_date", desde.toISOString().split("T")[0])
    .order("checkin_date", { ascending: false })

  return data ?? []
}
