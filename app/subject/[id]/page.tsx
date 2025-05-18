"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModuleCard } from "@/components/module-card"
import { getSubjectById, getModulesBySubjectId } from "@/lib/data"
import { getCompletedModules } from "@/lib/storage"
import { Recommendations } from "@/components/recommendations"
import { SkillTree } from "@/components/skill-tree"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export default function SubjectPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [subject, setSubject] = useState<any>(null)
  const [modules, setModules] = useState<any[]>([])
  const [completedModules, setCompletedModules] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const subjectData = getSubjectById(params.id)
    if (!subjectData) {
      router.push("/")
      return
    }

    setSubject(subjectData)
    setModules(getModulesBySubjectId(params.id))
    setCompletedModules(getCompletedModules())
    setLoading(false)
  }, [params.id, router])

  // Calculate progress percentage
  const progressPercentage =
    modules.length > 0
      ? Math.round((completedModules.filter((id) => id.startsWith(params.id)).length / modules.length) * 100)
      : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!subject) return null

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black z-0"></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <Button variant="ghost" className="mb-8 text-gray-300 hover:text-white" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Galaxy
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
            {subject.name} Planet
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-6">{subject.description}</p>

          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{progressPercentage}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        <Tabs defaultValue="modules">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-8">
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="skills">Skill Tree</TabsTrigger>
          </TabsList>

          <TabsContent value="modules">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {modules.map((module, index) => {
                // A module is locked if the previous module is not completed
                // First module is always unlocked
                const isLocked = index > 0 && !completedModules.includes(modules[index - 1].id)

                return (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    isCompleted={completedModules.includes(module.id)}
                    isLocked={isLocked}
                    onClick={() => {
                      if (!isLocked) {
                        router.push(`/module/${module.id}`)
                      }
                    }}
                  />
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="skills">{mounted && <SkillTree subjectId={params.id} />}</TabsContent>
        </Tabs>

        <div className="mt-12">
          <Recommendations subjectId={params.id} />
        </div>
      </div>
    </main>
  )
}
