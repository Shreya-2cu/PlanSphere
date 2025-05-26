import { NextResponse } from "next/server"

// In-memory storage for task templates
const templates = [
  {
    id: "morning-routine",
    title: "Morning Routine",
    type: "Daily template",
    tasks: [
      { title: "Wake up at 6:30 AM", category: "personal", priority: "high", description: "Start the day early" },
      { title: "Drink water", category: "health", priority: "medium", description: "Stay hydrated" },
      { title: "15-minute meditation", category: "health", priority: "medium", description: "Clear your mind" },
      { title: "30-minute exercise", category: "health", priority: "high", description: "Stay fit and healthy" },
      { title: "Shower", category: "personal", priority: "medium", description: "Get refreshed" },
      { title: "Breakfast", category: "health", priority: "high", description: "Most important meal of the day" },
      { title: "Review daily goals", category: "professional", priority: "high", description: "Plan your day" },
    ],
  },
  {
    id: "work-tasks",
    title: "Work Tasks",
    type: "Daily template",
    tasks: [
      {
        title: "Check emails",
        category: "professional",
        priority: "high",
        description: "Respond to important messages",
      },
      { title: "Team meeting", category: "professional", priority: "medium", description: "Daily standup" },
      { title: "Project work", category: "professional", priority: "high", description: "Focus on main project" },
      { title: "Lunch break", category: "health", priority: "medium", description: "Take time to eat properly" },
      {
        title: "Follow-up meetings",
        category: "professional",
        priority: "medium",
        description: "Check progress with team",
      },
      {
        title: "Administrative tasks",
        category: "professional",
        priority: "low",
        description: "Handle paperwork and emails",
      },
      { title: "Plan next day", category: "professional", priority: "medium", description: "Prepare for tomorrow" },
    ],
  },
  {
    id: "evening-routine",
    title: "Evening Routine",
    type: "Daily template",
    tasks: [
      { title: "Dinner", category: "health", priority: "medium", description: "Eat a balanced meal" },
      { title: "Family time", category: "personal", priority: "high", description: "Connect with loved ones" },
      {
        title: "Review accomplishments",
        category: "professional",
        priority: "medium",
        description: "Reflect on the day",
      },
      {
        title: "Prepare for tomorrow",
        category: "personal",
        priority: "medium",
        description: "Set out clothes, pack lunch",
      },
      { title: "Reading time", category: "personal", priority: "low", description: "Read for 30 minutes" },
      { title: "Bedtime routine", category: "health", priority: "high", description: "Wind down for good sleep" },
    ],
  },
  {
    id: "weekly-goals",
    title: "Weekly Goals",
    type: "Weekly template",
    tasks: [
      { title: "Set 3 main goals", category: "professional", priority: "high", description: "Focus on key objectives" },
      {
        title: "Plan daily tasks",
        category: "professional",
        priority: "high",
        description: "Break down goals into tasks",
      },
      {
        title: "Schedule meetings",
        category: "professional",
        priority: "medium",
        description: "Organize your calendar",
      },
      { title: "Personal development", category: "personal", priority: "medium", description: "Learn something new" },
      { title: "Exercise plan", category: "health", priority: "high", description: "Schedule workouts for the week" },
      {
        title: "Social commitment",
        category: "personal",
        priority: "medium",
        description: "Make time for friends/family",
      },
    ],
  },
  {
    id: "exercise-plan",
    title: "Exercise Plan",
    type: "Weekly template",
    tasks: [
      { title: "Cardio session", category: "health", priority: "high", description: "30 minutes of cardio" },
      { title: "Upper body workout", category: "health", priority: "medium", description: "Focus on arms and chest" },
      { title: "Lower body workout", category: "health", priority: "medium", description: "Focus on legs and core" },
      { title: "Flexibility/yoga", category: "health", priority: "medium", description: "Improve flexibility" },
      { title: "Rest day", category: "health", priority: "high", description: "Allow muscles to recover" },
      {
        title: "Track progress",
        category: "health",
        priority: "low",
        description: "Record measurements and achievements",
      },
    ],
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (id) {
    const template = templates.find((t) => t.id === id)
    if (!template) {
      return NextResponse.json({ success: false, message: "Template not found" }, { status: 404 })
    }
    return NextResponse.json(template)
  }

  // Return all templates (without tasks for list view)
  const templatesList = templates.map(({ id, title, type }) => ({
    id,
    title,
    type,
  }))

  return NextResponse.json(templatesList)
}
