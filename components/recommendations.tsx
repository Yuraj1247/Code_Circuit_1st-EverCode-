"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { getModulesBySubjectId, getSubjectById } from "@/lib/data"
import { getCompletedModules } from "@/lib/storage"

interface RecommendationsProps {
  subjectId: string
  currentModuleId?: string
}

export function Recommendations({ subjectId, currentModuleId }: RecommendationsProps) {
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    generateRecommendations()
  }, [subjectId, currentModuleId])

  const generateRecommendations = () => {
    const allModules = getModulesBySubjectId(subjectId)
    const completedModules = mounted ? getCompletedModules() : []
    const subject = getSubjectById(subjectId)

    // Filter out completed modules and current module
    const incompleteModules = allModules.filter(
      (module) => !completedModules.includes(module.id) && module.id !== currentModuleId,
    )

    // Get modules from other subjects that might be interesting
    const otherSubjectModules = []
    if (subject) {
      // This would be more sophisticated in a real app
      // For now, just get a random module from each other subject
      const relatedSubjects = {
        math: ["science", "tech"],
        science: ["math", "tech"],
        history: ["language", "art"],
        language: ["history", "art"],
        art: ["language", "history"],
        tech: ["math", "science"],
      }

      const relatedSubjectIds = relatedSubjects[subjectId as keyof typeof relatedSubjects] || []

      for (const relatedSubjectId of relatedSubjectIds) {
        const modules = getModulesBySubjectId(relatedSubjectId)
        if (modules.length > 0) {
          // Get a module that hasn't been completed
          const availableModules = modules.filter((module) => !completedModules.includes(module.id))

          if (availableModules.length > 0) {
            otherSubjectModules.push(availableModules[0])
          }
        }
      }
    }

    // Combine and limit to 3 recommendations
    const allRecommendations = [...incompleteModules.slice(0, 2), ...otherSubjectModules.slice(0, 1)].slice(0, 3)

    setRecommendations(allRecommendations)
    setLoading(false)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500"></div>
        </CardContent>
      </Card>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended For You</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          {recommendations.map((module) => {
            const subject = getSubjectById(module.subjectId)

            return (
              <div
                key={module.id}
                className="flex items-center justify-between p-3 rounded-md hover:bg-gray-800/50 transition-colors"
              >
                <div>
                  <div className="flex items-center">
                    <div
                      className="w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: subject?.color || "#666" }}
                    ></div>
                    <span className="text-xs text-gray-400">{subject?.name}</span>
                  </div>
                  <p className="font-medium">{module.title}</p>
                </div>

                <Button variant="ghost" size="icon" asChild>
                  <a href={`/module/${module.id}`}>
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
