"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { getCompletedModules } from "@/lib/storage"
import { Lock, CheckCircle } from "lucide-react"

interface Skill {
  id: string
  name: string
  description: string
  level: number
  xpRequired: number
  unlocks: string[]
  icon: string
  position: [number, number]
  subject: string
}

export function SkillTree({ subjectId }: { subjectId: string }) {
  const [skills, setSkills] = useState<Skill[]>([])
  const [unlockedSkills, setUnlockedSkills] = useState<string[]>([])
  const [completedModules, setCompletedModules] = useState<string[]>([])
  const [userXp, setUserXp] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Get completed modules
    const completed = getCompletedModules()
    setCompletedModules(completed)

    // Calculate XP based on completed modules
    const completedForSubject = completed.filter((id) => id.startsWith(subjectId))
    const xp = completedForSubject.length * 100
    setUserXp(xp)

    // Generate skills based on subject
    generateSkills(subjectId)
  }, [subjectId])

  useEffect(() => {
    if (mounted) {
      // Determine which skills are unlocked based on XP
      const unlocked = skills.filter((skill) => skill.xpRequired <= userXp).map((skill) => skill.id)
      setUnlockedSkills(unlocked)
    }
  }, [skills, userXp, mounted])

  const generateSkills = (subject: string) => {
    // Generate different skills based on subject
    const subjectSkills: Record<string, Skill[]> = {
      english: [
        {
          id: "english-basics",
          name: "Language Fundamentals",
          description: "Master the basics of English language",
          level: 1,
          xpRequired: 0,
          unlocks: ["english-grammar", "english-vocabulary"],
          icon: "📝",
          position: [50, 20],
          subject: "english",
        },
        {
          id: "english-grammar",
          name: "Grammar Mastery",
          description: "Understand complex grammar rules and structures",
          level: 2,
          xpRequired: 300,
          unlocks: ["english-writing"],
          icon: "📚",
          position: [30, 40],
          subject: "english",
        },
        {
          id: "english-vocabulary",
          name: "Vocabulary Builder",
          description: "Expand your word knowledge and usage",
          level: 2,
          xpRequired: 300,
          unlocks: ["english-writing"],
          icon: "🔤",
          position: [70, 40],
          subject: "english",
        },
        {
          id: "english-writing",
          name: "Writing Excellence",
          description: "Develop advanced writing skills for various contexts",
          level: 3,
          xpRequired: 700,
          unlocks: ["english-master"],
          icon: "✍️",
          position: [50, 60],
          subject: "english",
        },
        {
          id: "english-master",
          name: "English Mastery",
          description: "Achieve complete mastery of English language skills",
          level: 4,
          xpRequired: 1200,
          unlocks: [],
          icon: "🏆",
          position: [50, 80],
          subject: "english",
        },
      ],
      maths: [
        {
          id: "maths-basics",
          name: "Number Mastery",
          description: "Master the fundamentals of numbers and operations",
          level: 1,
          xpRequired: 0,
          unlocks: ["maths-algebra", "maths-geometry"],
          icon: "➗",
          position: [50, 20],
          subject: "maths",
        },
        {
          id: "maths-algebra",
          name: "Algebraic Thinking",
          description: "Understand variables, expressions, and equations",
          level: 2,
          xpRequired: 300,
          unlocks: ["maths-advanced"],
          icon: "📊",
          position: [30, 40],
          subject: "maths",
        },
        {
          id: "maths-geometry",
          name: "Spatial Reasoning",
          description: "Explore shapes, measurements, and spatial relationships",
          level: 2,
          xpRequired: 300,
          unlocks: ["maths-advanced"],
          icon: "📐",
          position: [70, 40],
          subject: "maths",
        },
        {
          id: "maths-advanced",
          name: "Advanced Mathematics",
          description: "Tackle complex mathematical concepts and problems",
          level: 3,
          xpRequired: 700,
          unlocks: ["maths-master"],
          icon: "🧮",
          position: [50, 60],
          subject: "maths",
        },
        {
          id: "maths-master",
          name: "Mathematics Mastery",
          description: "Achieve complete mastery of mathematical concepts",
          level: 4,
          xpRequired: 1200,
          unlocks: [],
          icon: "🏆",
          position: [50, 80],
          subject: "maths",
        },
      ],
      science: [
        {
          id: "science-basics",
          name: "Scientific Foundations",
          description: "Learn the basic principles of scientific inquiry",
          level: 1,
          xpRequired: 0,
          unlocks: ["science-physics", "science-biology"],
          icon: "🔬",
          position: [50, 20],
          subject: "science",
        },
        {
          id: "science-physics",
          name: "Physical Sciences",
          description: "Explore the laws of physics and chemistry",
          level: 2,
          xpRequired: 300,
          unlocks: ["science-advanced"],
          icon: "⚛️",
          position: [30, 40],
          subject: "science",
        },
        {
          id: "science-biology",
          name: "Life Sciences",
          description: "Discover the wonders of biology and living organisms",
          level: 2,
          xpRequired: 300,
          unlocks: ["science-advanced"],
          icon: "🧬",
          position: [70, 40],
          subject: "science",
        },
        {
          id: "science-advanced",
          name: "Advanced Sciences",
          description: "Delve into complex scientific theories and applications",
          level: 3,
          xpRequired: 700,
          unlocks: ["science-master"],
          icon: "🚀",
          position: [50, 60],
          subject: "science",
        },
        {
          id: "science-master",
          name: "Scientific Mastery",
          description: "Become a master of scientific knowledge and research",
          level: 4,
          xpRequired: 1200,
          unlocks: [],
          icon: "🏆",
          position: [50, 80],
          subject: "science",
        },
      ],
      history: [
        {
          id: "history-basics",
          name: "Historical Foundations",
          description: "Understand the basics of historical study",
          level: 1,
          xpRequired: 0,
          unlocks: ["history-ancient", "history-modern"],
          icon: "📜",
          position: [50, 20],
          subject: "history",
        },
        {
          id: "history-ancient",
          name: "Ancient Civilizations",
          description: "Explore the ancient world and early civilizations",
          level: 2,
          xpRequired: 300,
          unlocks: ["history-advanced"],
          icon: "🏛️",
          position: [30, 40],
          subject: "history",
        },
        {
          id: "history-modern",
          name: "Modern History",
          description: "Study recent history and contemporary events",
          level: 2,
          xpRequired: 300,
          unlocks: ["history-advanced"],
          icon: "🌍",
          position: [70, 40],
          subject: "history",
        },
        {
          id: "history-advanced",
          name: "Historical Analysis",
          description: "Develop advanced historical analysis skills",
          level: 3,
          xpRequired: 700,
          unlocks: ["history-master"],
          icon: "🔍",
          position: [50, 60],
          subject: "history",
        },
        {
          id: "history-master",
          name: "History Mastery",
          description: "Become a master historian with deep understanding",
          level: 4,
          xpRequired: 1200,
          unlocks: [],
          icon: "🏆",
          position: [50, 80],
          subject: "history",
        },
      ],
      arts: [
        {
          id: "arts-basics",
          name: "Creative Foundations",
          description: "Learn the fundamentals of artistic expression and communication",
          level: 1,
          xpRequired: 0,
          unlocks: ["arts-visual", "arts-communication"],
          icon: "🎨",
          position: [50, 20],
          subject: "arts",
        },
        {
          id: "arts-visual",
          name: "Visual Arts",
          description: "Develop skills in drawing, design, and visual media",
          level: 2,
          xpRequired: 300,
          unlocks: ["arts-advanced"],
          icon: "🖌️",
          position: [30, 40],
          subject: "arts",
        },
        {
          id: "arts-communication",
          name: "Communication Skills",
          description: "Master effective communication techniques",
          level: 2,
          xpRequired: 300,
          unlocks: ["arts-advanced"],
          icon: "🗣️",
          position: [70, 40],
          subject: "arts",
        },
        {
          id: "arts-advanced",
          name: "Advanced Expression",
          description: "Refine your artistic and communication abilities",
          level: 3,
          xpRequired: 700,
          unlocks: ["arts-master"],
          icon: "🎭",
          position: [50, 60],
          subject: "arts",
        },
        {
          id: "arts-master",
          name: "Arts & Communication Mastery",
          description: "Achieve mastery in creative expression and communication",
          level: 4,
          xpRequired: 1200,
          unlocks: [],
          icon: "🏆",
          position: [50, 80],
          subject: "arts",
        },
      ],
      hindi: [
        {
          id: "hindi-basics",
          name: "Hindi Foundations",
          description: "Learn the basics of Hindi language",
          level: 1,
          xpRequired: 0,
          unlocks: ["hindi-grammar", "hindi-vocabulary"],
          icon: "📝",
          position: [50, 20],
          subject: "hindi",
        },
        {
          id: "hindi-grammar",
          name: "Grammar Mastery",
          description: "Understand Hindi grammar rules and structures",
          level: 2,
          xpRequired: 300,
          unlocks: ["hindi-literature"],
          icon: "📚",
          position: [30, 40],
          subject: "hindi",
        },
        {
          id: "hindi-vocabulary",
          name: "Vocabulary Builder",
          description: "Expand your Hindi word knowledge",
          level: 2,
          xpRequired: 300,
          unlocks: ["hindi-literature"],
          icon: "🔤",
          position: [70, 40],
          subject: "hindi",
        },
        {
          id: "hindi-literature",
          name: "Hindi Literature",
          description: "Explore classic and contemporary Hindi literature",
          level: 3,
          xpRequired: 700,
          unlocks: ["hindi-master"],
          icon: "📖",
          position: [50, 60],
          subject: "hindi",
        },
        {
          id: "hindi-master",
          name: "Hindi Mastery",
          description: "Achieve complete mastery of Hindi language and literature",
          level: 4,
          xpRequired: 1200,
          unlocks: [],
          icon: "🏆",
          position: [50, 80],
          subject: "hindi",
        },
      ],
      technology: [
        {
          id: "technology-basics",
          name: "Tech Foundations",
          description: "Learn the basics of technology and coding",
          level: 1,
          xpRequired: 0,
          unlocks: ["technology-programming", "technology-digital"],
          icon: "💻",
          position: [50, 20],
          subject: "technology",
        },
        {
          id: "technology-programming",
          name: "Programming Skills",
          description: "Develop fundamental programming abilities",
          level: 2,
          xpRequired: 300,
          unlocks: ["technology-advanced"],
          icon: "👨‍💻",
          position: [30, 40],
          subject: "technology",
        },
        {
          id: "technology-digital",
          name: "Digital Literacy",
          description: "Master digital tools and online resources",
          level: 2,
          xpRequired: 300,
          unlocks: ["technology-advanced"],
          icon: "🌐",
          position: [70, 40],
          subject: "technology",
        },
        {
          id: "technology-advanced",
          name: "Advanced Technology",
          description: "Explore cutting-edge technologies and applications",
          level: 3,
          xpRequired: 700,
          unlocks: ["technology-master"],
          icon: "🤖",
          position: [50, 60],
          subject: "technology",
        },
        {
          id: "technology-master",
          name: "Technology Mastery",
          description: "Become a master of technology and coding",
          level: 4,
          xpRequired: 1200,
          unlocks: [],
          icon: "🏆",
          position: [50, 80],
          subject: "technology",
        },
      ],
      reasoning: [
        {
          id: "reasoning-basics",
          name: "Critical Thinking Basics",
          description: "Learn the fundamentals of logical reasoning",
          level: 1,
          xpRequired: 0,
          unlocks: ["reasoning-logical", "reasoning-ethical"],
          icon: "🧠",
          position: [50, 20],
          subject: "reasoning",
        },
        {
          id: "reasoning-logical",
          name: "Logical Analysis",
          description: "Develop skills in analyzing complex situations",
          level: 2,
          xpRequired: 300,
          unlocks: ["reasoning-advanced"],
          icon: "🔍",
          position: [30, 40],
          subject: "reasoning",
        },
        {
          id: "reasoning-ethical",
          name: "Ethical Reasoning",
          description: "Understand ethical considerations in decision-making",
          level: 2,
          xpRequired: 300,
          unlocks: ["reasoning-advanced"],
          icon: "⚖️",
          position: [70, 40],
          subject: "reasoning",
        },
        {
          id: "reasoning-advanced",
          name: "Advanced Problem-Solving",
          description: "Master complex problem-solving techniques",
          level: 3,
          xpRequired: 700,
          unlocks: ["reasoning-master"],
          icon: "🧩",
          position: [50, 60],
          subject: "reasoning",
        },
        {
          id: "reasoning-master",
          name: "Reasoning Mastery",
          description: "Achieve mastery in critical thinking and decision-making",
          level: 4,
          xpRequired: 1200,
          unlocks: [],
          icon: "🏆",
          position: [50, 80],
          subject: "reasoning",
        },
      ],
    }

    setSkills(subjectSkills[subject] || [])
  }

  if (!mounted || skills.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Skill Tree</CardTitle>
          <Badge variant="outline">XP: {userXp}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative h-[500px] border border-gray-800 rounded-lg bg-gray-900/50 overflow-hidden">
          {/* Skill connections */}
          <svg className="absolute inset-0 w-full h-full">
            {skills.map((skill) =>
              skill.unlocks.map((unlockId) => {
                const targetSkill = skills.find((s) => s.id === unlockId)
                if (!targetSkill) return null

                const isUnlocked = unlockedSkills.includes(skill.id) && unlockedSkills.includes(unlockId)

                return (
                  <line
                    key={`${skill.id}-${unlockId}`}
                    x1={`${skill.position[0]}%`}
                    y1={`${skill.position[1]}%`}
                    x2={`${targetSkill.position[0]}%`}
                    y2={`${targetSkill.position[1]}%`}
                    stroke={isUnlocked ? "#9333ea" : "#333"}
                    strokeWidth="2"
                    strokeDasharray={isUnlocked ? "none" : "5,5"}
                  />
                )
              }),
            )}
          </svg>

          {/* Skill nodes */}
          {skills.map((skill) => {
            const isUnlocked = unlockedSkills.includes(skill.id)

            return (
              <motion.div
                key={skill.id}
                className={`absolute w-16 h-16 transform -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center cursor-pointer
                  ${isUnlocked ? "bg-gradient-to-br from-purple-600 to-cyan-600" : "bg-gray-800 opacity-70"}`}
                style={{
                  left: `${skill.position[0]}%`,
                  top: `${skill.position[1]}%`,
                }}
                whileHover={{ scale: 1.1 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <div className="text-2xl">{skill.icon}</div>

                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                    <Lock className="h-6 w-6 text-gray-400" />
                  </div>
                )}

                {/* Skill tooltip */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 p-2 bg-gray-800 rounded-md shadow-lg opacity-0 hover:opacity-100 transition-opacity z-10 pointer-events-none">
                  <div className="font-bold">{skill.name}</div>
                  <div className="text-xs text-gray-400">{skill.description}</div>
                  <div className="text-xs mt-1">
                    <span className="text-purple-400">Level {skill.level}</span>
                    {!isUnlocked && <span className="text-gray-400"> • {skill.xpRequired} XP required</span>}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Unlocked Skills</h3>
          <div className="space-y-2">
            {skills
              .filter((skill) => unlockedSkills.includes(skill.id))
              .map((skill) => (
                <div key={skill.id} className="flex items-center p-2 bg-gray-800/50 rounded-md">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center mr-3">
                    <span>{skill.icon}</span>
                  </div>
                  <div>
                    <div className="font-medium">{skill.name}</div>
                    <div className="text-xs text-gray-400">{skill.description}</div>
                  </div>
                  <CheckCircle className="ml-auto h-5 w-5 text-green-500" />
                </div>
              ))}
          </div>

          {unlockedSkills.length === 0 && (
            <div className="text-center p-4 text-gray-400">Complete modules to unlock skills!</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
