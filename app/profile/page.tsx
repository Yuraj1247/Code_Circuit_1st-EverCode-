"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Edit2, Save, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getCompletedModules, getQuizScores } from "@/lib/storage"
import { getAllModules } from "@/lib/data"
import { getMotivationalQuote } from "@/lib/api"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "@/components/ui/chart"

export default function ProfilePage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [newUsername, setNewUsername] = useState("")
  const [completedModules, setCompletedModules] = useState<string[]>([])
  const [quizScores, setQuizScores] = useState<Record<string, number>>({})
  const [quote, setQuote] = useState({ text: "", author: "" })
  const [loading, setLoading] = useState(true)
  const [refreshingQuote, setRefreshingQuote] = useState(false)

  useEffect(() => {
    const storedUsername = localStorage.getItem("userName") || "Explorer"
    setUsername(storedUsername)
    setNewUsername(storedUsername)

    setCompletedModules(getCompletedModules())
    setQuizScores(getQuizScores())

    fetchQuote()

    setLoading(false)
  }, [])

  const fetchQuote = async () => {
    setRefreshingQuote(true)
    const newQuote = await getMotivationalQuote()
    setQuote(newQuote)
    setRefreshingQuote(false)
  }

  const handleSaveUsername = () => {
    if (newUsername.trim()) {
      localStorage.setItem("userName", newUsername)
      setUsername(newUsername)
      setIsEditingUsername(false)
    }
  }

  const getModuleById = (id: string) => {
    return getAllModules().find((module) => module.id === id)
  }

  const getQuizScoreData = () => {
    return Object.entries(quizScores).map(([moduleId, score]) => {
      const module = getModuleById(moduleId)
      return {
        name: module?.title || moduleId,
        score,
      }
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black z-0"></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <Button variant="ghost" className="mb-8 text-gray-300 hover:text-white" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Galaxy
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="border-b border-gray-800">
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center mb-4">
                    <span className="text-4xl font-bold">{username.charAt(0).toUpperCase()}</span>
                  </div>

                  {isEditingUsername ? (
                    <div className="flex items-center mt-2 w-full">
                      <Input
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="mr-2 bg-gray-800 border-gray-700 text-white"
                      />
                      <Button size="icon" onClick={handleSaveUsername} variant="secondary">
                        <Save className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center mt-2">
                      <h2 className="text-2xl font-bold mr-2">{username}</h2>
                      <Button size="icon" variant="ghost" onClick={() => setIsEditingUsername(true)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  <div className="mt-6 w-full">
                    <div className="flex justify-between mb-2">
                      <span>Modules Completed:</span>
                      <span className="font-bold">{completedModules.length}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Quiz Average:</span>
                      <span className="font-bold">
                        {Object.keys(quizScores).length > 0
                          ? Math.round(
                              Object.values(quizScores).reduce((a, b) => a + b, 0) / Object.keys(quizScores).length,
                            )
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Daily Motivation</h3>
                    <Button size="icon" variant="ghost" onClick={fetchQuote} disabled={refreshingQuote}>
                      <RefreshCw className={`h-4 w-4 ${refreshingQuote ? "animate-spin" : ""}`} />
                    </Button>
                  </div>
                  <blockquote className="italic text-gray-300">"{quote.text}"</blockquote>
                  <p className="text-right text-sm text-gray-400 mt-2">— {quote.author}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-8">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="border-b border-gray-800">
                  <CardTitle>Quiz Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {getQuizScoreData().length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getQuizScoreData()}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis dataKey="name" stroke="#aaa" />
                          <YAxis domain={[0, 100]} stroke="#aaa" />
                          <Tooltip contentStyle={{ backgroundColor: "#222", borderColor: "#444" }} />
                          <Bar dataKey="score" fill="#9333ea" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400">
                        No quiz data available yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="border-b border-gray-800">
                  <CardTitle>Completed Modules</CardTitle>
                </CardHeader>
                <CardContent>
                  {completedModules.length > 0 ? (
                    <ul className="space-y-2">
                      {completedModules.map((moduleId) => {
                        const module = getModuleById(moduleId)
                        return (
                          <li key={moduleId} className="p-3 bg-gray-800/50 rounded-lg flex justify-between">
                            <span>{module?.title || moduleId}</span>
                            <span className="text-green-500">Completed</span>
                          </li>
                        )
                      })}
                    </ul>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      You haven't completed any modules yet.
                      <div className="mt-4">
                        <Button onClick={() => router.push("/")}>Start Learning</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
