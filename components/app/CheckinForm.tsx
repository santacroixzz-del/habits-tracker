"use client"

import { useState } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { CheckinType, MeditationSession } from "@/lib/types"
import { upsertCheckin, addMeditationSession, deleteMeditationSession, upsertGratitude } from "@/actions/checkins"
import { generateRecommendation } from "@/actions/ai"

type Props = {
  type: CheckinType
  date: string
  existingCheckin?: any
  existingSessions?: MeditationSession[]
  existingGratitude?: any
  recentData: { checkins: any[]; sessions: any[] }
}

type Scale = 1 | 2 | 3 | 4 | 5

export function CheckinForm({ type, date, existingCheckin, existingSessions = [], existingGratitude, recentData }: Props) {
  const [anxiety, setAnxiety] = useState<Scale>(existingCheckin?.anxiety_level ?? 3)
  const [mood, setMood] = useState<Scale>(existingCheckin?.mood_level ?? 3)
  const [energy, setEnergy] = useState<Scale>(existingCheckin?.energy_level ?? 3)
  const [usedSubstance, setUsedSubstance] = useState(existingCheckin?.used_substance ?? false)
  const [notes, setNotes] = useState(existingCheckin?.notes ?? "")
  const [sessions, setSessions] = useState<MeditationSession[]>(existingSessions)
  const [newDuration, setNewDuration] = useState(20)
  const [newTime, setNewTime] = useState("")
  const [gratitude1, setGratitude1] = useState(existingGratitude?.text_1 ?? "")
  const [gratitude2, setGratitude2] = useState(existingGratitude?.text_2 ?? "")
  const [gratitude3, setGratitude3] = useState(existingGratitude?.text_3 ?? "")
  const [loading, setLoading] = useState(false)
  const [recommendation, setRecommendation] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  async function handleAddSession() {
    if (newDuration < 1) return
    const result = await addMeditationSession({
      session_date: date,
      start_time: newTime || null,
      duration_minutes: newDuration,
    })
    if (result?.error) {
      setFeedback(result.error)
    } else {
      setSessions(prev => [...prev, {
        id: Math.random().toString(),
        user_id: "",
        session_date: date,
        start_time: newTime || null,
        duration_minutes: newDuration,
        created_at: new Date().toISOString(),
      }])
      setNewTime("")
      setNewDuration(20)
    }
  }

  async function handleDeleteSession(id: string) {
    await deleteMeditationSession(id)
    setSessions(prev => prev.filter(s => s.id !== id))
  }

  async function handleSubmit() {
    setLoading(true)
    setFeedback(null)

    const checkinData = {
      checkin_date: date,
      checkin_type: type,
      anxiety_level: anxiety,
      mood_level: mood,
      energy_level: energy,
      ...(type === "night" ? { used_substance: usedSubstance } : {}),
      notes: notes.trim() || null,
    }

    const checkinResult = await upsertCheckin(checkinData)
    if (checkinResult?.error) {
      setFeedback(checkinResult.error)
      setLoading(false)
      return
    }

    if (type === "night" && (gratitude1 || gratitude2 || gratitude3)) {
      await upsertGratitude({
        gratitude_date: date,
        text_1: gratitude1 || "-",
        text_2: gratitude2 || "-",
        text_3: gratitude3 || "-",
      })
    }

    const aiResult = await generateRecommendation(
      checkinResult.id ?? "",
      type,
      checkinData,
      recentData
    )

    if (aiResult?.recommendation) {
      setRecommendation(aiResult.recommendation)
    }

    setLoading(false)
  }

  const totalMinutes = sessions.reduce((acc, s) => acc + s.duration_minutes, 0)

  return (
    <div className="space-y-4">
      <Card>
        <p className="text-sm font-medium mb-4">Como estas ahora?</p>
        <div className="space-y-4">
          <ScaleInput label="Ansiedad" value={anxiety} onChange={v => setAnxiety(v as Scale)} />
          <ScaleInput label="Animo" value={mood} onChange={v => setMood(v as Scale)} />
          <ScaleInput label="Energia" value={energy} onChange={v => setEnergy(v as Scale)} />
        </div>
      </Card>

      <Card>
        <p className="text-sm font-medium mb-3">Sesiones de meditacion</p>
        {sessions.length > 0 && (
          <div className="space-y-2 mb-3">
            {sessions.map(s => (
              <div key={s.id} className="flex items-center justify-between text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">
                  {s.start_time ? `${s.start_time} — ` : ""}{s.duration_minutes} min
                </span>
                <button onClick={() => handleDeleteSession(s.id)}
                  className="text-xs text-red-400 hover:text-red-600">Eliminar</button>
              </div>
            ))}
            <p className="text-xs text-neutral-400">Total: {totalMinutes} min</p>
          </div>
        )}
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="text-xs text-neutral-500">Hora (opcional)</label>
            <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)}
              className="mt-1 w-full border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-transparent"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-neutral-500">Minutos</label>
            <input type="number" min={1} max={480} value={newDuration}
              onChange={e => setNewDuration(Number(e.target.value))}
              className="mt-1 w-full border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-transparent"
            />
          </div>
          <button onClick={handleAddSession}
            className="px-4 py-2 rounded-lg text-sm border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            Agregar
          </button>
        </div>
      </Card>

      {type === "night" && (
        <>
          <Card>
            <p className="text-sm font-medium mb-3">Hubo consumo hoy?</p>
            <div className="flex gap-2">
              <button onClick={() => setUsedSubstance(false)}
                className={`flex-1 py-3 rounded-lg text-sm font-medium border transition-colors ${!usedSubstance ? "bg-neutral-900 text-white border-neutral-900 dark:bg-neutral-100 dark:text-neutral-900" : "border-neutral-200 text-neutral-500 dark:border-neutral-700"}`}>
                No
              </button>
              <button onClick={() => setUsedSubstance(true)}
                className={`flex-1 py-3 rounded-lg text-sm font-medium border transition-colors ${usedSubstance ? "bg-red-600 text-white border-red-600" : "border-neutral-200 text-neutral-500 dark:border-neutral-700"}`}>
                Si
              </button>
            </div>
          </Card>

          <Card>
            <p className="text-sm font-medium mb-3">3 agradecimientos del dia</p>
            <div className="space-y-2">
              {[
                { val: gratitude1, set: setGratitude1, label: "Primero" },
                { val: gratitude2, set: setGratitude2, label: "Segundo" },
                { val: gratitude3, set: setGratitude3, label: "Tercero" },
              ].map(({ val, set, label }) => (
                <input key={label} type="text" value={val} onChange={e => set(e.target.value)}
                  placeholder={label}
                  className="w-full border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-transparent"
                />
              ))}
            </div>
          </Card>
        </>
      )}

      <Card>
        <label className="text-sm font-medium">Notas <span className="text-neutral-400">(opcional)</span></label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
          className="mt-2 w-full border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-transparent resize-none"
        />
      </Card>

      {feedback && <p className="text-sm text-red-500">{feedback}</p>}

      {recommendation && (
        <Card>
          <p className="text-xs text-neutral-400 mb-2">Recomendacion</p>
          <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">{recommendation}</p>
        </Card>
      )}

      <Button type="button" onClick={handleSubmit} disabled={loading} fullWidth>
        {loading ? "Guardando..." : recommendation ? "Actualizar" : "Guardar y obtener recomendacion"}
      </Button>
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
