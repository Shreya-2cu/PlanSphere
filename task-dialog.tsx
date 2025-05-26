"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AddTaskForm } from "@/components/add-task-form"
import { Plus } from "lucide-react"

interface TaskDialogProps {
  onTaskAdded: () => void
}

export function TaskDialog({ onTaskAdded }: TaskDialogProps) {
  const [open, setOpen] = useState(false)

  const handleTaskAdded = () => {
    setOpen(false)
    onTaskAdded()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1">
          <Plus className="h-4 w-4" /> Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <AddTaskForm onTaskAdded={handleTaskAdded} onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
