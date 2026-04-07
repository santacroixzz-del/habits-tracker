export type RecommendationContext = {
  anxiety_level: number
  mood_level: number
  energy_level: number
  used_substance?: boolean
  checkin_type: "midday" | "night"
  date: string
}

const VERSICULOS = [
  "Filipenses 4:13 — Todo lo puedo en Cristo que me fortalece.",
  "Jeremias 29:11 — Porque yo se los planes que tengo para ustedes, planes de bienestar y no de mal.",
  "Isaias 41:10 — No temas, porque yo estoy contigo. No te desalientes, porque yo soy tu Dios.",
  "Salmos 23:4 — Aunque pase por el valle de sombra de muerte, no temere mal alguno, porque tu estas conmigo.",
  "Romanos 8:28 — Sabemos que Dios dispone todas las cosas para el bien de los que lo aman.",
  "Mateo 11:28 — Vengan a mi todos los que estan cansados y cargados, y yo los hare descansar.",
  "Salmos 46:1 — Dios es nuestro refugio y fortaleza, nuestra ayuda en momentos de angustia.",
  "2 Corintios 12:9 — Te basta mi gracia, porque mi poder se perfecciona en la debilidad.",
  "Proverbios 3:5 — Confia en el Senor con todo tu corazon y no te apoyes en tu propio entendimiento.",
  "Salmos 121:2 — Mi socorro viene del Senor, que hizo el cielo y la tierra.",
  "Juan 16:33 — En el mundo tendran afliccion, pero confien, yo he vencido al mundo.",
  "Isaias 40:31 — Los que esperan en el Senor renovaran sus fuerzas, volaran como las aguilas.",
  "Salmos 34:18 — El Senor esta cerca de los quebrantados de corazon.",
  "1 Corintios 10:13 — Dios es fiel y no permitira que sean tentados mas de lo que pueden soportar.",
]

const FRASES_VIERNES_SABADO = [
  "Hoy es viernes. Saber que estos dias son de riesgo ya es la mitad de la batalla. Tenes herramientas, usalas.",
  "Los fines de semana son el momento de demostrar que el cambio es real. Cada hora que pasa limpio es una victoria.",
  "Hoy el impulso va a ser mas fuerte. Eso no significa que tengas que seguirlo. Podes elegir diferente.",
  "Viermes de resistencia. Cada decision pequena de hoy construye quien sos manana.",
  "El sabado puede ser dificil. Llama a alguien, sali a caminar, hace algo con las manos. No te quedes solo con el pensamiento.",
  "Hoy especialmente: una hora a la vez. No pienses en toda la noche, piensa en la proxima hora.",
]

const FRASES_ANSIEDAD_ALTA = [
  "La ansiedad alta de hoy es informacion, no una orden. Podes sentirla sin obedecerla.",
  "Cuando la ansiedad sube, el cuerpo quiere escapar. Respirar profundo 4 veces es la respuesta mas simple y mas efectiva.",
  "Ansiedad alta significa que algo necesita atencion. No necesariamente consumo. Que necesitas realmente ahora?",
  "Este nivel de ansiedad va a bajar. Siempre baja. Tu trabajo es no tomar decisiones impulsivas mientras dura.",
  "La ansiedad miente. Te dice que no podes manejarla. Ya la manejaste antes.",
]

const FRASES_BUEN_ESTADO = [
  "Buen estado hoy. Este es el Lucas que queres ser. Registralo, recordalo.",
  "Los dias buenos son los que construyen la racha. Seguir cuando es facil tambien cuenta.",
  "Hoy te sientes bien. Eso no es suerte, es el resultado de las decisiones que veniste tomando.",
  "Aprovecha esta energia para hacer algo que te importe. Los dias buenos son para avanzar.",
  "Estado solido hoy. El trabajo silencioso de cada dia da estos frutos.",
]

const FRASES_NOCHE_CIERRE = [
  "Llegaste al final del dia. Eso siempre cuenta.",
  "Cada dia que termina es un dia mas de informacion sobre quien podes ser.",
  "El cierre del dia es el momento de soltar lo que no salio bien y guardar lo que si.",
  "Manana es otro intento. Hoy ya esta hecho.",
]

function getDayOfWeek(dateStr: string): number {
  return new Date(dateStr).getDay()
}

function getVersiculo(dateStr: string): string {
  const index = new Date(dateStr).getDate() % VERSICULOS.length
  return VERSICULOS[index]
}

export function generateRecommendation(ctx: RecommendationContext): string {
  const day = getDayOfWeek(ctx.date)
  const isWeekend = day === 5 || day === 6
  const isHighAnxiety = ctx.anxiety_level >= 4
  const isGoodState = ctx.anxiety_level <= 2 && ctx.mood_level >= 4

  const parts: string[] = []
  const versiculo = getVersiculo(ctx.date)

  if (ctx.checkin_type === "midday") {
    if (isWeekend) {
      const frase = FRASES_VIERNES_SABADO[Math.floor(Math.random() * FRASES_VIERNES_SABADO.length)]
      parts.push(frase)
    } else if (isHighAnxiety) {
      const frase = FRASES_ANSIEDAD_ALTA[Math.floor(Math.random() * FRASES_ANSIEDAD_ALTA.length)]
      parts.push(frase)
    } else if (isGoodState) {
      const frase = FRASES_BUEN_ESTADO[Math.floor(Math.random() * FRASES_BUEN_ESTADO.length)]
      parts.push(frase)
    } else {
      parts.push("Seguir registrando es seguir eligiendo. Buen trabajo por estar aca.")
    }
  } else {
    if (isWeekend) {
      const frase = FRASES_VIERNES_SABADO[Math.floor(Math.random() * FRASES_VIERNES_SABADO.length)]
      parts.push(frase)
    } else if (isHighAnxiety) {
      const frase = FRASES_ANSIEDAD_ALTA[Math.floor(Math.random() * FRASES_ANSIEDAD_ALTA.length)]
      parts.push(frase)
    } else {
      const frase = FRASES_NOCHE_CIERRE[Math.floor(Math.random() * FRASES_NOCHE_CIERRE.length)]
      parts.push(frase)
    }
  }

  parts.push(versiculo)
  return parts.join("\n\n")
}
