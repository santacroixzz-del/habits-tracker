"use server"

import { revalidatePath } from "next/cache"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { DailyEntryInsert } from "../lib/types"

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

export async function upsertEntry(data: DailyEntryInsert) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "No autenticado." }
  const payload = {
    ...data,
    user_id: user.id,
    meditation_minutes: data.meditated ? (data.meditation_minutes ?? null) : null,
  }
  const { error } = await supabase
    .from("daily_entries")
    .upsert(payload, { onConflict: "user_id,entry_date" })
  if (error) return { error: "No se pudo guardar el registro." }
  revalidatePath("/app")
  revalidatePath("/app/historial")
  return { success: true }
}

export async function getAllEntries() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data, error } = await supabase
    .from("daily_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("entry_date", { ascending: false })
  if (error) return []
  return data
}
