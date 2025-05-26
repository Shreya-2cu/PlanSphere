"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

interface Template {
  id: string
  title: string
  type: string
}

interface TemplateCardProps {
  template: Template
  onApply: () => void
}

export function TemplateCard({ template, onApply }: TemplateCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const applyTemplate = async () => {
    setIsLoading(true)

    try {
      // First, fetch the template details with tasks
      const templateResponse = await fetch(`/api/templates?id=${template.id}`)
      if (!templateResponse.ok) {
        throw new Error("Failed to fetch template details")
      }

      const templateData = await templateResponse.json()

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
        description: `Template "${template.title}" applied successfully`,
      })

      onApply()
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
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <h3 className="font-medium">{template.title}</h3>
        <p className="text-xs text-gray-500 mt-1 mb-3">{template.type}</p>
        <Button variant="outline" size="sm" className="w-full mt-2" onClick={applyTemplate} disabled={isLoading}>
          {isLoading ? "Applying..." : "Use Template"}
        </Button>
      </CardContent>
    </Card>
  )
}
