import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

export function UserButton() {
  return (
    <Button variant="ghost" size="icon" className="rounded-full">
      <User className="h-5 w-5" />
      <span className="sr-only">User account</span>
    </Button>
  )
}
