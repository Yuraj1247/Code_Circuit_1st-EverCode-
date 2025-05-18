"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { Info, RotateCcw, Volume2, VolumeX } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface Question {
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string // Added explanation field
}

interface QuizProps {
  questions: Question[]
  onComplete: (score: number) => void
  moduleId: string // Added moduleId for tracking attempts
}

export function Quiz({ questions, onComplete, moduleId }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(Array(questions.length).fill(-1))
  const [showResults, setShowResults] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [shuffleQuestionsOnRetest, setShuffleQuestionsOnRetest] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [attemptNumber, setAttemptNumber] = useState(1)
  const [startTime, setStartTime] = useState<Date>(new Date())
  const [questionStartTimes, setQuestionStartTimes] = useState<Date[]>([])
  const [questionEndTimes, setQuestionEndTimes] = useState<Date[]>(Array(questions.length).fill(null))
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([...questions])
  const [isRetest, setIsRetest] = useState(false)
  const [questionResponses, setQuestionResponses] = useState<
    {
      questionIndex: number
      selectedAnswer: number
      isCorrect: boolean
      timeSpent: number
    }[]
  >([])
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const lastFeedbackMessage = useRef("")

  // Feedback message arrays
  const positivePhrases = ["Awesome job!", "You nailed it!", "Perfect answer!", "Well done!"]
  const motivationalPhrases = ["Nice try!", "Don't worry!", "Keep going!", "You're learning!"]

  // Initialize question start times
  useEffect(() => {
    setQuestionStartTimes(Array(questions.length).fill(new Date()))

    // Get the number of previous attempts for this module
    const attempts = getQuizAttempts(moduleId)
    setAttemptNumber(attempts.length + 1)
  }, [questions.length, moduleId])

  // Cancel speech when component unmounts
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const handleAnswerSelect = (answerIndex: number) => {
    const newSelectedAnswers = [...selectedAnswers]
    newSelectedAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newSelectedAnswers)

    // Record the end time for this question
    const newQuestionEndTimes = [...questionEndTimes]
    newQuestionEndTimes[currentQuestion] = new Date()
    setQuestionEndTimes(newQuestionEndTimes)

    // Record response
    const isCorrect = answerIndex === shuffledQuestions[currentQuestion].correctAnswer
    const newResponses = [...questionResponses]
    const timeSpent = newQuestionEndTimes[currentQuestion].getTime() - questionStartTimes[currentQuestion].getTime()
    newResponses[currentQuestion] = {
      questionIndex: currentQuestion,
      selectedAnswer: answerIndex,
      isCorrect: isCorrect,
      timeSpent: timeSpent,
    }
    setQuestionResponses(newResponses)

    // Generate feedback message without repeating the last one
    let message
    if (isCorrect) {
      do {
        message = positivePhrases[Math.floor(Math.random() * positivePhrases.length)]
      } while (message === lastFeedbackMessage.current)
    } else {
      do {
        message = motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)]
      } while (message === lastFeedbackMessage.current)
    }

    lastFeedbackMessage.current = message
    setFeedbackMessage(message)

    // Show explanation after selecting an answer
    setShowExplanation(true)

    // Read feedback and explanation if voice is enabled
    if (voiceEnabled && "speechSynthesis" in window) {
      // First speak the feedback message
      const feedbackUtterance = new SpeechSynthesisUtterance(message)

      // When feedback is done, speak the explanation
      feedbackUtterance.onend = () => {
        if (shuffledQuestions[currentQuestion].explanation) {
          const explanationUtterance = new SpeechSynthesisUtterance(shuffledQuestions[currentQuestion].explanation)
          window.speechSynthesis.speak(explanationUtterance)
        }
      }

      window.speechSynthesis.speak(feedbackUtterance)
    }
  }

  const handleNext = () => {
    // Cancel any ongoing speech
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }

    setShowExplanation(false)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      // Set start time for next question
      const newQuestionStartTimes = [...questionStartTimes]
      newQuestionStartTimes[currentQuestion + 1] = new Date()
      setQuestionStartTimes(newQuestionStartTimes)
    } else {
      setShowResults(true)

      // Calculate score
      const score = selectedAnswers.reduce((total, answer, index) => {
        return total + (answer === shuffledQuestions[index].correctAnswer ? 1 : 0)
      }, 0)

      // Save attempt data
      const endTime = new Date()
      const totalTime = endTime.getTime() - startTime.getTime()
      const subjectId = moduleId.split("-")[0]
      const moduleNumber = moduleId.split("-")[1]
      const versionId = `${subjectId}_Module${moduleNumber}_Attempt${attemptNumber}`

      saveQuizAttempt({
        versionId,
        moduleId,
        attemptNumber,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        totalTime,
        score,
        totalQuestions: questions.length,
        responses: questionResponses,
        questions: shuffledQuestions.map((q, i) => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          selectedAnswer: selectedAnswers[i],
          isCorrect: selectedAnswers[i] === q.correctAnswer,
        })),
      })

      onComplete(score)
    }
  }

  const handlePrevious = () => {
    // Cancel any ongoing speech
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }

    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setShowExplanation(selectedAnswers[currentQuestion - 1] !== -1)
    }
  }

  const handleRetest = () => {
    // Cancel any ongoing speech
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }

    // Reset state for retest
    setShowResults(false)
    setCurrentQuestion(0)
    setSelectedAnswers(Array(questions.length).fill(-1))
    setQuestionEndTimes(Array(questions.length).fill(null))
    setStartTime(new Date())
    setQuestionStartTimes(Array(questions.length).fill(new Date()))
    setQuestionResponses([])
    setIsRetest(true)
    setAttemptNumber(attemptNumber + 1)

    // Shuffle questions if option is selected
    if (shuffleQuestionsOnRetest) {
      const shuffled = [...questions].sort(() => Math.random() - 0.5)
      setShuffledQuestions(shuffled)
    } else {
      setShuffledQuestions([...questions])
    }

    setShowExplanation(false)
  }

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled)
    if (voiceEnabled && "speechSynthesis" in window) {
      window.speechSynthesis.cancel() // Stop any ongoing speech
    }
  }

  const currentQuestionData = shuffledQuestions[currentQuestion]
  const isAnswered = selectedAnswers[currentQuestion] !== -1
  const isCorrect = isAnswered && selectedAnswers[currentQuestion] === currentQuestionData.correctAnswer

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quiz Time!</h2>
        <div className="flex items-center space-x-4">
          {!showResults && (
            <>
              <div className="flex items-center space-x-2">
                <button onClick={toggleVoice} className="text-gray-400 hover:text-white">
                  {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>
                <span className="text-sm text-gray-400">{voiceEnabled ? "Voice On" : "Voice Off"}</span>
              </div>
              <div className="text-sm text-gray-400">
                Attempt #{attemptNumber} {isRetest ? "(Retest)" : ""}
              </div>
            </>
          )}
        </div>
      </div>

      {!showResults ? (
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-2">
              Question {currentQuestion + 1} of {questions.length}
            </p>
            <h3 className="text-xl font-medium mb-4">{currentQuestionData.question}</h3>

            <RadioGroup
              value={selectedAnswers[currentQuestion].toString()}
              onValueChange={(value) => handleAnswerSelect(Number.parseInt(value))}
              className="space-y-3"
            >
              {currentQuestionData.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 p-3 rounded-md hover:bg-gray-800/50 transition-colors ${
                    isAnswered && index === currentQuestionData.correctAnswer
                      ? "bg-green-900/20 border border-green-500/30"
                      : isAnswered &&
                          index === selectedAnswers[currentQuestion] &&
                          index !== currentQuestionData.correctAnswer
                        ? "bg-red-900/20 border border-red-500/30"
                        : ""
                  }`}
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} disabled={isAnswered} />
                  <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <AnimatePresence>
            {showExplanation && currentQuestionData.explanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className={`mb-6 p-4 rounded-lg ${
                  isCorrect ? "bg-green-900/20 border border-green-500/30" : "bg-blue-900/20 border border-blue-500/30"
                }`}
              >
                <div className="flex items-start">
                  <Info className="h-5 w-5 mr-2 mt-0.5 text-blue-400" />
                  <div>
                    <h4 className="font-medium text-blue-400 mb-1">{feedbackMessage} Explanation:</h4>
                    <p className="text-gray-300">{currentQuestionData.explanation}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestion] === -1}
              className={
                isAnswered ? "bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700" : ""
              }
            >
              {currentQuestion < questions.length - 1 ? "Next" : "Finish Quiz"}
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4">Quiz Completed!</h3>
            <p className="text-xl">
              Your score:{" "}
              <span className="font-bold text-purple-400">
                {selectedAnswers.reduce((total, answer, index) => {
                  return total + (answer === shuffledQuestions[index].correctAnswer ? 1 : 0)
                }, 0)}{" "}
                / {questions.length}
              </span>
            </p>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg mb-8">
            <h4 className="font-medium mb-3">Retest Options</h4>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Switch
                id="shuffle-questions"
                checked={shuffleQuestionsOnRetest}
                onCheckedChange={setShuffleQuestionsOnRetest}
              />
              <Label htmlFor="shuffle-questions">Shuffle questions on retest</Label>
            </div>
            <Button
              onClick={handleRetest}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Retake Quiz
            </Button>
          </div>

          <Button
            size="lg"
            onClick={() =>
              onComplete(
                selectedAnswers.reduce((total, answer, index) => {
                  return total + (answer === shuffledQuestions[index].correctAnswer ? 1 : 0)
                }, 0),
              )
            }
            className="bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700"
          >
            Complete Module
          </Button>
        </motion.div>
      )}
    </div>
  )
}

// Helper functions for quiz attempts
function getQuizAttempts(moduleId: string): any[] {
  if (typeof window === "undefined") {
    return []
  }
  const key = `quizAttempts_${moduleId}`
  const attempts = localStorage.getItem(key)
  return attempts ? JSON.parse(attempts) : []
}

function saveQuizAttempt(attemptData: any): void {
  if (typeof window === "undefined") {
    return
  }
  const { moduleId } = attemptData
  const key = `quizAttempts_${moduleId}`
  const attempts = getQuizAttempts(moduleId)
  attempts.push(attemptData)
  localStorage.setItem(key, JSON.stringify(attempts))
}
