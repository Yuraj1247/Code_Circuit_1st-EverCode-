"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getQuizAttempt } from "@/lib/storage"
import { getModuleById, getSubjectById } from "@/lib/data"
import { motion } from "framer-motion"

export default function QuizAttemptReviewPage({
  params,
}: {
  params: { moduleId: string; attemptNumber: string }
}) {
  const router = useRouter()
  const [attempt, setAttempt] = useState<any>(null)
  const [module, setModule] = useState<any>(null)
  const [subject, setSubject] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const attemptData = getQuizAttempt(params.moduleId, Number.parseInt(params.attemptNumber))
    if (!attemptData) {
      router.push("/performance")
      return
    }

    setAttempt(attemptData)

    const moduleData = getModuleById(params.moduleId)
    if (moduleData) {
      setModule(moduleData)
      const subjectData = getSubjectById(moduleData.subjectId)
      setSubject(subjectData)
    }

    setLoading(false)
  }, [params.moduleId, params.attemptNumber, router])

  // Format time in milliseconds to a readable format
  const formatTime = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60)
    const minutes = Math.floor((ms / (1000 * 60)) % 60)
    const hours = Math.floor(ms / (1000 * 60 * 60))

    if (hours > 0) {
      return `${hours} hr ${minutes} min`
    } else if (minutes > 0) {
      return `${minutes} min ${seconds} sec`
    } else {
      return `${seconds} sec`
    }
  }

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!attempt || !module || !subject) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Attempt not found</h1>
          <Button onClick={() => router.push("/performance")}>Back to Performance</Button>
        </div>
      </div>
    )
  }

  const score = attempt.score
  const totalQuestions = attempt.totalQuestions || attempt.questions.length
  const scorePercentage = Math.round((score / totalQuestions) * 100)

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black z-0"></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <Button
          variant="ghost"
          className="mb-8 text-gray-300 hover:text-white"
          onClick={() => router.push("/performance")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Performance
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
            Quiz Attempt Review
          </h1>
          <p className="text-xl text-gray-300">{attempt.versionId}</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardHeader>
              <CardTitle>Attempt Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-400 mb-1">Module</p>
                  <p className="font-medium">{module.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{subject.name}</p>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-400 mb-1">Date & Time</p>
                  <p className="font-medium">{formatDate(attempt.startTime)}</p>
                  <p className="text-xs text-gray-500 mt-1">Duration: {formatTime(attempt.totalTime)}</p>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-400 mb-1">Score</p>
                  <p className="font-medium text-xl" style={{ color: scorePercentage >= 70 ? "#10b981" : "#ec4899" }}>
                    {score}/{totalQuestions} ({scorePercentage}%)
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Attempt #{attempt.attemptNumber} of {module.title}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Question Review</h2>

            {attempt.questions.map((question: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  className={`bg-gray-900 border-gray-800 overflow-hidden ${
                    question.isCorrect ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`mt-1 p-2 rounded-full ${question.isCorrect ? "bg-green-900/20" : "bg-red-900/20"}`}
                      >
                        {question.isCorrect ? (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-500" />
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-medium mb-4">
                          Question {index + 1}: {question.question}
                        </h3>

                        <div className="space-y-2 mb-6">
                          {question.options.map((option: string, optionIndex: number) => (
                            <div
                              key={optionIndex}
                              className={`p-3 rounded-md ${
                                optionIndex === question.correctAnswer
                                  ? "bg-green-900/20 border border-green-500/30"
                                  : optionIndex === question.selectedAnswer && !question.isCorrect
                                    ? "bg-red-900/20 border border-red-500/30"
                                    : "bg-gray-800"
                              }`}
                            >
                              <div className="flex items-center">
                                <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                                  <span className="text-xs">{String.fromCharCode(65 + optionIndex)}</span>
                                </div>
                                <span>{option}</span>
                                {optionIndex === question.selectedAnswer && (
                                  <span className="ml-2 text-sm text-gray-400">(Your answer)</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {question.explanation && (
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-medium text-blue-400 mb-1">Explanation:</h4>
                            <p className="text-gray-300">{question.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 flex justify-center space-x-4">
            <Button variant="outline" onClick={() => router.push("/performance")} className="px-6">
              Back to Performance
            </Button>
            <Button
              onClick={() => router.push(`/module/${params.moduleId}`)}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 px-6"
            >
              Retake Quiz
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
