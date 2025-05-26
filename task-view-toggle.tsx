"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function TaskViewToggle() {
  const [activeView, setActiveView] = useState("daily")

  return (
    <div className="bg-white rounded-lg p-1 flex border">
      <Button
        variant={activeView === "daily" ? "default" : "ghost"}
        size="sm"
        onClick={() => setActiveView("daily")}
        className={activeView === "daily" ? "bg-primary" : ""}
      >
        Daily
      </Button>
      <Button
        variant={activeView === "weekly" ? "default" : "ghost"}
        size="sm"
        onClick={() => setActiveView("weekly")}
        className={activeView === "weekly" ? "bg-primary" : ""}
      >
        Weekly
      </Button>
      <Button
        variant={activeView === "monthly" ? "default" : "ghost"}
        size="sm"
        onClick={() => setActiveView("monthly")}
        className={activeView === "monthly" ? "bg-primary" : ""}
      >
        Monthly
      </Button>
    </div>
  )
}
