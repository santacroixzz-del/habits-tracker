type Status = "clean" | "used" | "unregistered" | "meditated" | "no-meditated"

const config: Record<Status, { label: string; className: string }> = {
  clean:           { label: "Limpio",        className: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300" },
  used:            { label: "Consumo",       className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
  unregistered:    { label: "Sin registrar", className: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" },
  meditated:       { label: "Medito",        className: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200" },
  "no-meditated":  { label: "No medito",     className: "bg-neutral-100 text-neutral-500" },
}

export function Badge({ status }: { status: Status }) {
  const { label, className } = config[status]
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${className}`}>
      {label}
    </span>
  )
}
