"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Award,
  Calculator,
  FlaskRoundIcon as Flask,
  Star,
  BookOpen,
  Languages,
  Lightbulb,
  Palette,
  Code,
  Lock,
  Info,
} from "lucide-react"
import { motion } from "framer-motion"
import { getBadgeById } from "@/lib/badges"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface BadgeDisplayProps {
  badgeId: string
  isEarned: boolean
  size?: "small" | "medium" | "large"
  showTooltip?: boolean
  showAnimation?: boolean
  onClick?: () => void
}

export function BadgeDisplay({
  badgeId,
  isEarned,
  size = "medium",
  showTooltip = true,
  showAnimation = false,
  onClick,
}: BadgeDisplayProps) {
  const badge = getBadgeById(badgeId)
  const [isHovered, setIsHovered] = useState(false)

  if (!badge) return null

  // Map emoji to Lucide icons
  const getIconComponent = (emoji: string) => {
    switch (emoji) {
      case "📝":
        return BookOpen
      case "🔤":
      case "📚":
        return Languages
      case "✍️":
      case "📖":
        return BookOpen
      case "🎯":
        return Award
      case "🔥":
        return Award
      case "🌟":
        return Star
      case "🏅":
      case "🏆":
        return Award
      case "🔢":
      case "➕":
      case "➗":
      case "📐":
      case "📊":
        return Calculator
      case "🔬":
      case "🧪":
      case "🧬":
      case "⚗️":
      case "⚛️":
        return Flask
      case "📜":
      case "⏳":
      case "🏛️":
      case "🏰":
      case "🌍":
        return BookOpen
      case "🎨":
      case "🖌️":
      case "🎭":
      case "🗣️":
      case "🎬":
        return Palette
      case "💻":
      case "🖥️":
      case "👨‍💻":
      case "🤖":
      case "🧠":
        return Code
      case "🔍":
      case "⚖️":
      case "🧩":
      case "💡":
        return Lightbulb
      default:
        return Star
    }
  }

  const IconComponent = getIconComponent(badge.icon)

  // Size classes
  const sizeClasses = {
    small: {
      card: "p-2",
      icon: "w-8 h-8 rounded-full mr-2",
      iconSize: "h-4 w-4",
      title: "text-sm font-medium",
      description: "text-xs",
    },
    medium: {
      card: "p-4",
      icon: "w-12 h-12 rounded-full mr-4",
      iconSize: "h-6 w-6",
      title: "font-bold",
      description: "text-sm",
    },
    large: {
      card: "p-6",
      icon: "w-16 h-16 rounded-full mr-6",
      iconSize: "h-8 w-8",
      title: "text-xl font-bold",
      description: "text-base",
    },
  }

  const classes = sizeClasses[size]

  const badgeContent = (
    <Card
      className={`overflow-hidden bg-gray-900 border-gray-800 transition-all duration-300 ${
        isEarned
          ? `border-2 border-[${badge.color}] hover:shadow-lg hover:shadow-[${badge.color}]/20`
          : "opacity-70 grayscale"
      } ${isHovered && isEarned ? "scale-105" : ""} ${onClick ? "cursor-pointer" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <CardContent className={classes.card}>
        <div className="flex items-center">
          <div
            className={`${classes.icon} flex items-center justify-center relative`}
            style={{ backgroundColor: isEarned ? badge.color : "#333" }}
          >
            {isEarned ? (
              <motion.div
                initial={showAnimation ? { scale: 0 } : { scale: 1 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.1,
                }}
              >
                <IconComponent className={`${classes.iconSize} text-white`} />
              </motion.div>
            ) : (
              <div className="relative">
                <IconComponent className={`${classes.iconSize} text-gray-500`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className={`${classes.iconSize} text-gray-400 opacity-70`} />
                </div>
              </div>
            )}

            {/* Pulsating effect for earned badges */}
            {isEarned && (
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    `0 0 0 0px rgba(${hexToRgb(badge.color)}, 0.3)`,
                    `0 0 0 4px rgba(${hexToRgb(badge.color)}, 0)`,
                  ],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 2,
                }}
              />
            )}
          </div>

          <div>
            <h3 className={classes.title}>{badge.name}</h3>
            <p className={`${classes.description} text-gray-400`}>{badge.description}</p>
          </div>
        </div>

        {isEarned ? (
          <div className="text-sm text-green-500 font-medium mt-2 flex items-center">
            <Award className="h-4 w-4 mr-1" />
            Badge Earned!
          </div>
        ) : (
          <div className="text-sm text-gray-500 mt-2 flex items-center">
            <Lock className="h-4 w-4 mr-1" />
            Not yet earned
          </div>
        )}
      </CardContent>
    </Card>
  )

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{badgeContent}</TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-2 p-2">
              <div className="font-bold">{badge.name}</div>
              <div className="text-sm">{badge.description}</div>
              {!isEarned && (
                <div className="text-xs text-gray-400 flex items-center mt-1">
                  <Info className="h-3 w-3 mr-1" />
                  {getRequirementText(badge.requirement)}
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return badgeContent
}

// Helper function to convert hex to rgb
function hexToRgb(hex: string) {
  // Remove the # if present
  hex = hex.replace("#", "")

  // Parse the hex values
  const r = Number.parseInt(hex.substring(0, 2), 16)
  const g = Number.parseInt(hex.substring(2, 4), 16)
  const b = Number.parseInt(hex.substring(4, 6), 16)

  return `${r}, ${g}, ${b}`
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
