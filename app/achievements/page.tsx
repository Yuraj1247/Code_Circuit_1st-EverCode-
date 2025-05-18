"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProgressChart } from "@/components/progress-chart"
import { BadgeDisplay } from "@/components/badge-display"
import {
  getCompletedModules,
  getQuizScores,
  getPerfectQuizzes,
  getSubjectStreaks,
  getUnlockedSkills,
} from "@/lib/storage"
import { subjects, getAllModules } from "@/lib/data"
import { getMockLeaderboard } from "@/lib/api"
import { getAllBadges, getBadgesBySubject, getEarnedBadges } from "@/lib/badges"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "@/components/ui/chart"

export default function AchievementsPage() {
  const router = useRouter()
  const [completedModules, setCompletedModules] = useState<string[]>([])
  const [quizScores, setQuizScores] = useState<Record<string, number>>({})
  const [perfectQuizzes, setPerfectQuizzes] = useState<string[]>([])
  const [subjectStreaks, setSubjectStreaks] = useState<Record<string, number>>({})
  const [unlockedSkills, setUnlockedSkills] = useState<string[]>([])
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(true)
  const [earnedBadges, setEarnedBadges] = useState<string[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>("all")

  useEffect(() => {
    setCompletedModules(getCompletedModules())
    setQuizScores(getQuizScores())
    setPerfectQuizzes(getPerfectQuizzes())
    setSubjectStreaks(getSubjectStreaks())
    setUnlockedSkills(getUnlockedSkills())
    setLeaderboard(getMockLeaderboard())

    const storedUsername = localStorage.getItem("userName") || "Explorer"
    setUsername(storedUsername)

    setLoading(false)
  }, [])

  useEffect(() => {
    // Calculate earned badges
    if (!loading) {
      const badges = getEarnedBadges(completedModules, perfectQuizzes, subjectStreaks, unlockedSkills)
      setEarnedBadges(badges)
    }
  }, [completedModules, perfectQuizzes, subjectStreaks, unlockedSkills, loading])

  const calculateSubjectProgress = (subjectId: string) => {
    const subjectModules = getAllModules().filter((module) => module.subjectId === subjectId)
    const completedSubjectModules = subjectModules.filter((module) => completedModules.includes(module.id))

    return {
      completed: completedSubjectModules.length,
      total: subjectModules.length,
      percentage:
        subjectModules.length > 0 ? Math.round((completedSubjectModules.length / subjectModules.length) * 100) : 0,
    }
  }

  const calculateTotalProgress = () => {
    const allModules = getAllModules()
    return {
      completed: completedModules.length,
      total: allModules.length,
      percentage: allModules.length > 0 ? Math.round((completedModules.length / allModules.length) * 100) : 0,
    }
  }

  // Generate data for charts
  const generateSubjectProgressData = () => {
    return subjects.map((subject) => ({
      name: subject.name,
      progress: calculateSubjectProgress(subject.id).percentage,
      color: subject.color,
    }))
  }

  const generateQuizScoreData = () => {
    const data: { name: string; score: number }[] = []

    Object.entries(quizScores).forEach(([moduleId, score]) => {
      const subjectId = moduleId.split("-")[0]
      const subject = subjects.find((s) => s.id === subjectId)
      if (subject) {
        data.push({
          name: subject.name,
          score,
        })
      }
    })

    return data
  }

  const generateBadgeDistributionData = () => {
    const distribution: Record<string, number> = {}

    earnedBadges.forEach((badgeId) => {
      const subjectId = badgeId.split("_")[0]
      distribution[subjectId] = (distribution[subjectId] || 0) + 1
    })

    return Object.entries(distribution).map(([subjectId, count]) => {
      const subject = subjects.find((s) => s.id === subjectId)
      return {
        name: subject?.name || subjectId,
        value: count,
        color: subject?.color || "#666",
      }
    })
  }

  const getFilteredBadges = () => {
    if (selectedSubject === "all") {
      return getAllBadges()
    }
    return getBadgesBySubject(selectedSubject)
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

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
            Your Cosmic Achievements
          </h1>
          <p className="text-xl text-gray-300">Track your progress across the LearnVerse galaxy</p>
        </div>

        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 bg-gray-900">
            <TabsTrigger value="progress" className="data-[state=active]:bg-gray-800">
              Progress
            </TabsTrigger>
            <TabsTrigger value="badges" className="data-[state=active]:bg-gray-800">
              Badges
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-gray-800">
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Overall Progress</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-medium mb-4">Total Completion</h3>
                    <ProgressChart
                      percentage={calculateTotalProgress().percentage}
                      label={`${calculateTotalProgress().completed}/${calculateTotalProgress().total} Modules`}
                      color="#9333ea"
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-medium mb-4">Average Quiz Score</h3>
                    <ProgressChart
                      percentage={
                        Object.keys(quizScores).length > 0
                          ? Math.round(
                              Object.values(quizScores).reduce((a, b) => a + b, 0) / Object.keys(quizScores).length,
                            )
                          : 0
                      }
                      label="Average Score"
                      color="#06b6d4"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Subject Progress</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="h-[400px]">
                    <h3 className="text-xl font-medium mb-4">Progress by Subject</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={generateSubjectProgressData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} stroke="#aaa" />
                        <YAxis domain={[0, 100]} stroke="#aaa" />
                        <Tooltip contentStyle={{ backgroundColor: "#222", borderColor: "#444" }} />
                        <Bar dataKey="progress" name="Completion %">
                          {generateSubjectProgressData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="h-[400px]">
                    <h3 className="text-xl font-medium mb-4">Quiz Performance</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={generateQuizScoreData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} stroke="#aaa" />
                        <YAxis domain={[0, 100]} stroke="#aaa" />
                        <Tooltip contentStyle={{ backgroundColor: "#222", borderColor: "#444" }} />
                        <Line type="monotone" dataKey="score" stroke="#9333ea" name="Quiz Score %" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Detailed Subject Progress</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {subjects.map((subject) => {
                    const progress = calculateSubjectProgress(subject.id)

                    return (
                      <div key={subject.id}>
                        <h3 className="text-lg font-medium mb-4">{subject.name}</h3>
                        <ProgressChart
                          percentage={progress.percentage}
                          label={`${progress.completed}/${progress.total} Modules`}
                          color={subject.color}
                        />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Your Cosmic Badges</h2>
                  <div className="flex items-center">
                    <span className="mr-2">Filter:</span>
                    <select
                      className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                    >
                      <option value="all">All Subjects</option>
                      {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-medium mb-4">Badge Distribution</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={generateBadgeDistributionData()}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                          nameKey="name"
                          label={(entry) => entry.name}
                        >
                          {generateBadgeDistributionData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "#222", borderColor: "#444" }} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {getFilteredBadges().map((badge) => (
                    <BadgeDisplay key={badge.id} badgeId={badge.id} isEarned={earnedBadges.includes(badge.id)} />
                  ))}
                </div>

                {earnedBadges.length === 0 && (
                  <div className="text-center p-4 text-gray-400">Complete modules to earn badges!</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Cosmic Leaderboard</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-900/20 border-yellow-500">
                    <CardContent className="p-4 text-center">
                      <div className="text-yellow-500 text-4xl font-bold mb-2">1</div>
                      <div className="font-bold text-xl mb-1">{leaderboard[0]?.name || "---"}</div>
                      <div className="text-gray-400">Score: {leaderboard[0]?.score || "---"}</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-gray-400/20 to-gray-600/20 border-gray-400">
                    <CardContent className="p-4 text-center">
                      <div className="text-gray-400 text-4xl font-bold mb-2">2</div>
                      <div className="font-bold text-xl mb-1">{leaderboard[1]?.name || "---"}</div>
                      <div className="text-gray-400">Score: {leaderboard[1]?.score || "---"}</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-amber-700/20 to-amber-900/20 border-amber-700">
                    <CardContent className="p-4 text-center">
                      <div className="text-amber-700 text-4xl font-bold mb-2">3</div>
                      <div className="font-bold text-xl mb-1">{leaderboard[2]?.name || "---"}</div>
                      <div className="text-gray-400">Score: {leaderboard[2]?.score || "---"}</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="px-4 py-3 text-left">Rank</th>
                        <th className="px-4 py-3 text-left">Explorer</th>
                        <th className="px-4 py-3 text-left">Modules Completed</th>
                        <th className="px-4 py-3 text-left">Badges</th>
                        <th className="px-4 py-3 text-left">Score</th>
                        <th className="px-4 py-3 text-left">Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((entry, index) => (
                        <tr
                          key={index}
                          className={`border-b border-gray-700 ${entry.name === username ? "bg-purple-900/30" : ""}`}
                        >
                          <td className="px-4 py-3">{index + 1}</td>
                          <td className="px-4 py-3 font-medium">
                            {entry.name}
                            {entry.name === username && (
                              <span className="ml-2 text-xs bg-purple-500 px-2 py-0.5 rounded-full">You</span>
                            )}
                          </td>
                          <td className="px-4 py-3">{entry.modulesCompleted}</td>
                          <td className="px-4 py-3">{entry.badges}</td>
                          <td className="px-4 py-3">{entry.score}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 rounded bg-gray-800">
                              Level {Math.floor(entry.score / 500) + 1}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-8 bg-gray-800/50 p-4 rounded-lg">
                  <h3 className="text-xl font-medium mb-4">How Scores Are Calculated</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Each completed module: <span className="font-bold text-purple-400">100 points</span>
                    </li>
                    <li>
                      Each earned badge: <span className="font-bold text-purple-400">50 points</span>
                    </li>
                    <li>
                      Perfect quiz score: <span className="font-bold text-purple-400">25 bonus points</span>
                    </li>
                    <li>
                      Daily streak bonus: <span className="font-bold text-purple-400">10 points per day</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
