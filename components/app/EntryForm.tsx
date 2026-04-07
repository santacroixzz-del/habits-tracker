"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { upsertEntry } from "@/actions/entries"
import { DailyEntry } from "@/lib/types"

type Props = {
  existing?: DailyEntry | null
  entryDate: string
}

type Scale = 1 | 2 | 3 | 4 | 5

export function EntryForm({ existing, entryDate }: Props) {
  const router = useRouter()
  const [meditated, setMeditated] = useState(existing?.meditated ?? false)
  const [minutes, setMinutes] = useState(existing?.meditation_minutes ?? 0)
  const [usedSubstance, setUsedSubstance] = useState(existing?.used_substance ?? false)
  const [anxiety, setAnxiety] = useState<Scale>(existing?.anxiety_level ?? 3)
  const [mood, setMood] = useState<Scale>(existing?.mood_level ?? 3)
  const [sleep, setSleep] = useState<Scale>(existing?.sleep_quality ?? 3)
  const [energy, setEnergy] = useState<Scale>(existing?.energy_level ?? 3)
  const [notes, setNotes] = useState(existing?.notes ?? "")
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  async function handleSubmit() {
    setLoading(true)
    setFeedback(null)
    const result = await upsertEntry({
      entry_date: entryDate,
      meditated,
      meditation_minutes: meditated ? minutes : null,
      used_substance: usedSubstance,
      anxiety_level: anxiety,
      mood_level: mood,
      sleep_quality: sleep,
      energy_level: energy,
      notes: notes.trim() || null,
    })
    setLoading(false)
    if (result?.error) {
      setFeedback(result.error)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-neutral-400 uppercase tracking-wide">{entryDate}</p>
      <Card>
        <p className="text-sm font-medium mb-3">Meditaste hoy?</p>
        <Toggle value={meditated} onChange={setMeditated} labelOn="Si" labelOff="No" />
        {meditated && (
          <div className="mt-3">
            <label className="text-xs text-neutral-500">Minutos</label>
            <input type="number" min={1} max={480} value={minutes}
              onChange={e => setMinutes(Number(e.target.value))}
              className="mt-1 w-full border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-transparent"
            />
          </div>
        )}
      </Card>
      <Card>
        <p className="text-sm font-medium mb-3">Hubo consumo?</p>
        <Toggle value={usedSubstance} onChange={setUsedSubstance} labelOn="Si" labelOff="No" dangerOn />
      </Card>
      <Card>
        <p className="text-sm font-medium mb-4">Variables del dia</p>
        <div className="space-y-4">
          <ScaleInput label="Ansiedad" value={anxiety} onChange={v => setAnxiety(v as Scale)} />
          <ScaleInput label="Estado de animo" value={mood} onChange={v => setMood(v as Scale)} />
          <ScaleInput label="Calidad de sueno" value={sleep} onChange={v => setSleep(v as Scale)} />
          <ScaleInput label="Energia" value={energy} onChange={v => setEnergy(v as Scale)} />
        </div>
      </Card>
      <Card>
        <label className="text-sm font-medium">Notas <span className="text-neutral-400">(opcional)</span></label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
          placeholder="Cualquier cosa relevante del dia."
          className="mt-2 w-full border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-transparent resize-none"
        />
      </Card>
      {feedback && <p className="text-sm text-red-500">{feedback}</p>}
      <Button type="button" onClick={handleSubmit} disabled={loading} fullWidth>
        {loading ? "Guardando..." : existing ? "Guardar cambios" : "Guardar registro"}
      </Button>
    </div>
  )
}

function Toggle({ value, onChange, labelOn, labelOff, dangerOn }: {
  value: boolean; onChange: (v: boolean) => void
  labelOn: string; labelOff: string; dangerOn?: boolean
}) {
  return (
    <div className="flex gap-2">
      <button type="button" onClick={() => onChange(false)}
        className={`flex-1 py-3 rounded-lg text-sm font-medium border transition-colors ${!value ? "bg-neutral-900 text-white border-neutral-900 dark:bg-neutral-100 dark:text-neutral-900" : "border-neutral-200 text-neutral-500 dark:border-neutral-700"}`}
      >{labelOff}</button>
      <button type="button" onClick={() => onChange(true)}
        className={`flex-1 py-3 rounded-lg text-sm font-medium border transition-colors ${value ? dangerOn ? "bg-red-600 text-white border-red-600" : "bg-neutral-900 text-white border-neutral-900 dark:bg-neutral-100 dark:text-neutral-900" : "border-neutral-200 text-neutral-500 dark:border-neutral-700"}`}
      >{labelOn}</button>
    </div>
  )
}

function ScaleInput({ label, value, onChange }: {
  label: string; value: number; onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs text-neutral-500">{label}</span>
        <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">{value} / 5</span>
      </div>
      <div className="flex gap-2">
        {[1,2,3,4,5].map(n => (
          <button key={n} type="button" onClick={() => onChange(n)}
            className={`flex-1 py-2 rounded text-xs font-medium border transition-colors ${value === n ? "bg-neutral-800 text-white border-neutral-800 dark:bg-neutral-200 dark:text-neutral-900" : "border-neutral-200 text-neutral-400 dark:border-neutral-700 hover:border-neutral-400"}`}
          >{n}</button>
        ))}
      </div>
    </div>
  )
}
