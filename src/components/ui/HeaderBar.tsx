import { Battery, ArrowLeft, LogOut } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { User } from "@/types/station"

interface HeaderBarProps {
  user: User | null
  onLogout: () => void
  showBackButton?: boolean
  backHref?: string
  backLabel?: string
  title?: string
  actions?: React.ReactNode
}

export function HeaderBar({ 
  user, 
  onLogout, 
  showBackButton = false,
  backHref = "/",
  backLabel = "Back",
  title = "EV Green",
  actions
}: HeaderBarProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Button asChild variant="ghost" size="sm">
                <Link href={backHref} className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  {backLabel}
                </Link>
              </Button>
            )}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Battery className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">{title}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
            )}
            {actions}
            {user && (
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
