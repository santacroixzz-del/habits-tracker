import { format } from "date-fns"
import { CheckinForm } from "@/components/app/CheckinForm"
import { getCheckinsByDate, getMeditationSessionsByDate, getRecentCheckins } from "@/actions/checkins"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

async function getGratitude(date: string) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {}
        },
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from("gratitudes").select("*").eq("user_id", user.id).eq("gratitude_date", date).single()
  return data
}

export default async function NightCheckinPage() {
  const today = format(new Date(), "yyyy-MM-dd")
  const [checkins, sessions, recentCheckins, gratitude] = await Promise.all([
    getCheckinsByDate(today),
    getMeditationSessionsByDate(today),
    getRecentCheckins(30),
    getGratitude(today),
  ])

  const existingCheckin = checkins.find(c => c.checkin_type === "night") ?? null

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-medium">Check-in noche</h1>
        <p className="text-xs text-neutral-400 mt-1 capitalize">{format(new Date(), "EEEE d 'de' MMMM")}</p>
      </div>
      <CheckinForm
        type="night"
        date={today}
        existingCheckin={existingCheckin}
        existingSessions={sessions}
        existingGratitude={gratitude}
        recentData={{ checkins: recentCheckins, sessions }}
      />
    </div>
  )
}
