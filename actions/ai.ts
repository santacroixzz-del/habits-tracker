"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { CheckinType } from "@/lib/types"

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

export async function generateRecommendation(
  checkinId: string,
  checkinType: CheckinType,
  currentCheckin: {
    anxiety_level: number
    mood_level: number
    energy_level: number
    used_substance?: boolean
    notes?: string | null
  },
  recentData: {
    checkins: any[]
    sessions: any[]
  }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "No autenticado." }

  const prompt = buildPrompt(checkinType, currentCheckin, recentData)

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }],
      }),
    })

    const data = await response.json()
    const recommendation = data.content?.[0]?.text ?? "No se pudo generar una recomendacion."

    await supabase.from("ai_recommendations").insert({
      user_id: user.id,
      checkin_id: checkinId,
      checkin_type: checkinType,
      recommendation,
    })

    return { recommendation }
  } catch (error) {
    console.error("AI ERROR:", error)
    console.error("AI ERROR:", error)
    return { error: "Error al generar recomendacion." }
  }
}

function buildPrompt(
  type: CheckinType,
  current: {
    anxiety_level: number
    mood_level: number
    energy_level: number
    used_substance?: boolean
    notes?: string | null
  },
  recent: { checkins: any[]; sessions: any[] }
): string {
  const recentSummary = recent.checkins.slice(0, 14).map(c =>
    `${c.checkin_date} (${c.checkin_type}): ansiedad ${c.anxiety_level}/5, animo ${c.mood_level}/5, energia ${c.energy_level}/5${c.used_substance ? ", hubo consumo" : ""}`
  ).join("\n")

  const sessionsSummary = recent.sessions.slice(0, 10).map(s =>
    `${s.session_date}: ${s.duration_minutes} min`
  ).join("\n")

  if (type === "midday") {
    return `Sos un asistente de autocontrol y bienestar. El usuario esta haciendo seguimiento de su estado emocional y habitos.

Estado actual (mediodia):
- Ansiedad: ${current.anxiety_level}/5
- Animo: ${current.mood_level}/5
- Energia: ${current.energy_level}/5
${current.notes ? `- Notas: ${current.notes}` : ""}

Historial reciente (ultimos 14 registros):
${recentSummary || "Sin historial previo"}

Sesiones de meditacion recientes:
${sessionsSummary || "Sin sesiones registradas"}

Genera una recomendacion concreta, breve y directa para el resto del dia. Sin frases motivacionales vacias. Maximo 3 oraciones. Enfocate en que puede hacer concretamente para manejar su estado actual basandote en sus patrones.`
  } else {
    return `Sos un asistente de autocontrol y bienestar. El usuario esta cerrando el dia.

Estado final del dia:
- Ansiedad: ${current.anxiety_level}/5
- Animo: ${current.mood_level}/5
- Energia: ${current.energy_level}/5
${current.used_substance ? "- Hubo consumo hoy" : "- Sin consumo hoy"}
${current.notes ? `- Notas: ${current.notes}` : ""}

Historial reciente (ultimos 14 registros):
${recentSummary || "Sin historial previo"}

Genera un resumen breve del dia y una observacion sobre patrones que notes. Sin frases motivacionales vacias. Maximo 4 oraciones. Se directo y concreto.`
  }
}



