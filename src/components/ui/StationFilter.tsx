import { Filter } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StationFilterProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function StationFilter({ value, onChange, className }: StationFilterProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`w-full sm:w-48 ${className}`}>
        <Filter className="w-4 h-4 mr-2" />
        <SelectValue placeholder="Filter stations" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Stations</SelectItem>
        <SelectItem value="available">Available Now</SelectItem>
        <SelectItem value="fast">Fast Charging</SelectItem>
      </SelectContent>
    </Select>
  )
}
