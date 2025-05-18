"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock, CheckCircle, ArrowRight, BookOpen } from "lucide-react"

interface ModuleCardProps {
  module: {
    id: string
    title: string
    description: string
    difficulty: "beginner" | "easy" | "medium" | "hard" | "expert"
    estimatedTime: string
    tags?: string[]
  }
  isCompleted: boolean
  isLocked: boolean
  onClick: () => void
}

export function ModuleCard({ module, isCompleted, isLocked, onClick }: ModuleCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const difficultyColor = {
    beginner: "bg-green-500",
    easy: "bg-green-500",
    medium: "bg-yellow-500",
    hard: "bg-orange-500",
    expert: "bg-red-500",
  }

  // Extract grade level from tags if available
  const gradeLevel = module.tags?.find((tag) => tag.includes("Grade")) || ""

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        scale: isLocked ? 1 : 1.05,
        transition: { duration: 0.2 },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={isLocked ? undefined : onClick}
      className={`${isLocked ? "cursor-not-allowed" : "cursor-pointer"}`}
    >
      <Card
        className={`h-full border-2 overflow-hidden relative ${
          isCompleted
            ? "border-green-500 bg-gradient-to-br from-green-900/20 to-black"
            : isLocked
              ? "border-gray-700 bg-gradient-to-br from-gray-900/20 to-black opacity-70"
              : "border-purple-500 bg-gradient-to-br from-purple-900/20 to-black"
        }`}
      >
        {isLocked && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="text-center p-4">
              <Lock className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-300">Complete previous module to unlock</p>
            </div>
          </div>
        )}

        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold">{module.title}</h3>
            {isCompleted && <CheckCircle className="h-6 w-6 text-green-500" />}
          </div>

          <p className="text-gray-300 mb-4">{module.description}</p>

          <div className="flex flex-wrap gap-2">
            <Badge className={difficultyColor[module.difficulty]}>
              {module.difficulty.charAt(0).toUpperCase() + module.difficulty.slice(1)}
            </Badge>
            <Badge variant="outline">{module.estimatedTime}</Badge>
            {gradeLevel && <Badge variant="secondary">{gradeLevel}</Badge>}
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            {isCompleted ? (
              <span className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-1 text-green-500" /> Completed
              </span>
            ) : isLocked ? (
              <span className="flex items-center">
                <Lock className="h-4 w-4 mr-1" /> Locked
              </span>
            ) : (
              <span className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1 text-purple-400" /> Ready to learn
              </span>
            )}
          </div>

          {!isLocked && (
            <motion.div animate={{ x: isHovered ? 5 : 0 }} transition={{ duration: 0.2 }}>
              <ArrowRight className="h-5 w-5 text-purple-400" />
            </motion.div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
