import { cn } from "@/lib/utils"

interface StatusIndicatorProps {
  available: number
  total: number
  className?: string
}

export function StatusIndicator({ available, total, className }: StatusIndicatorProps) {
  const getStatusColor = (available: number, total: number) => {
    const ratio = available / total
    if (ratio > 0.5) return "bg-green-500"
    if (ratio > 0) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getStatusText = (available: number, total: number) => {
    if (available === 0) return "Fully Occupied"
    if (available === total) return "Available"
    return `${available}/${total} Available`
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("w-3 h-3 rounded-full", getStatusColor(available, total))} />
      <span className="font-semibold text-sm">
        {getStatusText(available, total)}
      </span>
    </div>
  )
}
