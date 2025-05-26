"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TaskCard } from "@/components/task-card"
import { TaskViewToggle } from "@/components/task-view-toggle"
import { TaskDialog } from "@/components/task-dialog"
import { toast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Task {
  id: string
  title: string
  description: string
  priority: string
  category: string
}

interface TasksState {
  todo: Task[]
  inProgress: Task[]
  completed: Task[]
}

interface Template {
  id: string
  title: string
  type: string
}

export default function Tasks() {
  const [tasks, setTasks] = useState<TasksState>({
    todo: [],
    inProgress: [],
    completed: [],
  })
  const [filteredTasks, setFilteredTasks] = useState<TasksState>({
    todo: [],
    inProgress: [],
    completed: [],
  })
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks")
      if (!response.ok) {
        throw new Error("Failed to fetch tasks")
      }
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error("Error fetching tasks:", error)
      toast({
        title: "Error",
        description: "Failed to load tasks. Please refresh the page.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/templates")
      if (!response.ok) {
        throw new Error("Failed to fetch templates")
      }
      const data = await response.json()
      setTemplates(data)
    } catch (error) {
      console.error("Error fetching templates:", error)
    }
  }

  useEffect(() => {
    fetchTasks()
    fetchTemplates()
  }, [])

  // Apply filters whenever tasks or filter settings change
  useEffect(() => {
    const applyFilters = () => {
      const filtered: TasksState = {
        todo: [],
        inProgress: [],
        completed: [],
      }

      // Helper function to filter a task list
      const filterTaskList = (taskList: Task[]) => {
        return taskList.filter((task) => {
          // Apply category filter
          if (categoryFilter !== "all" && task.category !== categoryFilter) {
            return false
          }

          // Apply priority filter
          if (priorityFilter !== "all" && task.priority !== priorityFilter) {
            return false
          }

          // Apply search filter
          if (
            searchQuery &&
            !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !task.description.toLowerCase().includes(searchQuery.toLowerCase())
          ) {
            return false
          }

          return true
        })
      }

      // Apply filters to each task list
      filtered.todo = filterTaskList(tasks.todo)
      filtered.inProgress = filterTaskList(tasks.inProgress)
      filtered.completed = filterTaskList(tasks.completed)

      setFilteredTasks(filtered)
    }

    applyFilters()
  }, [tasks, categoryFilter, priorityFilter, searchQuery])

  const handleTaskAdded = () => {
    fetchTasks()
  }

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value)
  }

  const handlePriorityFilterChange = (value: string) => {
    setPriorityFilter(value)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const clearFilters = () => {
    setCategoryFilter("all")
    setPriorityFilter("all")
    setSearchQuery("")
  }

  const applyTemplate = async (templateId: string) => {
    try {
      setIsLoading(true)
      // First, fetch the template details with tasks
      const templateResponse = await fetch(`/api/templates?id=${templateId}`)
      if (!templateResponse.ok) {
        throw new Error("Failed to fetch template details")
      }

      const templateData = await templateResponse.json()
      const templateTitle = templateData.title || "Template"

      // Add each task from the template
      for (const task of templateData.tasks || []) {
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...task,
            status: "todo",
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to add task from template")
        }
      }

      toast({
        title: "Success",
        description: `Template "${templateTitle}" applied successfully`,
      })

      fetchTasks()
    } catch (error) {
      console.error("Error applying template:", error)
      toast({
        title: "Error",
        description: "Failed to apply template. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 p-4 md:p-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold">Task Management</h1>
            <div className="flex items-center mt-4 md:mt-0">
              <TaskViewToggle />
            </div>
          </div>

          <div className="flex flex-col md:flex-row flex-wrap gap-4 mb-6">
            <div className="w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Select value={categoryFilter} onValueChange={handleCategoryFilterChange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={handlePriorityFilterChange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              {(categoryFilter !== "all" || priorityFilter !== "all" || searchQuery) && (
                <Button variant="ghost" onClick={clearFilters} size="sm">
                  Clear Filters
                </Button>
              )}
            </div>

            <div className="ml-auto">
              <TaskDialog onTaskAdded={handleTaskAdded} />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p>Loading tasks...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold">To Do</h2>
                {filteredTasks.todo.map((task) => (
                  <TaskCard key={task.id} task={task} status="todo" onTaskUpdated={fetchTasks} />
                ))}
                {filteredTasks.todo.length === 0 && (
                  <Card>
                    <CardContent className="p-4 text-center text-gray-500">
                      {tasks.todo.length === 0 ? "No tasks to do" : "No tasks match your filters"}
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold">In Progress</h2>
                {filteredTasks.inProgress.map((task) => (
                  <TaskCard key={task.id} task={task} status="inProgress" onTaskUpdated={fetchTasks} />
                ))}
                {filteredTasks.inProgress.length === 0 && (
                  <Card>
                    <CardContent className="p-4 text-center text-gray-500">
                      {tasks.inProgress.length === 0 ? "No tasks in progress" : "No tasks match your filters"}
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold">Completed</h2>
                {filteredTasks.completed.map((task) => (
                  <TaskCard key={task.id} task={task} status="completed" onTaskUpdated={fetchTasks} />
                ))}
                {filteredTasks.completed.length === 0 && (
                  <Card>
                    <CardContent className="p-4 text-center text-gray-500">
                      {tasks.completed.length === 0 ? "No completed tasks" : "No tasks match your filters"}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Templates</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {templates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h3 className="font-medium">{template.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 mb-3">{template.type}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => applyTemplate(template.id)}
                      disabled={isLoading}
                    >
                      {isLoading ? "Applying..." : "Use Template"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
