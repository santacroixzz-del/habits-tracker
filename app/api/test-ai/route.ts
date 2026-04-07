import { NextResponse } from "next/server"

export async function GET() {
  const key = process.env.ANTHROPIC_API_KEY
  
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 100,
      messages: [{ role: "user", content: "Di hola" }],
    }),
  })

  const data = await response.json()
  return NextResponse.json({ status: response.status, data })
}
