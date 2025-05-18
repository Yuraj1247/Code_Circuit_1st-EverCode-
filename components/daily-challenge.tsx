"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Trophy } from "lucide-react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"

interface DailyChallengeProps {
  onComplete: (correct: boolean) => void
}

export function DailyChallenge({ onComplete }: DailyChallengeProps) {
  const [challenge, setChallenge] = useState<any>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [hasCompleted, setHasCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check if user has already completed today's challenge
    const today = new Date().toISOString().split("T")[0]
    const completedChallenges = JSON.parse(localStorage.getItem("completedChallenges") || "{}")

    if (completedChallenges[today]) {
      setHasCompleted(true)
    }

    // Get a random challenge
    fetchDailyChallenge()
  }, [])

  const fetchDailyChallenge = () => {
    // In a real app, this would fetch from an API
    // For demo, we'll generate a random challenge
    const challenges = [
      {
        question: "What is the largest planet in our solar system?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 2,
        subject: "Science",
      },
      {
        question: "What is the value of π (pi) to two decimal places?",
        options: ["3.14", "3.41", "3.12", "3.16"],
        correctAnswer: 0,
        subject: "Math",
      },
      {
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "Jane Austen", "William Shakespeare", "Mark Twain"],
        correctAnswer: 2,
        subject: "Literature",
      },
      {
        question: "Which element has the chemical symbol 'O'?",
        options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
        correctAnswer: 1,
        subject: "Science",
      },
      {
        question: "In which year did World War II end?",
        options: ["1943", "1944", "1945", "1946"],
        correctAnswer: 2,
        subject: "History",
      },
    ]

    // Get a random challenge
    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)]
    setChallenge(randomChallenge)
    setLoading(false)
  }

  const handleAnswerSelect = (index: number) => {
    if (isCorrect !== null) return // Already answered
    setSelectedAnswer(index)
  }

  const handleSubmit = () => {
    if (selectedAnswer === null || !mounted) return

    const correct = selectedAnswer === challenge.correctAnswer
    setIsCorrect(correct)

    if (correct) {
      // Trigger confetti for correct answer
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }

    // Save completion status
    const today = new Date().toISOString().split("T")[0]
    const completedChallenges = JSON.parse(localStorage.getItem("completedChallenges") || "{}")
    completedChallenges[today] = correct
    localStorage.setItem("completedChallenges", JSON.stringify(completedChallenges))

    // Update streak if correct
    if (correct) {
      const streaks = JSON.parse(localStorage.getItem("dailyStreak") || "[]")
      if (!streaks.includes(today)) {
        streaks.push(today)
        localStorage.setItem("dailyStreak", JSON.stringify(streaks))
      }
    }

    setHasCompleted(true)
    onComplete(correct)
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </CardContent>
      </Card>
    )
  }

  if (hasCompleted && mounted) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
            Daily Challenge Completed
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="mb-4">You've already completed today's challenge!</p>
          <p className="text-sm text-gray-400">Come back tomorrow for a new challenge.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Daily Challenge</CardTitle>
          <Badge variant="outline">{challenge.subject}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">{challenge.question}</h3>

        <div className="space-y-2">
          {challenge.options.map((option: string, index: number) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-3 rounded-md cursor-pointer border transition-colors ${
                selectedAnswer === index
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-gray-700 hover:border-gray-500"
              } ${isCorrect !== null && index === challenge.correctAnswer ? "border-green-500 bg-green-500/10" : ""} ${
                isCorrect === false && index === selectedAnswer ? "border-red-500 bg-red-500/10" : ""
              }`}
              onClick={() => handleAnswerSelect(index)}
            >
              <div className="flex items-center">
                <span className="mr-2">{String.fromCharCode(65 + index)}.</span>
                <span className="flex-grow">{option}</span>

                {isCorrect !== null && index === challenge.correctAnswer && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}

                {isCorrect === false && index === selectedAnswer && <XCircle className="h-5 w-5 text-red-500" />}
              </div>
            </motion.div>
          ))}
        </div>

        {isCorrect !== null && (
          <div
            className={`mt-4 p-3 rounded-md ${
              isCorrect ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
            }`}
          >
            {isCorrect
              ? "Correct! Great job!"
              : `Incorrect. The correct answer is ${challenge.options[challenge.correctAnswer]}.`}
          </div>
        )}
      </CardContent>
      <CardFooter className="px-6 pb-6 pt-0">
        {isCorrect === null ? (
          <Button onClick={handleSubmit} disabled={selectedAnswer === null} className="w-full">
            Submit Answer
          </Button>
        ) : (
          <p className="text-sm text-gray-400 text-center w-full">Come back tomorrow for a new challenge!</p>
        )}
      </CardFooter>
    </Card>
  )
}
