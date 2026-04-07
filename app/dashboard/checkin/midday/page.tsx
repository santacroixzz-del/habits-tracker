import { format } from "date-fns"
import { CheckinForm } from "@/components/app/CheckinForm"
import { getCheckinsByDate, getMeditationSessionsByDate, getRecentCheckins } from "@/actions/checkins"

export default async function MiddayCheckinPage() {
  const today = format(new Date(), "yyyy-MM-dd")
  const [checkins, sessions, recentCheckins] = await Promise.all([
    getCheckinsByDate(today),
    getMeditationSessionsByDate(today),
    getRecentCheckins(30),
  ])

  const existingCheckin = checkins.find(c => c.checkin_type === "midday") ?? null

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-medium">Check-in mediodia</h1>
        <p className="text-xs text-neutral-400 mt-1 capitalize">{format(new Date(), "EEEE d 'de' MMMM")}</p>
      </div>
      <CheckinForm
        type="midday"
        date={today}
        existingCheckin={existingCheckin}
        existingSessions={sessions}
        recentData={{ checkins: recentCheckins, sessions }}
      />
    </div>
  )
}
