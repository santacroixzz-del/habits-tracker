export function Card({ children, className = "" }: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 ${className}`}>
      {children}
    </div>
  )
}
