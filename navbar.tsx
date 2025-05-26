import Link from "next/link"
import { Globe } from "lucide-react"
import { UserButton } from "./user-button"

export function Navbar() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center px-4">
        <div className="flex items-center gap-2">
          <Globe className="h-8 w-8 text-primary" />
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary">Plansphere</span>
          </Link>
          <p className="text-sm text-muted-foreground">Orbit your plans with precision</p>
        </div>
        <nav className="ml-auto flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
            Dashboard
          </Link>
          <Link href="/tasks" className="text-sm font-medium transition-colors hover:text-primary">
            Tasks
          </Link>
          <Link href="/pomodoro" className="text-sm font-medium transition-colors hover:text-primary">
            Pomodoro
          </Link>
          <Link href="/quizzes" className="text-sm font-medium transition-colors hover:text-primary">
            Quizzes
          </Link>
          <Link href="/calculators" className="text-sm font-medium transition-colors hover:text-primary">
            Calculators
          </Link>
          <UserButton />
        </nav>
      </div>
    </header>
  )
}
