"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Award,
  Clock,
  BookOpen,
  Star,
  TrendingUp,
  Users,
  Zap,
  Medal,
  Search,
  Calendar,
  X,
  RotateCcw,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  getCompletedModules,
  getQuizScores,
  getPerfectQuizzes,
  getCurrentStreakCount,
  getDailyStreak,
  getSubjectStreaks,
  getLastActivityDates,
  getUserBadges,
  saveUserBadge,
  getAllQuizAttempts,
} from "@/lib/storage"
import { subjects, getAllModules, getModulesBySubjectId, getModuleById } from "@/lib/data"
import { useLearnverseTheme } from "@/contexts/theme-context"
import { BadgeDisplay } from "@/components/badge-display"
import { getAllBadges, type Badge } from "@/lib/badges"
import { motion, AnimatePresence } from "framer-motion"
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
} from "@/components/ui/chart"

export default function PerformancePage() {
  const router = useRouter()
  const { theme } = useLearnverseTheme()
  const [completedModules, setCompletedModules] = useState<string[]>([])
  const [quizScores, setQuizScores] = useState<Record<string, number>>({})
  const [perfectQuizzes, setPerfectQuizzes] = useState<string[]>([])
  const [streakCount, setStreakCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState("")
  const [performanceData, setPerformanceData] = useState<any>({})
  const [subjectProgress, setSubjectProgress] = useState<Record<string, number>>({})
  const [weeklyActivity, setWeeklyActivity] = useState<any[]>([])
  const [skillDistribution, setSkillDistribution] = useState<any[]>([])
  const [timeSpent, setTimeSpent] = useState<any[]>([])
  const [learningRate, setLearningRate] = useState<any[]>([])
  const [dailyActivity, setDailyActivity] = useState<any[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [earnedBadges, setEarnedBadges] = useState<string[]>([])
  const [allBadges, setAllBadges] = useState<Badge[]>([])
  const [subjectBadges, setSubjectBadges] = useState<Record<string, Badge[]>>({})
  const [overallBadges, setOverallBadges] = useState<Badge[]>([])
  const [badgeFilter, setBadgeFilter] = useState("all")
  const [badgeSearch, setBadgeSearch] = useState("")
  const [badgeSort, setBadgeSort] = useState("default")
  const [showBadgeDetails, setShowBadgeDetails] = useState<string | null>(null)
  const [newlyEarnedBadge, setNewlyEarnedBadge] = useState<string | null>(null)
  const [weeklyBadgeChallenges, setWeeklyBadgeChallenges] = useState<Badge[]>([])
  const [quizAttempts, setQuizAttempts] = useState<any[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Get theme colors for charts
  const getThemeColor = () => {
    switch (theme) {
      case "solar":
        return "#9333ea" // purple
      case "kingdom":
        return "#6366f1" // indigo
      case "terminal":
        return "#10b981" // green
      default:
        return "#9333ea"
    }
  }

  const getSecondaryThemeColor = () => {
    switch (theme) {
      case "solar":
        return "#06b6d4" // cyan
      case "kingdom":
        return "#8b5cf6" // purple
      case "terminal":
        return "#059669" // emerald
      default:
        return "#06b6d4"
    }
  }

  useEffect(() => {
    // Get username from localStorage
    const storedUsername = localStorage.getItem("userName") || "Explorer"
    setUsername(storedUsername)

    // Get user data
    const completed = getCompletedModules()
    const scores = getQuizScores()
    const perfect = getPerfectQuizzes()
    const streak = getCurrentStreakCount()
    const dailyStreak = getDailyStreak()
    const subjectStreaks = getSubjectStreaks()
    const lastActivityDates = getLastActivityDates()
    const badges = getUserBadges()
    const attempts = getAllQuizAttempts()

    setCompletedModules(completed)
    setQuizScores(scores)
    setPerfectQuizzes(perfect)
    setStreakCount(streak)
    setEarnedBadges(badges)
    setQuizAttempts(attempts)

    // Get all badges
    const allBadgesData = getAllBadges()
    setAllBadges(allBadgesData)

    // Organize badges by subject and overall
    const subjectBadgesData: Record<string, Badge[]> = {}
    const overallBadgesData: Badge[] = []

    allBadgesData.forEach((badge) => {
      if (badge.requirement.subjectId) {
        if (!subjectBadgesData[badge.requirement.subjectId]) {
          subjectBadgesData[badge.requirement.subjectId] = []
        }
        subjectBadgesData[badge.requirement.subjectId].push(badge)
      } else {
        overallBadgesData.push(badge)
      }
    })

    setSubjectBadges(subjectBadgesData)
    setOverallBadges(overallBadgesData)

    // Calculate subject progress
    const progress: Record<string, number> = {}
    subjects.forEach((subject) => {
      const subjectModules = getModulesBySubjectId(subject.id)
      const completedSubjectModules = completed.filter((id) => id.startsWith(subject.id))
      progress[subject.id] =
        subjectModules.length > 0 ? Math.round((completedSubjectModules.length / subjectModules.length) * 100) : 0
    })
    setSubjectProgress(progress)

    // Generate performance data using real data
    generatePerformanceData(completed, scores, perfect, streak, dailyStreak, lastActivityDates)

    // Check for new badges that should be earned
    checkForNewBadges(completed, scores, perfect, streak, badges)

    // Generate weekly badge challenges
    generateWeeklyBadgeChallenges(badges, allBadgesData)

    // Create audio element for badge sounds
    audioRef.current = new Audio("/assets/sounds/badge-unlock.mp3")

    setLoading(false)
  }, [])

  // Play sound when a new badge is earned
  useEffect(() => {
    if (newlyEarnedBadge && audioRef.current) {
      audioRef.current.play().catch((e) => console.log("Audio play failed:", e))

      // Clear the newly earned badge after 5 seconds
      const timer = setTimeout(() => {
        setNewlyEarnedBadge(null)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [newlyEarnedBadge])

  const checkForNewBadges = (
    completed: string[],
    scores: Record<string, number>,
    perfect: string[],
    streak: number,
    currentBadges: string[],
  ) => {
    const allBadgesData = getAllBadges()
    let newBadgeEarned = false

    // Check for module completion badges
    subjects.forEach((subject) => {
      const completedInSubject = completed.filter((id) => id.startsWith(subject.id)).length

      allBadgesData
        .filter(
          (badge) =>
            badge.requirement.type === "modules_completed" &&
            badge.requirement.subjectId === subject.id &&
            Number(badge.requirement.value) <= completedInSubject &&
            !currentBadges.includes(badge.id),
        )
        .forEach((badge) => {
          saveUserBadge(badge.id)
          setNewlyEarnedBadge(badge.id)
          newBadgeEarned = true
        })
    })

    // Check for perfect quiz badges
    subjects.forEach((subject) => {
      const perfectInSubject = perfect.filter((id) => id.startsWith(subject.id)).length

      allBadgesData
        .filter(
          (badge) =>
            badge.requirement.type === "quiz_score" &&
            badge.requirement.subjectId === subject.id &&
            Number(badge.requirement.value) <= perfectInSubject &&
            !currentBadges.includes(badge.id),
        )
        .forEach((badge) => {
          saveUserBadge(badge.id)
          setNewlyEarnedBadge(badge.id)
          newBadgeEarned = true
        })
    })

    // Check for streak badges
    if (streak >= 5 && !currentBadges.includes("streak_5")) {
      saveUserBadge("streak_5")
      setNewlyEarnedBadge("streak_5")
      newBadgeEarned = true
    }

    if (streak >= 10 && !currentBadges.includes("streak_10")) {
      saveUserBadge("streak_10")
      setNewlyEarnedBadge("streak_10")
      newBadgeEarned = true
    }

    // If any new badge was earned, update the earned badges list
    if (newBadgeEarned) {
      setEarnedBadges(getUserBadges())
    }
  }

  const generateWeeklyBadgeChallenges = (earnedBadges: string[], allBadges: Badge[]) => {
    // Filter out already earned badges
    const unearnedBadges = allBadges.filter((badge) => !earnedBadges.includes(badge.id))

    // If there are less than 3 unearned badges, use all of them
    if (unearnedBadges.length <= 3) {
      setWeeklyBadgeChallenges(unearnedBadges)
      return
    }

    // Otherwise, randomly select 3 badges
    const shuffled = [...unearnedBadges].sort(() => 0.5 - Math.random())
    setWeeklyBadgeChallenges(shuffled.slice(0, 3))
  }

  const generatePerformanceData = (
    completed: string[],
    scores: Record<string, number>,
    perfect: string[],
    streak: number,
    dailyStreak: string[],
    lastActivityDates: Record<string, string>,
  ) => {
    // Calculate overall performance metrics
    const totalModules = getAllModules().length
    const completionRate = totalModules > 0 ? (completed.length / totalModules) * 100 : 0
    const averageScore =
      Object.keys(scores).length > 0
        ? Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length
        : 0
    const perfectRate = completed.length > 0 ? (perfect.length / completed.length) * 100 : 0

    setPerformanceData({
      completionRate: Math.round(completionRate),
      averageScore: Math.round(averageScore),
      perfectRate: Math.round(perfectRate),
      streak,
    })

    // Generate weekly activity data from completed modules
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, etc.

    // Initialize with zeros
    const weeklyData = days.map((day) => ({
      day,
      modules: 0,
      quizzes: 0,
      time: 0,
    }))

    // Fill in real data based on completed modules
    dailyStreak.forEach((dateStr) => {
      const date = new Date(dateStr)
      // Only count if within the last week
      const daysDiff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
      if (daysDiff < 7) {
        const dayIndex = (date.getDay() + 6) % 7 // Convert to 0 = Monday, 1 = Tuesday, etc.
        // Count modules completed on this day
        const modulesOnThisDay = completed.filter((moduleId) => {
          const moduleDate = lastActivityDates[moduleId]
          return moduleDate && new Date(moduleDate).toDateString() === date.toDateString()
        })

        weeklyData[dayIndex].modules += modulesOnThisDay.length
        weeklyData[dayIndex].quizzes += modulesOnThisDay.length // Assuming one quiz per module
        weeklyData[dayIndex].time += modulesOnThisDay.length * 25 // Estimate 25 minutes per module
      }
    })

    setWeeklyActivity(weeklyData)

    // Generate skill distribution data
    const skillData = subjects.map((subject) => {
      const subjectModules = getModulesBySubjectId(subject.id)
      const completedSubjectModules = completed.filter((id) => id.startsWith(subject.id))
      const percentage = subjectModules.length > 0 ? (completedSubjectModules.length / subjectModules.length) * 100 : 0

      return {
        subject: subject.name,
        value: Math.round(percentage),
        fullMark: 100,
        color: subject.color,
      }
    })
    setSkillDistribution(skillData)

    // Generate time spent data based on completed modules
    // Estimate time based on module difficulty
    const timeData = subjects.map((subject) => {
      const completedSubjectModules = completed.filter((id) => id.startsWith(subject.id))
      let totalTime = 0

      completedSubjectModules.forEach((moduleId) => {
        const module = getModuleById(moduleId)
        if (module) {
          // Estimate time based on difficulty
          switch (module.difficulty) {
            case "beginner":
              totalTime += 15
              break
            case "easy":
              totalTime += 20
              break
            case "medium":
              totalTime += 30
              break
            case "hard":
              totalTime += 45
              break
            case "expert":
              totalTime += 60
              break
            default:
              totalTime += 25
          }
        }
      })

      return {
        name: subject.name,
        value: totalTime,
        color: subject.color,
      }
    })
    setTimeSpent(timeData)

    // Generate learning rate data based on completed modules over time
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const todayForLearningRate = new Date()
    const currentMonth = todayForLearningRate.getMonth()
    const learningData = months.map((month, index) => {
      // Initialize with zeros
      return {
        name: month,
        modules: 0,
        score: 0,
      }
    })

    // Fill in real data
    completed.forEach((moduleId) => {
      const moduleDate = lastActivityDates[moduleId]
      if (moduleDate) {
        const date = new Date(moduleDate)
        const monthIndex = date.getMonth()
        learningData[monthIndex].modules += 1

        // Add score if available
        if (scores[moduleId]) {
          if (learningData[monthIndex].score === 0) {
            learningData[monthIndex].score = scores[moduleId]
          } else {
            // Average the scores
            const currentTotal = learningData[monthIndex].score * (learningData[monthIndex].modules - 1)
            learningData[monthIndex].score = Math.round(
              (currentTotal + scores[moduleId]) / learningData[monthIndex].modules,
            )
          }
        }
      }
    })

    // Reorder months to start with current month - 11 (show last 12 months)
    const reorderedLearningData = []
    for (let i = 0; i < 12; i++) {
      const index = (currentMonth - 11 + i + 12) % 12 // Ensure positive index
      reorderedLearningData.push(learningData[index])
    }

    setLearningRate(reorderedLearningData)

    // Generate daily activity data
    const hours = ["12am", "2am", "4am", "6am", "8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm", "10pm"]
    const dailyActivityData = hours.map((hour) => ({
      hour,
      activity: 0,
    }))

    // For now, we'll use a simple distribution based on completed modules
    // In a real app, you would track the exact time when modules were completed
    if (completed.length > 0) {
      // Morning (6am-12pm): 30% of activity
      dailyActivityData[3].activity = Math.round(completed.length * 0.1) // 6am
      dailyActivityData[4].activity = Math.round(completed.length * 0.1) // 8am
      dailyActivityData[5].activity = Math.round(completed.length * 0.1) // 10am

      // Afternoon (12pm-6pm): 40% of activity
      dailyActivityData[6].activity = Math.round(completed.length * 0.1) // 12pm
      dailyActivityData[7].activity = Math.round(completed.length * 0.15) // 2pm
      dailyActivityData[8].activity = Math.round(completed.length * 0.15) // 4pm

      // Evening (6pm-12am): 30% of activity
      dailyActivityData[9].activity = Math.round(completed.length * 0.15) // 6pm
      dailyActivityData[10].activity = Math.round(completed.length * 0.1) // 8pm
      dailyActivityData[11].activity = Math.round(completed.length * 0.05) // 10pm
    }

    setDailyActivity(dailyActivityData)

    // Generate recent activity
    const recentActivityData = completed.map((moduleId) => {
      const module = getModuleById(moduleId)
      const subject = subjects.find((s) => moduleId.startsWith(s.id))
      const score = scores[moduleId]
      const isPerfect = perfect.includes(moduleId)
      const activityDate = lastActivityDates[moduleId] ? new Date(lastActivityDates[moduleId]) : new Date()

      return {
        moduleId,
        moduleName: module ? module.title : `Module ${moduleId.split("-")[1]}`,
        subjectId: subject?.id || "",
        subjectName: subject?.name || "Unknown Subject",
        subjectColor: subject?.color || "#666",
        score,
        isPerfect,
        date: activityDate,
      }
    })

    // Sort by date (most recent first)
    recentActivityData.sort((a, b) => b.date.getTime() - a.date.getTime())

    setRecentActivity(recentActivityData)
  }

  const getFilteredBadges = () => {
    let filtered = [...allBadges]

    // Apply subject filter
    if (badgeFilter !== "all" && badgeFilter !== "earned" && badgeFilter !== "unearned") {
      filtered = filtered.filter(
        (badge) =>
          badge.requirement.subjectId === badgeFilter || (!badge.requirement.subjectId && badgeFilter === "overall"),
      )
    } else if (badgeFilter === "earned") {
      filtered = filtered.filter((badge) => earnedBadges.includes(badge.id))
    } else if (badgeFilter === "unearned") {
      filtered = filtered.filter((badge) => !earnedBadges.includes(badge.id))
    }

    // Apply search
    if (badgeSearch) {
      const search = badgeSearch.toLowerCase()
      filtered = filtered.filter(
        (badge) => badge.name.toLowerCase().includes(search) || badge.description.toLowerCase().includes(search),
      )
    }

    // Apply sorting
    if (badgeSort === "earned-first") {
      filtered.sort((a, b) => {
        const aEarned = earnedBadges.includes(a.id)
        const bEarned = earnedBadges.includes(b.id)
        if (aEarned && !bEarned) return -1
        if (!aEarned && bEarned) return 1
        return 0
      })
    } else if (badgeSort === "unearned-first") {
      filtered.sort((a, b) => {
        const aEarned = earnedBadges.includes(a.id)
        const bEarned = earnedBadges.includes(b.id)
        if (!aEarned && bEarned) return -1
        if (aEarned && !bEarned) return 1
        return 0
      })
    } else if (badgeSort === "alphabetical") {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    } else if (badgeSort === "recently-earned") {
      // This would require tracking when badges were earned
      // For now, we'll just show earned badges first
      filtered.sort((a, b) => {
        const aEarned = earnedBadges.includes(a.id)
        const bEarned = earnedBadges.includes(b.id)
        if (aEarned && !bEarned) return -1
        if (!aEarned && bEarned) return 1
        return 0
      })
    }

    return filtered
  }

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

  // Handle retaking a quiz
  const handleRetakeQuiz = (moduleId: string) => {
    router.push(`/module/${moduleId}`)
  }

  // Handle reviewing a quiz attempt
  const handleReviewQuiz = (moduleId: string, attemptNumber: number) => {
    router.push(`/performance/quiz-attempts/${moduleId}/${attemptNumber}`)
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
            Performance Dashboard
          </h1>
          <p className="text-xl text-gray-300">Track your learning journey in real-time</p>
        </div>

        {/* Performance Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-400">Completion Rate</p>
                  <h3 className="text-3xl font-bold mt-1">{performanceData.completionRate}%</h3>
                  <p className="text-xs text-gray-500 mt-1">of all modules</p>
                </div>
                <div className="bg-blue-500/20 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-blue-400" />
                </div>
              </div>
              <Progress value={performanceData.completionRate} className="h-1.5 mt-4" />
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-400">Average Score</p>
                  <h3 className="text-3xl font-bold mt-1">{performanceData.averageScore}%</h3>
                  <p className="text-xs text-gray-500 mt-1">across all quizzes</p>
                </div>
                <div className="bg-green-500/20 p-3 rounded-full">
                  <Star className="h-6 w-6 text-green-400" />
                </div>
              </div>
              <Progress value={performanceData.averageScore} className="h-1.5 mt-4 bg-gray-800">
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 to-green-500 transition-all duration-500"
                  style={{ width: `${performanceData.averageScore}%` }}
                ></div>
              </Progress>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-400">Perfect Quizzes</p>
                  <h3 className="text-3xl font-bold mt-1">{performanceData.perfectRate}%</h3>
                  <p className="text-xs text-gray-500 mt-1">of completed quizzes</p>
                </div>
                <div className="bg-purple-500/20 p-3 rounded-full">
                  <Award className="h-6 w-6 text-purple-400" />
                </div>
              </div>
              <Progress value={performanceData.perfectRate} className="h-1.5 mt-4 bg-gray-800">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${performanceData.perfectRate}%` }}
                ></div>
              </Progress>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-400">Current Streak</p>
                  <h3 className="text-3xl font-bold mt-1">{performanceData.streak} days</h3>
                  <p className="text-xs text-gray-500 mt-1">consecutive learning</p>
                </div>
                <div className="bg-orange-500/20 p-3 rounded-full">
                  <Zap className="h-6 w-6 text-orange-400" />
                </div>
              </div>
              <div className="flex mt-4 space-x-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full ${i < performanceData.streak % 8 ? "bg-orange-500" : "bg-gray-800"}`}
                  ></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-6 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="attempts">Attempts</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Learning Progress Over Time */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-blue-400" />
                    Learning Progress
                  </CardTitle>
                  <CardDescription>Modules completed and quiz scores over time</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={learningRate}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" stroke="#aaa" />
                        <YAxis yAxisId="left" stroke="#aaa" />
                        <YAxis yAxisId="right" orientation="right" stroke="#aaa" />
                        <Tooltip contentStyle={{ backgroundColor: "#222", borderColor: "#444" }} />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="modules"
                          name="Modules Completed"
                          stroke={getThemeColor()}
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="score"
                          name="Average Score (%)"
                          stroke={getSecondaryThemeColor()}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Skill Distribution */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="mr-2 h-5 w-5 text-yellow-400" />
                    Skill Distribution
                  </CardTitle>
                  <CardDescription>Your progress across different subjects</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius={90} data={skillDistribution}>
                        <PolarGrid stroke="#444" />
                        <PolarAngleAxis dataKey="subject" stroke="#aaa" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#aaa" />
                        <Radar
                          name="Progress"
                          dataKey="value"
                          stroke={getThemeColor()}
                          fill={getThemeColor()}
                          fillOpacity={0.6}
                        />
                        <Tooltip contentStyle={{ backgroundColor: "#222", borderColor: "#444" }} />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Activity */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-green-400" />
                    Weekly Activity
                  </CardTitle>
                  <CardDescription>Your learning activity for the past week</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyActivity}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="day" stroke="#aaa" />
                        <YAxis stroke="#aaa" />
                        <Tooltip contentStyle={{ backgroundColor: "#222", borderColor: "#444" }} />
                        <Legend />
                        <Bar dataKey="modules" name="Modules Completed" fill={getThemeColor()} />
                        <Bar dataKey="quizzes" name="Quizzes Taken" fill={getSecondaryThemeColor()} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Time Spent Distribution */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-purple-400" />
                    Time Distribution
                  </CardTitle>
                  <CardDescription>Minutes spent on each subject</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={timeSpent}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {timeSpent.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: "#222", borderColor: "#444" }}
                          formatter={(value) => [`${value} min`, "Time Spent"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Attempts Tab */}
          <TabsContent value="attempts">
            <div className="space-y-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-blue-400" />
                    Quiz Attempt History
                  </CardTitle>
                  <CardDescription>Timeline of all your quiz attempts</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {quizAttempts.length > 0 ? (
                    <div className="space-y-4">
                      {quizAttempts.map((attempt, index) => {
                        const module = getModuleById(attempt.moduleId)
                        const subject = subjects.find((s) => attempt.moduleId.startsWith(s.id))
                        const date = new Date(attempt.startTime)
                        const score = attempt.score
                        const totalQuestions = attempt.totalQuestions || 10
                        const scorePercentage = Math.round((score / totalQuestions) * 100)

                        return (
                          <Card key={index} className="bg-gray-800 border-gray-700 overflow-hidden">
                            <div className="h-1" style={{ backgroundColor: subject?.color || "#9333ea" }}></div>
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                  <h3 className="font-medium text-lg">{attempt.versionId}</h3>
                                  <p className="text-sm text-gray-400">{module?.title || "Unknown Module"}</p>
                                  <div className="flex items-center mt-1">
                                    <div
                                      className="w-3 h-3 rounded-full mr-2"
                                      style={{ backgroundColor: subject?.color || "#9333ea" }}
                                    ></div>
                                    <p className="text-xs text-gray-400">{subject?.name || "Unknown Subject"}</p>
                                  </div>
                                </div>

                                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                  <div className="text-center">
                                    <p className="text-xs text-gray-400">Date</p>
                                    <p className="text-sm">
                                      {date.toLocaleDateString()}{" "}
                                      {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                  </div>

                                  <div className="text-center">
                                    <p className="text-xs text-gray-400">Duration</p>
                                    <p className="text-sm">{formatTime(attempt.totalTime)}</p>
                                  </div>

                                  <div className="text-center">
                                    <p className="text-xs text-gray-400">Score</p>
                                    <p
                                      className="text-sm font-medium"
                                      style={{ color: scorePercentage >= 70 ? "#10b981" : "#ec4899" }}
                                    >
                                      {score}/{totalQuestions} ({scorePercentage}%)
                                    </p>
                                  </div>

                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleReviewQuiz(attempt.moduleId, attempt.attemptNumber)}
                                    >
                                      <Eye className="mr-1 h-4 w-4" />
                                      Review
                                    </Button>

                                    <Button size="sm" onClick={() => handleRetakeQuiz(attempt.moduleId)}>
                                      <RotateCcw className="mr-1 h-4 w-4" />
                                      Retake
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <p>No quiz attempts recorded yet. Start taking quizzes to see your history here!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Subjects Tab */}
          <TabsContent value="subjects">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => {
                const progress = subjectProgress[subject.id] || 0
                const completedCount = completedModules.filter((id) => id.startsWith(subject.id)).length
                const totalModules = getModulesBySubjectId(subject.id).length

                // Calculate average score for this subject
                const subjectQuizzes = Object.entries(quizScores).filter(([moduleId]) =>
                  moduleId.startsWith(subject.id),
                )

                const avgScore =
                  subjectQuizzes.length > 0
                    ? Math.round(subjectQuizzes.reduce((sum, [_, score]) => sum + score, 0) / subjectQuizzes.length)
                    : 0

                // Get time spent on this subject
                const timeForSubject = timeSpent.find((t) => t.name === subject.name)?.value || 0

                return (
                  <Card key={subject.id} className="bg-gray-900 border-gray-800 overflow-hidden">
                    <div className="h-2" style={{ backgroundColor: subject.color }}></div>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <div className="w-8 h-8 rounded-full mr-2" style={{ backgroundColor: subject.color }}>
                          <div className="w-full h-full flex items-center justify-center text-black font-bold">
                            {subject.name.charAt(0)}
                          </div>
                        </div>
                        {subject.name}
                      </CardTitle>
                      <CardDescription>
                        {completedCount} of {totalModules} modules completed
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span
                              className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full"
                              style={{ backgroundColor: `${subject.color}30` }}
                            >
                              Progress
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block" style={{ color: subject.color }}>
                              {progress}%
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-800">
                          <div
                            style={{
                              width: `${progress}%`,
                              backgroundColor: subject.color,
                            }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500"
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-gray-800 rounded-lg p-3 text-center">
                          <p className="text-xs text-gray-400">Avg. Score</p>
                          <p className="text-xl font-bold" style={{ color: subject.color }}>
                            {avgScore}%
                          </p>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-3 text-center">
                          <p className="text-xs text-gray-400">Time Spent</p>
                          <p className="text-xl font-bold" style={{ color: subject.color }}>
                            {timeForSubject} min
                          </p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h4 className="text-sm font-medium mb-2">Recent Activity</h4>
                        <div className="space-y-2">
                          {completedModules
                            .filter((id) => id.startsWith(subject.id))
                            .slice(-3)
                            .map((moduleId, index) => {
                              const module = getModuleById(moduleId)
                              return (
                                <div key={index} className="text-xs bg-gray-800 p-2 rounded flex justify-between">
                                  <span>{module ? module.title : `Module ${moduleId.split("-")[1]}`}</span>
                                  <span style={{ color: subject.color }}>
                                    {quizScores[moduleId] ? `${quizScores[moduleId]}%` : "Completed"}
                                  </span>
                                </div>
                              )
                            })}
                          {completedModules.filter((id) => id.startsWith(subject.id)).length === 0 && (
                            <div className="text-xs text-gray-500 text-center py-2">No modules completed yet</div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-800/50 px-6 py-3">
                      <Button
                        variant="ghost"
                        className="w-full text-sm"
                        onClick={() => router.push(`/subject/${subject.id}`)}
                      >
                        View Subject
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Daily Activity Heatmap */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-blue-400" />
                    Daily Activity
                  </CardTitle>
                  <CardDescription>Your learning activity throughout the day</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dailyActivity}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="hour" stroke="#aaa" />
                        <YAxis stroke="#aaa" />
                        <Tooltip contentStyle={{ backgroundColor: "#222", borderColor: "#444" }} />
                        <Area
                          type="monotone"
                          dataKey="activity"
                          name="Activity Level"
                          stroke={getThemeColor()}
                          fill={getThemeColor()}
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Learning Streak */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="mr-2 h-5 w-5 text-yellow-400" />
                    Learning Streak
                  </CardTitle>
                  <CardDescription>Your consecutive days of learning</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-center h-80">
                    <div className="relative w-64 h-64">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        {/* Background circle */}
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#333" strokeWidth="10" />

                        {/* Progress circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="url(#streakGradient)"
                          strokeWidth="10"
                          strokeDasharray="283"
                          strokeDashoffset={283 - 283 * Math.min(streakCount / 30, 1)}
                          transform="rotate(-90 50 50)"
                        />

                        {/* Gradient definition */}
                        <defs>
                          <linearGradient id="streakGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#FF5F6D" />
                            <stop offset="100%" stopColor="#FFC371" />
                          </linearGradient>
                        </defs>
                      </svg>

                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <div className="text-5xl font-bold">{streakCount}</div>
                        <div className="text-lg">days</div>
                        <div className="text-sm text-gray-400 mt-2">Current Streak</div>
                      </div>
                    </div>

                    <div className="mt-6 text-center">
                      <p className="text-sm text-gray-400">Keep learning daily to increase your streak!</p>
                      <p className="text-xs text-gray-500 mt-1">Longest streak: {Math.max(streakCount, 1)} days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity Log */}
              <Card className="bg-gray-900 border-gray-800 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5 text-purple-400" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Your latest learning activities</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {recentActivity.slice(0, 5).map((activity, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-800 rounded-lg">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center mr-4"
                          style={{ backgroundColor: activity.subjectColor }}
                        >
                          <BookOpen className="h-5 w-5 text-black" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{activity.moduleName}</h4>
                            <span className="text-xs text-gray-400">{activity.date.toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-gray-400">{activity.subjectName}</p>
                        </div>
                        {activity.score && (
                          <div
                            className="ml-4 px-3 py-1 rounded-full text-sm font-medium"
                            style={{
                              backgroundColor: activity.isPerfect ? "#10b98130" : "#9333ea30",
                              color: activity.isPerfect ? "#10b981" : "#9333ea",
                            }}
                          >
                            {activity.score}%
                          </div>
                        )}
                      </div>
                    ))}

                    {recentActivity.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        No activity recorded yet. Start learning to see your activity here!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="bg-gray-900 border-gray-800 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-green-400" />
                    Learning Patterns
                  </CardTitle>
                  <CardDescription>Analysis of your learning habits and performance</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Strongest Subjects</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {skillDistribution
                          .sort((a, b) => b.value - a.value)
                          .slice(0, 3)
                          .map((subject, index) => (
                            <div key={index} className="flex items-center">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                                style={{ backgroundColor: subject.color }}
                              >
                                <span className="text-black font-bold">{index + 1}</span>
                              </div>
                              <div>
                                <p className="font-medium">{subject.subject}</p>
                                <p className="text-sm text-gray-400">{subject.value}% complete</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-800 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Areas for Improvement</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {skillDistribution
                          .sort((a, b) => a.value - b.value)
                          .slice(0, 3)
                          .map((subject, index) => (
                            <div key={index} className="flex items-center">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-gray-700">
                                <span>{index + 1}</span>
                              </div>
                              <div>
                                <p className="font-medium">{subject.subject}</p>
                                <p className="text-sm text-gray-400">{subject.value}% complete</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-800 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Learning Recommendations</h3>
                      <ul className="space-y-2">
                        {skillDistribution.length > 0 && (
                          <li className="flex items-start">
                            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-0.5">
                              <span className="text-blue-400 text-xs">1</span>
                            </div>
                            <p className="text-sm">
                              Focus on {skillDistribution.sort((a, b) => a.value - b.value)[0]?.subject} to balance your
                              knowledge areas.
                            </p>
                          </li>
                        )}
                        <li className="flex items-start">
                          <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mr-3 mt-0.5">
                            <span className="text-green-400 text-xs">2</span>
                          </div>
                          <p className="text-sm">
                            Your best learning time appears to be in the evening. Schedule important modules then.
                          </p>
                        </li>
                        <li className="flex items-start">
                          <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 mt-0.5">
                            <span className="text-purple-400 text-xs">3</span>
                          </div>
                          <p className="text-sm">Try to maintain your daily streak for optimal learning retention.</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-cyan-400" />
                    Peer Comparison
                  </CardTitle>
                  <CardDescription>How you compare to other learners</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Completion Rate</h3>
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block text-cyan-400">You</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-cyan-400">
                              {performanceData.completionRate}%
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-800">
                          <div
                            style={{ width: `${performanceData.completionRate}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-cyan-500"
                          ></div>
                        </div>

                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block text-gray-400">Average</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-gray-400">
                              {Math.max(5, Math.round(performanceData.completionRate * 0.8))}%
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-800">
                          <div
                            style={{ width: `${Math.max(5, Math.round(performanceData.completionRate * 0.8))}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gray-600"
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Quiz Scores</h3>
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block text-cyan-400">You</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-cyan-400">
                              {performanceData.averageScore}%
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-800">
                          <div
                            style={{ width: `${performanceData.averageScore}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-cyan-500"
                          ></div>
                        </div>

                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block text-gray-400">Average</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-gray-400">
                              {Math.max(60, Math.round(performanceData.averageScore * 0.9))}%
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-800">
                          <div
                            style={{ width: `${Math.max(60, Math.round(performanceData.averageScore * 0.9))}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gray-600"
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Learning Streak</h3>
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block text-cyan-400">You</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-cyan-400">
                              {performanceData.streak} days
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-800">
                          <div
                            style={{ width: `${Math.min(performanceData.streak * 10, 100)}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-cyan-500"
                          ></div>
                        </div>

                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block text-gray-400">Average</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-gray-400">
                              {Math.max(1, Math.floor(performanceData.streak * 0.7))} days
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-800">
                          <div
                            style={{
                              width: `${Math.min(Math.max(1, Math.floor(performanceData.streak * 0.7)) * 10, 100)}%`,
                            }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gray-600"
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center p-4 bg-gray-800 rounded-lg">
                      <p className="text-sm">You're performing better than</p>
                      <p className="text-3xl font-bold text-cyan-400 my-2">
                        {Math.min(99, Math.max(50, 50 + performanceData.completionRate))}%
                      </p>
                      <p className="text-sm text-gray-400">of learners in your category</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges">
            {/* Badge Notification */}
            <AnimatePresence>
              {newlyEarnedBadge && (
                <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50"
                >
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-1 rounded-lg shadow-xl">
                    <div className="bg-gray-900 rounded-lg p-4 flex items-center space-x-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full animate-ping opacity-30"></div>
                        <div className="relative">
                          <BadgeDisplay badgeId={newlyEarnedBadge} isEarned={true} size="small" showTooltip={false} />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">New Badge Earned!</h3>
                        <p className="text-gray-300">
                          {allBadges.find((b) => b.id === newlyEarnedBadge)?.name || "Achievement Unlocked"}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Badge Detail Modal */}
            <AnimatePresence>
              {showBadgeDetails && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
                  onClick={() => setShowBadgeDetails(null)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {(() => {
                      const badge = allBadges.find((b) => b.id === showBadgeDetails)
                      if (!badge) return null

                      const isEarned = earnedBadges.includes(badge.id)

                      return (
                        <>
                          <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-bold">{badge.name}</h2>
                            <button
                              onClick={() => setShowBadgeDetails(null)}
                              className="text-gray-400 hover:text-white"
                            >
                              <X size={24} />
                            </button>
                          </div>

                          <div className="flex justify-center mb-6">
                            <BadgeDisplay
                              badgeId={badge.id}
                              isEarned={isEarned}
                              size="large"
                              showTooltip={false}
                              showAnimation={true}
                            />
                          </div>

                          <div className="space-y-4">
                            <div>
                              <h3 className="text-lg font-medium mb-1">Description</h3>
                              <p className="text-gray-300">{badge.description}</p>
                            </div>

                            <div>
                              <h3 className="text-lg font-medium mb-1">How to Earn</h3>
                              <p className="text-gray-300">{getRequirementText(badge.requirement)}</p>
                            </div>

                            {isEarned ? (
                              <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 text-center">
                                <p className="text-green-400 font-medium">You've earned this badge! Great job!</p>
                              </div>
                            ) : (
                              <div className="bg-gray-800 rounded-lg p-4 text-center">
                                <p className="text-gray-300">Keep learning to earn this badge!</p>
                              </div>
                            )}
                          </div>
                        </>
                      )
                    })()}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-8">
              {/* Badge Filters */}
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <label htmlFor="badge-search" className="text-sm font-medium mb-2 block">
                        Search Badges
                      </label>
                      <div className="relative">
                        <Search
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <Input
                          id="badge-search"
                          placeholder="Search by name or description..."
                          className="pl-10"
                          value={badgeSearch}
                          onChange={(e) => setBadgeSearch(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="badge-filter" className="text-sm font-medium mb-2 block">
                        Filter
                      </label>
                      <Select value={badgeFilter} onValueChange={setBadgeFilter}>
                        <SelectTrigger id="badge-filter" className="w-[180px]">
                          <SelectValue placeholder="Filter badges" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Badges</SelectItem>
                          <SelectItem value="earned">Earned Only</SelectItem>
                          <SelectItem value="unearned">Unearned Only</SelectItem>
                          <SelectItem value="overall">Overall Badges</SelectItem>
                          {subjects.map((subject) => (
                            <SelectItem key={subject.id} value={subject.id}>
                              {subject.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label htmlFor="badge-sort" className="text-sm font-medium mb-2 block">
                        Sort
                      </label>
                      <Select value={badgeSort} onValueChange={setBadgeSort}>
                        <SelectTrigger id="badge-sort" className="w-[180px]">
                          <SelectValue placeholder="Sort badges" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="earned-first">Earned First</SelectItem>
                          <SelectItem value="unearned-first">Unearned First</SelectItem>
                          <SelectItem value="alphabetical">Alphabetical</SelectItem>
                          <SelectItem value="recently-earned">Recently Earned</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Badge Challenges */}
              <Card className="bg-gray-900 border-gray-800 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600"></div>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-yellow-400" />
                    Weekly Badge Challenges
                  </CardTitle>
                  <CardDescription>Complete these challenges to earn special badges</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {weeklyBadgeChallenges.map((badge) => (
                      <div key={badge.id} className="bg-gray-800 rounded-lg p-4 flex flex-col items-center">
                        <BadgeDisplay
                          badgeId={badge.id}
                          isEarned={earnedBadges.includes(badge.id)}
                          size="medium"
                          onClick={() => setShowBadgeDetails(badge.id)}
                        />
                        <div className="mt-4 text-center">
                          <h3 className="font-medium">{badge.name}</h3>
                          <p className="text-sm text-gray-400 mt-1">{badge.description}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-3"
                            onClick={() => setShowBadgeDetails(badge.id)}
                          >
                            View Challenge
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Badge Collection */}
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Medal className="mr-2 h-6 w-6 text-yellow-400" />
                  Badge Collection
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {getFilteredBadges().map((badge) => (
                    <BadgeDisplay
                      key={badge.id}
                      badgeId={badge.id}
                      isEarned={earnedBadges.includes(badge.id)}
                      size="medium"
                      onClick={() => setShowBadgeDetails(badge.id)}
                    />
                  ))}

                  {getFilteredBadges().length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-400">
                      No badges match your current filters. Try adjusting your search or filter settings.
                    </div>
                  )}
                </div>
              </div>

              {/* Badge Progress Summary */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-5 w-5 text-purple-400" />
                    Badge Collection Progress
                  </CardTitle>
                  <CardDescription>Your journey to collecting all badges</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Total Badges Earned</span>
                        <span className="text-sm font-medium">
                          {earnedBadges.length} / {allBadges.length}
                        </span>
                      </div>
                      <Progress value={(earnedBadges.length / allBadges.length) * 100} className="h-2" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="text-sm font-medium mb-2">Subject Badge Progress</h3>
                        <div className="space-y-3">
                          {subjects.map((subject) => {
                            const subjectBadgeList = allBadges.filter(
                              (badge) => badge.requirement.subjectId === subject.id,
                            )
                            const earnedSubjectBadges = earnedBadges.filter((badgeId) =>
                              subjectBadgeList.some((badge) => badge.id === badgeId),
                            )
                            const percentage =
                              subjectBadgeList.length > 0
                                ? (earnedSubjectBadges.length / subjectBadgeList.length) * 100
                                : 0

                            return (
                              <div key={subject.id}>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs" style={{ color: subject.color }}>
                                    {subject.name}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {earnedSubjectBadges.length} / {subjectBadgeList.length}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-1.5">
                                  <div
                                    className="h-1.5 rounded-full"
                                    style={{
                                      width: `${percentage}%`,
                                      backgroundColor: subject.color,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="text-sm font-medium mb-2">Recent Badges</h3>
                        <div className="space-y-2">
                          {earnedBadges.slice(-3).map((badgeId) => {
                            const badge = allBadges.find((b) => b.id === badgeId)
                            if (!badge) return null

                            return (
                              <div key={badgeId} className="flex items-center p-2 bg-gray-700 rounded">
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                                  style={{ backgroundColor: badge.color }}
                                >
                                  <span className="text-black text-xs">{badge.icon}</span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{badge.name}</p>
                                  <p className="text-xs text-gray-400">{badge.description}</p>
                                </div>
                              </div>
                            )
                          })}

                          {earnedBadges.length === 0 && (
                            <div className="text-center py-4 text-gray-400 text-sm">
                              No badges earned yet. Start learning to earn badges!
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

// Helper function to get human-readable requirement text
function getRequirementText(requirement: { type: string; value: number | string; subjectId?: string }) {
  switch (requirement.type) {
    case "modules_completed":
      return `Complete ${requirement.value} modules${requirement.subjectId ? ` in ${requirement.subjectId}` : ""}`
    case "quiz_score":
      return `Get 100% on ${requirement.value} quizzes${requirement.subjectId ? ` in ${requirement.subjectId}` : ""}`
    case "streak":
      return `Maintain a ${requirement.value}-day streak${requirement.subjectId ? ` in ${requirement.subjectId}` : ""}`
    case "skill_unlocked":
      return `Unlock the ${requirement.value} skill${requirement.subjectId ? ` in ${requirement.subjectId}` : ""}`
    case "special":
      return "Complete a special achievement"
    default:
      return "Complete the required tasks"
  }
}
