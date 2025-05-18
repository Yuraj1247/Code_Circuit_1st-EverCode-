"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Quiz } from "@/components/quiz"
import { getModuleById, getSubjectById } from "@/lib/data"
import { getCompletedModules, saveCompletedModule, saveQuizScore } from "@/lib/storage"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import { Recommendations } from "@/components/recommendations"
import { Card, CardContent } from "@/components/ui/card"

export default function ModulePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [module, setModule] = useState<any>(null)
  const [subject, setSubject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [isModuleCompleted, setIsModuleCompleted] = useState(false)

  useEffect(() => {
    const moduleData = getModuleById(params.id)
    if (!moduleData) {
      router.push("/")
      return
    }

    // Add explanations to questions if they don't exist
  if (moduleData.quiz) {
  moduleData.quiz = moduleData.quiz.map((q: any) => {
    if (!q.explanation) {
      q.explanation = `The correct answer is "${q.options[q.correctAnswer]}". ${
        q.explanationText || "This is the right choice because it accurately addresses the question."
      }`
    }
    return q;
  });
}


    setModule(moduleData)
    setSubject(getSubjectById(moduleData.subjectId))

    const completedModules = getCompletedModules()
    setIsModuleCompleted(completedModules.includes(params.id))

    setLoading(false)
  }, [params.id, router])

  const handleQuizComplete = (score: number) => {
    setQuizScore(score)
    setQuizCompleted(true)
    saveQuizScore(params.id, score)
  }

  const handleCompleteModule = () => {
    saveCompletedModule(params.id)
    setIsModuleCompleted(true)

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })

    // Redirect to subject page after a delay
    setTimeout(() => {
      router.push(`/subject/${module.subjectId}`)
    }, 3000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!module || !subject) return null

  // Extract grade level from tags if available
  const gradeLevel = module.tags?.find((tag: string) => tag.includes("Grade")) || ""

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black z-0"></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <Button
          variant="ghost"
          className="mb-8 text-gray-300 hover:text-white"
          onClick={() => router.push(`/subject/${module.subjectId}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {subject.name} Planet
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
            {module.title}
          </h1>

          {gradeLevel && (
            <div className="inline-block bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm mb-4">
              {gradeLevel} Level
            </div>
          )}

          <div className="flex justify-center space-x-4 mb-8">
            <button
              className={`w-3 h-3 rounded-full ${currentStep === 0 ? "bg-purple-500" : "bg-gray-600"}`}
              onClick={() => !quizCompleted && setCurrentStep(0)}
            />
            <button
              className={`w-3 h-3 rounded-full ${currentStep === 1 ? "bg-purple-500" : "bg-gray-600"}`}
              onClick={() => !quizCompleted && setCurrentStep(1)}
            />
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {!isModuleCompleted ? (
            <>
              {currentStep === 0 && !quizCompleted && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 mb-8"
                >
                  <Card className="bg-transparent border-0 shadow-none">
                    <CardContent className="p-0">
                      {module.content.map((section: any, index: number) => (
                        <div key={index} className="mb-6">
                          <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                          <div className="prose prose-invert max-w-none">
                            <p>{section.text}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <div className="mt-8 flex justify-end">
                    <Button
                      onClick={() => setCurrentStep(1)}
                      className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                    >
                      Take Quiz
                    </Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 1 && !quizCompleted && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Quiz questions={module.quiz} onComplete={handleQuizComplete} moduleId={params.id} />
                </motion.div>
              )}

              {quizCompleted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center bg-gray-900/50 border border-gray-800 rounded-lg p-8"
                >
                  <div className="mb-6">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Quiz Completed!</h2>
                    <p className="text-xl">
                      Your score:{" "}
                      <span className="font-bold text-purple-400">
                        {quizScore}/{module.quiz.length}
                      </span>
                    </p>
                  </div>

                  <Button
                    size="lg"
                    onClick={handleCompleteModule}
                    className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                  >
                    Complete Module
                  </Button>
                </motion.div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center bg-gray-900/50 border border-green-800 rounded-lg p-8"
            >
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Module Already Completed!</h2>
              <p className="mb-6">You've already mastered this module. Continue your cosmic journey!</p>

              <Button
                size="lg"
                onClick={() => router.push(`/subject/${module.subjectId}`)}
                className="bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700"
              >
                Return to Subject
              </Button>
            </motion.div>
          )}

          <div className="mt-12">
            <Recommendations subjectId={module?.subjectId || ""} currentModuleId={params.id} />
          </div>
        </div>
      </div>
    </main>
  )
}
