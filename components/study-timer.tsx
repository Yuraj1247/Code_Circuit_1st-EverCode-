"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function StudyTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [cycles, setCycles] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [customDuration, setCustomDuration] = useState(25)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Load saved cycles from localStorage if available
    if (typeof window !== "undefined") {
      const savedCycles = localStorage.getItem("studyTimerCycles")
      if (savedCycles) {
        setCycles(Number.parseInt(savedCycles, 10))
      }
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (isRunning && timeLeft === 0) {
      // Timer finished
      if (soundEnabled) {
        playSound()
      }

      if (isBreak) {
        // Break finished, start work session
        setIsBreak(false)
        setTimeLeft(customDuration * 60)
        const newCycles = cycles + 1
        setCycles(newCycles)

        // Save cycles to localStorage
        if (mounted) {
          localStorage.setItem("studyTimerCycles", newCycles.toString())
        }
      } else {
        // Work session finished, start break
        setIsBreak(true)
        setTimeLeft(5 * 60) // 5 minute break
      }
    }

    return () => clearInterval(interval)
  }, [isRunning, timeLeft, isBreak, customDuration, soundEnabled, cycles, mounted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartPause = () => {
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    setIsRunning(false)
    setIsBreak(false)
    setTimeLeft(customDuration * 60)
  }

  const handleDurationChange = (value: number[]) => {
    const newDuration = value[0]
    setCustomDuration(newDuration)
    if (!isRunning) {
      setTimeLeft(newDuration * 60)
    }
  }

  const playSound = () => {
    // In a real app, you would play a sound here
    console.log("Playing timer completion sound")
  }

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
  }

  const progressPercentage = isBreak ? (timeLeft / (5 * 60)) * 100 : (timeLeft / (customDuration * 60)) * 100

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Study Timer</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={toggleSound}>
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <span className="text-sm text-gray-400">Cycles: {cycles}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative h-48 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle cx="50" cy="50" r="45" fill="none" stroke="#333" strokeWidth="5" />

            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={isBreak ? "#10b981" : "#9333ea"}
              strokeWidth="5"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progressPercentage) / 100}
              transform="rotate(-90 50 50)"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={isBreak ? "break" : "work"}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="text-4xl font-bold">{formatTime(timeLeft)}</div>
                <div className="text-sm text-gray-400 mt-2">{isBreak ? "Break Time" : "Focus Time"}</div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {!isRunning && !isBreak && (
          <div className="mt-6">
            <label className="text-sm text-gray-400 mb-2 block">Session Duration: {customDuration} minutes</label>
            <Slider value={[customDuration]} min={5} max={60} step={5} onValueChange={handleDurationChange} />
          </div>
        )}
      </CardContent>
      <CardFooter className="px-6 pb-6 pt-0 flex justify-between">
        <Button variant="outline" onClick={handleReset} disabled={isRunning && timeLeft > 0}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>

        <Button onClick={handleStartPause}>
          {isRunning ? (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              {timeLeft < customDuration * 60 ? "Resume" : "Start"}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
