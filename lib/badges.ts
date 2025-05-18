export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  requirement: {
    type: "modules_completed" | "quiz_score" | "streak" | "skill_unlocked" | "special"
    value: number | string
    subjectId?: string
  }
}

export const badges: Badge[] = [
  // English Badges
  {
    id: "english_beginner",
    name: "English Novice",
    description: "Completed your first English module",
    icon: "📝",
    color: "#3b82f6",
    requirement: { type: "modules_completed", value: 1, subjectId: "english" },
  },
  {
    id: "english_explorer",
    name: "Word Explorer",
    description: "Completed 10 English modules",
    icon: "🔤",
    color: "#3b82f6",
    requirement: { type: "modules_completed", value: 10, subjectId: "english" },
  },
  {
    id: "english_scholar",
    name: "Grammar Scholar",
    description: "Completed 25 English modules",
    icon: "📚",
    color: "#3b82f6",
    requirement: { type: "modules_completed", value: 25, subjectId: "english" },
  },
  {
    id: "english_master",
    name: "Language Master",
    description: "Completed 50 English modules",
    icon: "✍️",
    color: "#3b82f6",
    requirement: { type: "modules_completed", value: 50, subjectId: "english" },
  },
  {
    id: "english_virtuoso",
    name: "Literary Virtuoso",
    description: "Completed 75 English modules",
    icon: "📖",
    color: "#3b82f6",
    requirement: { type: "modules_completed", value: 75, subjectId: "english" },
  },
  {
    id: "english_champion",
    name: "English Champion",
    description: "Completed all English modules",
    icon: "🏆",
    color: "#3b82f6",
    requirement: { type: "modules_completed", value: 100, subjectId: "english" },
  },
  {
    id: "english_perfect",
    name: "Perfect Linguist",
    description: "Scored 100% on 5 English quizzes",
    icon: "🎯",
    color: "#3b82f6",
    requirement: { type: "quiz_score", value: 5, subjectId: "english" },
  },
  {
    id: "english_streak",
    name: "English Enthusiast",
    description: "Completed English modules 5 days in a row",
    icon: "🔥",
    color: "#3b82f6",
    requirement: { type: "streak", value: 5, subjectId: "english" },
  },
  {
    id: "english_skill",
    name: "Language Adept",
    description: "Unlocked all English skills in the skill tree",
    icon: "🌟",
    color: "#3b82f6",
    requirement: { type: "skill_unlocked", value: "english_master", subjectId: "english" },
  },
  {
    id: "english_special",
    name: "Wordsmith",
    description: "Special achievement in English studies",
    icon: "🏅",
    color: "#3b82f6",
    requirement: { type: "special", value: "english_special" },
  },

  // Mathematics Badges
  {
    id: "maths_beginner",
    name: "Math Novice",
    description: "Completed your first Mathematics module",
    icon: "🔢",
    color: "#f59e0b",
    requirement: { type: "modules_completed", value: 1, subjectId: "maths" },
  },
  {
    id: "maths_explorer",
    name: "Number Explorer",
    description: "Completed 10 Mathematics modules",
    icon: "➕",
    color: "#f59e0b",
    requirement: { type: "modules_completed", value: 10, subjectId: "maths" },
  },
  {
    id: "maths_scholar",
    name: "Algebra Scholar",
    description: "Completed 25 Mathematics modules",
    icon: "➗",
    color: "#f59e0b",
    requirement: { type: "modules_completed", value: 25, subjectId: "maths" },
  },
  {
    id: "maths_master",
    name: "Geometry Master",
    description: "Completed 50 Mathematics modules",
    icon: "📐",
    color: "#f59e0b",
    requirement: { type: "modules_completed", value: 50, subjectId: "maths" },
  },
  {
    id: "maths_virtuoso",
    name: "Calculus Virtuoso",
    description: "Completed 75 Mathematics modules",
    icon: "📊",
    color: "#f59e0b",
    requirement: { type: "modules_completed", value: 75, subjectId: "maths" },
  },
  {
    id: "maths_champion",
    name: "Mathematics Champion",
    description: "Completed all Mathematics modules",
    icon: "🏆",
    color: "#f59e0b",
    requirement: { type: "modules_completed", value: 100, subjectId: "maths" },
  },
  {
    id: "maths_perfect",
    name: "Perfect Mathematician",
    description: "Scored 100% on 5 Mathematics quizzes",
    icon: "🎯",
    color: "#f59e0b",
    requirement: { type: "quiz_score", value: 5, subjectId: "maths" },
  },
  {
    id: "maths_streak",
    name: "Math Enthusiast",
    description: "Completed Mathematics modules 5 days in a row",
    icon: "🔥",
    color: "#f59e0b",
    requirement: { type: "streak", value: 5, subjectId: "maths" },
  },
  {
    id: "maths_skill",
    name: "Math Adept",
    description: "Unlocked all Mathematics skills in the skill tree",
    icon: "🌟",
    color: "#f59e0b",
    requirement: { type: "skill_unlocked", value: "maths_master", subjectId: "maths" },
  },
  {
    id: "maths_special",
    name: "Math Wizard",
    description: "Special achievement in Mathematics studies",
    icon: "🏅",
    color: "#f59e0b",
    requirement: { type: "special", value: "maths_special" },
  },

  // Science Badges
  {
    id: "science_beginner",
    name: "Science Novice",
    description: "Completed your first Science module",
    icon: "🔬",
    color: "#10b981",
    requirement: { type: "modules_completed", value: 1, subjectId: "science" },
  },
  {
    id: "science_explorer",
    name: "Nature Explorer",
    description: "Completed 10 Science modules",
    icon: "🧪",
    color: "#10b981",
    requirement: { type: "modules_completed", value: 10, subjectId: "science" },
  },
  {
    id: "science_scholar",
    name: "Biology Scholar",
    description: "Completed 25 Science modules",
    icon: "🧬",
    color: "#10b981",
    requirement: { type: "modules_completed", value: 25, subjectId: "science" },
  },
  {
    id: "science_master",
    name: "Chemistry Master",
    description: "Completed 50 Science modules",
    icon: "⚗️",
    color: "#10b981",
    requirement: { type: "modules_completed", value: 50, subjectId: "science" },
  },
  {
    id: "science_virtuoso",
    name: "Physics Virtuoso",
    description: "Completed 75 Science modules",
    icon: "⚛️",
    color: "#10b981",
    requirement: { type: "modules_completed", value: 75, subjectId: "science" },
  },
  {
    id: "science_champion",
    name: "Science Champion",
    description: "Completed all Science modules",
    icon: "🏆",
    color: "#10b981",
    requirement: { type: "modules_completed", value: 100, subjectId: "science" },
  },
  {
    id: "science_perfect",
    name: "Perfect Scientist",
    description: "Scored 100% on 5 Science quizzes",
    icon: "🎯",
    color: "#10b981",
    requirement: { type: "quiz_score", value: 5, subjectId: "science" },
  },
  {
    id: "science_streak",
    name: "Science Enthusiast",
    description: "Completed Science modules 5 days in a row",
    icon: "🔥",
    color: "#10b981",
    requirement: { type: "streak", value: 5, subjectId: "science" },
  },
  {
    id: "science_skill",
    name: "Science Adept",
    description: "Unlocked all Science skills in the skill tree",
    icon: "🌟",
    color: "#10b981",
    requirement: { type: "skill_unlocked", value: "science_master", subjectId: "science" },
  },
  {
    id: "science_special",
    name: "Scientific Genius",
    description: "Special achievement in Science studies",
    icon: "🏅",
    color: "#10b981",
    requirement: { type: "special", value: "science_special" },
  },

  // History Badges
  {
    id: "history_beginner",
    name: "History Novice",
    description: "Completed your first History module",
    icon: "📜",
    color: "#ef4444",
    requirement: { type: "modules_completed", value: 1, subjectId: "history" },
  },
  {
    id: "history_explorer",
    name: "Time Explorer",
    description: "Completed 10 History modules",
    icon: "⏳",
    color: "#ef4444",
    requirement: { type: "modules_completed", value: 10, subjectId: "history" },
  },
  {
    id: "history_scholar",
    name: "Ancient Scholar",
    description: "Completed 25 History modules",
    icon: "🏛️",
    color: "#ef4444",
    requirement: { type: "modules_completed", value: 25, subjectId: "history" },
  },
  {
    id: "history_master",
    name: "Medieval Master",
    description: "Completed 50 History modules",
    icon: "🏰",
    color: "#ef4444",
    requirement: { type: "modules_completed", value: 50, subjectId: "history" },
  },
  {
    id: "history_virtuoso",
    name: "Modern Virtuoso",
    description: "Completed 75 History modules",
    icon: "🌍",
    color: "#ef4444",
    requirement: { type: "modules_completed", value: 75, subjectId: "history" },
  },
  {
    id: "history_champion",
    name: "History Champion",
    description: "Completed all History modules",
    icon: "🏆",
    color: "#ef4444",
    requirement: { type: "modules_completed", value: 100, subjectId: "history" },
  },
  {
    id: "history_perfect",
    name: "Perfect Historian",
    description: "Scored 100% on 5 History quizzes",
    icon: "🎯",
    color: "#ef4444",
    requirement: { type: "quiz_score", value: 5, subjectId: "history" },
  },
  {
    id: "history_streak",
    name: "History Enthusiast",
    description: "Completed History modules 5 days in a row",
    icon: "🔥",
    color: "#ef4444",
    requirement: { type: "streak", value: 5, subjectId: "history" },
  },
  {
    id: "history_skill",
    name: "History Adept",
    description: "Unlocked all History skills in the skill tree",
    icon: "🌟",
    color: "#ef4444",
    requirement: { type: "skill_unlocked", value: "history_master", subjectId: "history" },
  },
  {
    id: "history_special",
    name: "Time Traveler",
    description: "Special achievement in History studies",
    icon: "🏅",
    color: "#ef4444",
    requirement: { type: "special", value: "history_special" },
  },

  // Arts & Communication Badges
  {
    id: "arts_beginner",
    name: "Arts Novice",
    description: "Completed your first Arts & Communication module",
    icon: "🎨",
    color: "#ec4899",
    requirement: { type: "modules_completed", value: 1, subjectId: "arts" },
  },
  {
    id: "arts_explorer",
    name: "Creative Explorer",
    description: "Completed 10 Arts & Communication modules",
    icon: "🖌️",
    color: "#ec4899",
    requirement: { type: "modules_completed", value: 10, subjectId: "arts" },
  },
  {
    id: "arts_scholar",
    name: "Visual Scholar",
    description: "Completed 25 Arts & Communication modules",
    icon: "🎭",
    color: "#ec4899",
    requirement: { type: "modules_completed", value: 25, subjectId: "arts" },
  },
  {
    id: "arts_master",
    name: "Communication Master",
    description: "Completed 50 Arts & Communication modules",
    icon: "🗣️",
    color: "#ec4899",
    requirement: { type: "modules_completed", value: 50, subjectId: "arts" },
  },
  {
    id: "arts_virtuoso",
    name: "Performance Virtuoso",
    description: "Completed 75 Arts & Communication modules",
    icon: "🎬",
    color: "#ec4899",
    requirement: { type: "modules_completed", value: 75, subjectId: "arts" },
  },
  {
    id: "arts_champion",
    name: "Arts Champion",
    description: "Completed all Arts & Communication modules",
    icon: "🏆",
    color: "#ec4899",
    requirement: { type: "modules_completed", value: 100, subjectId: "arts" },
  },
  {
    id: "arts_perfect",
    name: "Perfect Artist",
    description: "Scored 100% on 5 Arts & Communication quizzes",
    icon: "🎯",
    color: "#ec4899",
    requirement: { type: "quiz_score", value: 5, subjectId: "arts" },
  },
  {
    id: "arts_streak",
    name: "Arts Enthusiast",
    description: "Completed Arts & Communication modules 5 days in a row",
    icon: "🔥",
    color: "#ec4899",
    requirement: { type: "streak", value: 5, subjectId: "arts" },
  },
  {
    id: "arts_skill",
    name: "Arts Adept",
    description: "Unlocked all Arts & Communication skills in the skill tree",
    icon: "🌟",
    color: "#ec4899",
    requirement: { type: "skill_unlocked", value: "arts_master", subjectId: "arts" },
  },
  {
    id: "arts_special",
    name: "Creative Genius",
    description: "Special achievement in Arts & Communication studies",
    icon: "🏅",
    color: "#ec4899",
    requirement: { type: "special", value: "arts_special" },
  },

  // Hindi Badges
  {
    id: "hindi_beginner",
    name: "Hindi Novice",
    description: "Completed your first Hindi module",
    icon: "📝",
    color: "#8b5cf6",
    requirement: { type: "modules_completed", value: 1, subjectId: "hindi" },
  },
  {
    id: "hindi_explorer",
    name: "Hindi Explorer",
    description: "Completed 10 Hindi modules",
    icon: "🔤",
    color: "#8b5cf6",
    requirement: { type: "modules_completed", value: 10, subjectId: "hindi" },
  },
  {
    id: "hindi_scholar",
    name: "Grammar Scholar",
    description: "Completed 25 Hindi modules",
    icon: "📚",
    color: "#8b5cf6",
    requirement: { type: "modules_completed", value: 25, subjectId: "hindi" },
  },
  {
    id: "hindi_master",
    name: "Literature Master",
    description: "Completed 50 Hindi modules",
    icon: "📖",
    color: "#8b5cf6",
    requirement: { type: "modules_completed", value: 50, subjectId: "hindi" },
  },
  {
    id: "hindi_virtuoso",
    name: "Poetry Virtuoso",
    description: "Completed 75 Hindi modules",
    icon: "✍️",
    color: "#8b5cf6",
    requirement: { type: "modules_completed", value: 75, subjectId: "hindi" },
  },
  {
    id: "hindi_champion",
    name: "Hindi Champion",
    description: "Completed all Hindi modules",
    icon: "🏆",
    color: "#8b5cf6",
    requirement: { type: "modules_completed", value: 100, subjectId: "hindi" },
  },
  {
    id: "hindi_perfect",
    name: "Perfect Hindi Scholar",
    description: "Scored 100% on 5 Hindi quizzes",
    icon: "🎯",
    color: "#8b5cf6",
    requirement: { type: "quiz_score", value: 5, subjectId: "hindi" },
  },
  {
    id: "hindi_streak",
    name: "Hindi Enthusiast",
    description: "Completed Hindi modules 5 days in a row",
    icon: "🔥",
    color: "#8b5cf6",
    requirement: { type: "streak", value: 5, subjectId: "hindi" },
  },
  {
    id: "hindi_skill",
    name: "Hindi Adept",
    description: "Unlocked all Hindi skills in the skill tree",
    icon: "🌟",
    color: "#8b5cf6",
    requirement: { type: "skill_unlocked", value: "hindi_master", subjectId: "hindi" },
  },
  {
    id: "hindi_special",
    name: "Hindi Wordsmith",
    description: "Special achievement in Hindi studies",
    icon: "🏅",
    color: "#8b5cf6",
    requirement: { type: "special", value: "hindi_special" },
  },

  // Technology Badges
  {
    id: "technology_beginner",
    name: "Tech Novice",
    description: "Completed your first Technology module",
    icon: "💻",
    color: "#6366f1",
    requirement: { type: "modules_completed", value: 1, subjectId: "technology" },
  },
  {
    id: "technology_explorer",
    name: "Digital Explorer",
    description: "Completed 10 Technology modules",
    icon: "🖥️",
    color: "#6366f1",
    requirement: { type: "modules_completed", value: 10, subjectId: "technology" },
  },
  {
    id: "technology_scholar",
    name: "Coding Scholar",
    description: "Completed 25 Technology modules",
    icon: "👨‍💻",
    color: "#6366f1",
    requirement: { type: "modules_completed", value: 25, subjectId: "technology" },
  },
  {
    id: "technology_master",
    name: "Programming Master",
    description: "Completed 50 Technology modules",
    icon: "🤖",
    color: "#6366f1",
    requirement: { type: "modules_completed", value: 50, subjectId: "technology" },
  },
  {
    id: "technology_virtuoso",
    name: "AI Virtuoso",
    description: "Completed 75 Technology modules",
    icon: "🧠",
    color: "#6366f1",
    requirement: { type: "modules_completed", value: 75, subjectId: "technology" },
  },
  {
    id: "technology_champion",
    name: "Technology Champion",
    description: "Completed all Technology modules",
    icon: "🏆",
    color: "#6366f1",
    requirement: { type: "modules_completed", value: 100, subjectId: "technology" },
  },
  {
    id: "technology_perfect",
    name: "Perfect Programmer",
    description: "Scored 100% on 5 Technology quizzes",
    icon: "🎯",
    color: "#6366f1",
    requirement: { type: "quiz_score", value: 5, subjectId: "technology" },
  },
  {
    id: "technology_streak",
    name: "Tech Enthusiast",
    description: "Completed Technology modules 5 days in a row",
    icon: "🔥",
    color: "#6366f1",
    requirement: { type: "streak", value: 5, subjectId: "technology" },
  },
  {
    id: "technology_skill",
    name: "Tech Adept",
    description: "Unlocked all Technology skills in the skill tree",
    icon: "🌟",
    color: "#6366f1",
    requirement: { type: "skill_unlocked", value: "technology_master", subjectId: "technology" },
  },
  {
    id: "technology_special",
    name: "Tech Genius",
    description: "Special achievement in Technology studies",
    icon: "🏅",
    color: "#6366f1",
    requirement: { type: "special", value: "technology_special" },
  },

  // Reasoning Badges
  {
    id: "reasoning_beginner",
    name: "Reasoning Novice",
    description: "Completed your first Reasoning module",
    icon: "🧠",
    color: "#0ea5e9",
    requirement: { type: "modules_completed", value: 1, subjectId: "reasoning" },
  },
  {
    id: "reasoning_explorer",
    name: "Logic Explorer",
    description: "Completed 10 Reasoning modules",
    icon: "🔍",
    color: "#0ea5e9",
    requirement: { type: "modules_completed", value: 10, subjectId: "reasoning" },
  },
  {
    id: "reasoning_scholar",
    name: "Critical Scholar",
    description: "Completed 25 Reasoning modules",
    icon: "⚖️",
    color: "#0ea5e9",
    requirement: { type: "modules_completed", value: 25, subjectId: "reasoning" },
  },
  {
    id: "reasoning_master",
    name: "Decision Master",
    description: "Completed 50 Reasoning modules",
    icon: "🧩",
    color: "#0ea5e9",
    requirement: { type: "modules_completed", value: 50, subjectId: "reasoning" },
  },
  {
    id: "reasoning_virtuoso",
    name: "Problem-Solving Virtuoso",
    description: "Completed 75 Reasoning modules",
    icon: "💡",
    color: "#0ea5e9",
    requirement: { type: "modules_completed", value: 75, subjectId: "reasoning" },
  },
  {
    id: "reasoning_champion",
    name: "Reasoning Champion",
    description: "Completed all Reasoning modules",
    icon: "🏆",
    color: "#0ea5e9",
    requirement: { type: "modules_completed", value: 100, subjectId: "reasoning" },
  },
  {
    id: "reasoning_perfect",
    name: "Perfect Thinker",
    description: "Scored 100% on 5 Reasoning quizzes",
    icon: "🎯",
    color: "#0ea5e9",
    requirement: { type: "quiz_score", value: 5, subjectId: "reasoning" },
  },
  {
    id: "reasoning_streak",
    name: "Reasoning Enthusiast",
    description: "Completed Reasoning modules 5 days in a row",
    icon: "🔥",
    color: "#0ea5e9",
    requirement: { type: "streak", value: 5, subjectId: "reasoning" },
  },
  {
    id: "reasoning_skill",
    name: "Reasoning Adept",
    description: "Unlocked all Reasoning skills in the skill tree",
    icon: "🌟",
    color: "#0ea5e9",
    requirement: { type: "skill_unlocked", value: "reasoning_master", subjectId: "reasoning" },
  },
  {
    id: "reasoning_special",
    name: "Critical Genius",
    description: "Special achievement in Reasoning studies",
    icon: "🏅",
    color: "#0ea5e9",
    requirement: { type: "special", value: "reasoning_special" },
  },
]

