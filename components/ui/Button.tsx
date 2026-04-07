type Props = {
  children: React.ReactNode
  variant?: "primary" | "ghost" | "danger"
  type?: "button" | "submit"
  onClick?: () => void
  disabled?: boolean
  fullWidth?: boolean
}

export function Button({
  children, variant = "primary", type = "button",
  onClick, disabled, fullWidth
}: Props) {
  const base = "px-4 py-3 rounded-lg text-sm font-medium transition-colors focus:outline-none"
  const variants = {
    primary: "bg-neutral-900 text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300",
    ghost:   "border border-neutral-300 text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800",
    danger:  "bg-red-600 text-white hover:bg-red-700",
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  )
}
