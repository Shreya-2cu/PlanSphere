"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, ArrowRight, CheckCircle, Trash, ArrowLeft, Edit } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { EditTaskForm } from "./edit-task-form"

interface Task {
  id: string
  title: string
  description: string
  priority: string
  category: string
  dueDate?: string
}

interface TaskCardProps {
  task: Task
  status: string
  onTaskUpdated: () => void
}

export function TaskCard({ task, status, onTaskUpdated }: TaskCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const priorityColors = {
    high: "text-red-500 bg-red-50",
    medium: "text-amber-500 bg-amber-50",
    low: "text-green-500 bg-green-50",
  }

  const categoryColors = {
    personal: "text-blue-500 bg-blue-50",
    professional: "text-purple-500 bg-purple-50",
    health: "text-green-500 bg-green-50",
  }

  const moveTask = async (newStatus: string) => {
    if (isLoading) return

    setIsLoading(true)

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...task,
          status,
          newStatus,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update task")
      }

      toast({
        title: "Success",
        description: `Task moved to ${
          newStatus === "inProgress" ? "In Progress" : newStatus === "completed" ? "Completed" : "To Do"
        }`,
      })

      onTaskUpdated()
    } catch (error) {
      console.error("Error updating task:", error)
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteTask = async () => {
    if (isLoading) return

    if (!confirm("Are you sure you want to delete this task?")) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/tasks/${task.id}?status=${status}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete task")
      }

      toast({
        title: "Success",
        description: "Task deleted successfully",
      })

      onTaskUpdated()
    } catch (error) {
      console.error("Error deleting task:", error)
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditComplete = () => {
    setEditDialogOpen(false)
    onTaskUpdated()
  }

  return (
    <>
      <Card
        className="border-l-4"
        style={{
          borderLeftColor: task.priority === "high" ? "#ef4444" : task.priority === "medium" ? "#f59e0b" : "#22c55e",
        }}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-medium">{task.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{task.description}</p>
              <div className="flex gap-2 mt-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority as keyof typeof priorityColors]}`}
                >
                  {task.priority}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${categoryColors[task.category as keyof typeof categoryColors]}`}
                >
                  {task.category}
                </span>
              </div>
              {task.dueDate && (
                <p className="text-xs text-gray-500 mt-2">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" disabled={isLoading}>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Task
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {status === "todo" && (
                  <DropdownMenuItem onClick={() => moveTask("inProgress")}>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Move to In Progress
                  </DropdownMenuItem>
                )}

                {status === "inProgress" && (
                  <>
                    <DropdownMenuItem onClick={() => moveTask("todo")}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Move to To Do
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => moveTask("completed")}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Completed
                    </DropdownMenuItem>
                  </>
                )}

                {status === "completed" && (
                  <>
                    <DropdownMenuItem onClick={() => moveTask("todo")}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Move to To Do
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => moveTask("inProgress")}>
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Move to In Progress
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={deleteTask} className="text-red-500">
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <EditTaskForm
            task={task}
            status={status}
            onComplete={handleEditComplete}
            onCancel={() => setEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