// Helper functions for badges
export function getAllBadges(): Badge[] {
  return badges
}

export function getBadgesBySubject(subjectId: string): Badge[] {
  return badges.filter((badge) => badge.requirement.subjectId === subjectId)
}

export function getBadgeById(badgeId: string): Badge | undefined {
  return badges.find((badge) => badge.id === badgeId)
}

export function getEarnedBadges(
  completedModules: string[],
  perfectQuizzes: string[],
  streaks: Record<string, number>,
  unlockedSkills: string[],
): string[] {
  const earnedBadges: string[] = []

  badges.forEach((badge) => {
    if (badge.requirement.type === "modules_completed") {
      const subjectId = badge.requirement.subjectId
      const requiredCount = badge.requirement.value as number

      if (subjectId) {
        const completedInSubject = completedModules.filter((moduleId) => moduleId.startsWith(subjectId)).length
        if (completedInSubject >= requiredCount) {
          earnedBadges.push(badge.id)
        }
      }
    } else if (badge.requirement.type === "quiz_score") {
      const subjectId = badge.requirement.subjectId
      const requiredCount = badge.requirement.value as number

      if (subjectId) {
        const perfectInSubject = perfectQuizzes.filter((moduleId) => moduleId.startsWith(subjectId)).length
        if (perfectInSubject >= requiredCount) {
          earnedBadges.push(badge.id)
        }
      }
    } else if (badge.requirement.type === "streak") {
      const subjectId = badge.requirement.subjectId
      const requiredStreak = badge.requirement.value as number

      if (subjectId && streaks[subjectId] && streaks[subjectId] >= requiredStreak) {
        earnedBadges.push(badge.id)
      }
    } else if (badge.requirement.type === "skill_unlocked") {
      const skillId = badge.requirement.value as string

      if (unlockedSkills.includes(skillId)) {
        earnedBadges.push(badge.id)
      }
    }
  })

  return earnedBadges
}
