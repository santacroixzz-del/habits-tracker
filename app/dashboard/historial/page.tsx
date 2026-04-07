import { getAllEntries } from "@/actions/entries"
import { HistorialList } from "@/components/app/HistorialList"

export default async function HistorialPage() {
  const entries = await getAllEntries()
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-medium">Historial</h1>
      {entries.length === 0 ? (
        <p className="text-sm text-neutral-400">Todavia no hay registros.</p>
      ) : (
        <HistorialList entries={entries} />
      )}
    </div>
  )
}
