import { getAllEntries } from "@/actions/entries"
import { EntryForm } from "@/components/app/EntryForm"
import { format } from "date-fns"

export default async function RegistroPage({
  searchParams,
}: {
  searchParams: Promise<{ fecha?: string }>
}) {
  const params = await searchParams
  const entries = await getAllEntries()
  const entryDate = params.fecha ?? format(new Date(), "yyyy-MM-dd")
  const existing = entries.find(e => e.entry_date === entryDate) ?? null
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-medium">{existing ? "Editar registro" : "Registrar dia"}</h1>
      <EntryForm existing={existing} entryDate={entryDate} />
    </div>
  )
}
