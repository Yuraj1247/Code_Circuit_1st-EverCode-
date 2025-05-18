// LocalStorage utility functions

// Get completed modules from localStorage
export function getCompletedModules(): string[] {
  if (typeof window === "undefined") {
    return []
  }
  const completedModules = localStorage.getItem("completedModules")
  return completedModules ? JSON.parse(completedModules) : []
}

// Save a completed module to localStorage
export function saveCompletedModule(moduleId: string): void {
  if (typeof window === "undefined") {
    return
  }
  const completedModules = getCompletedModules()
  if (!completedModules.includes(moduleId)) {
    completedModules.push(moduleId)
    localStorage.setItem("completedModules", JSON.stringify(completedModules))

    // Update subject streak
    const subjectId = moduleId.split("-")[0]
    updateSubjectStreak(subjectId)

    // Save last activity date
    saveLastActivityDate(moduleId)
  }
}

// Get quiz scores from localStorage
export function getQuizScores(): Record<string, number> {
  if (typeof window === "undefined") {
    return {}
  }
  const quizScores = localStorage.getItem("quizScores")
  return quizScores ? JSON.parse(quizScores) : {}
}

// Save a quiz score to localStorage
export function saveQuizScore(moduleId: string, score: number): void {
  if (typeof window === "undefined") {
    return
  }
  const quizScores = getQuizScores()
  quizScores[moduleId] = score
  localStorage.setItem("quizScores", JSON.stringify(quizScores))

  // If perfect score, add to perfect quizzes
  if (score === 100) {
    const perfectQuizzes = getPerfectQuizzes()
    if (!perfectQuizzes.includes(moduleId)) {
      perfectQuizzes.push(moduleId)
      localStorage.setItem("perfectQuizzes", JSON.stringify(perfectQuizzes))
    }
  }
}

// Get quiz attempts from localStorage
export function getQuizAttempts(moduleId: string): any[] {
  if (typeof window === "undefined") {
    return []
  }
  const key = `quizAttempts_${moduleId}`
  const attempts = localStorage.getItem(key)
  return attempts ? JSON.parse(attempts) : []
}

// Save a quiz attempt to localStorage
export function saveQuizAttempt(attemptData: any): void {
  if (typeof window === "undefined") {
    return
  }
  const { moduleId } = attemptData
  const key = `quizAttempts_${moduleId}`
  const attempts = getQuizAttempts(moduleId)
  attempts.push(attemptData)
  localStorage.setItem(key, JSON.stringify(attempts))
}

// Get a specific quiz attempt
export function getQuizAttempt(moduleId: string, attemptNumber: number): any {
  if (typeof window === "undefined") {
    return null
  }
  const attempts = getQuizAttempts(moduleId)
  return attempts.find((a) => a.attemptNumber === Number(attemptNumber)) || null
}

// Get all quiz attempts across all modules
export function getAllQuizAttempts(): any[] {
  if (typeof window === "undefined") {
    return []
  }

  const allAttempts: any[] = []

  // Get all localStorage keys
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith("quizAttempts_")) {
      const moduleId = key.replace("quizAttempts_", "")
      const moduleAttempts = getQuizAttempts(moduleId)

      // Add module ID to each attempt
      moduleAttempts.forEach((attempt) => {
        allAttempts.push({
          ...attempt,
          moduleId,
        })
      })
    }
  }

  // Sort by date (most recent first)
  return allAttempts.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
}

// Get perfect quiz scores from localStorage
export function getPerfectQuizzes(): string[] {
  if (typeof window === "undefined") {
    return []
  }
  const perfectQuizzes = localStorage.getItem("perfectQuizzes")
  return perfectQuizzes ? JSON.parse(perfectQuizzes) : []
}

// Get user badges from localStorage
export function getUserBadges(): string[] {
  if (typeof window === "undefined") {
    return []
  }
  const badges = localStorage.getItem("badges")
  return badges ? JSON.parse(badges) : []
}

// Save a user badge to localStorage
export function saveUserBadge(badgeId: string): void {
  if (typeof window === "undefined") {
    return
  }
  const badges = getUserBadges()
  if (!badges.includes(badgeId)) {
    badges.push(badgeId)
    localStorage.setItem("badges", JSON.stringify(badges))
  }
}

// Get daily streak from localStorage
export function getDailyStreak(): string[] {
  if (typeof window === "undefined") {
    return []
  }
  const streak = localStorage.getItem("dailyStreak")
  return streak ? JSON.parse(streak) : []
}

// Update daily streak
export function updateDailyStreak(): void {
  if (typeof window === "undefined") {
    return
  }
  const streak = getDailyStreak()
  const today = new Date().toISOString().split("T")[0]

  if (!streak.includes(today)) {
    streak.push(today)
    localStorage.setItem("dailyStreak", JSON.stringify(streak))
  }
}

// Get current streak count (consecutive days)
export function getCurrentStreakCount(): number {
  if (typeof window === "undefined") {
    return 0
  }
  const streak = getDailyStreak()
  if (streak.length === 0) return 0

  let count = 1
  const sortedDates = [...streak].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
  const today = new Date().toISOString().split("T")[0]

  // Check if user visited today
  if (sortedDates[0] !== today) return 0

  for (let i = 0; i < sortedDates.length - 1; i++) {
    const current = new Date(sortedDates[i])
    const prev = new Date(sortedDates[i + 1])

    const diffTime = current.getTime() - prev.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      count++
    } else {
      break
    }
  }

  return count
}

// Get subject streaks
export function getSubjectStreaks(): Record<string, number> {
  if (typeof window === "undefined") {
    return {}
  }
  const subjectStreaks = localStorage.getItem("subjectStreaks")
  return subjectStreaks ? JSON.parse(subjectStreaks) : {}
}

// Update subject streak
export function updateSubjectStreak(subjectId: string): void {
  if (typeof window === "undefined") {
    return
  }
  const subjectStreaks = getSubjectStreaks()
  const today = new Date().toISOString().split("T")[0]

  // Get last activity date for this subject
  const subjectActivity = localStorage.getItem(`lastActivity_${subjectId}`)
  const lastDate = subjectActivity || ""

  // Calculate if this is a consecutive day
  if (lastDate) {
    const lastDateObj = new Date(lastDate)
    const todayObj = new Date(today)

    // Check if it's the next day
    lastDateObj.setDate(lastDateObj.getDate() + 1)
    const isNextDay = lastDateObj.toISOString().split("T")[0] === today

    if (isNextDay) {
      // Increment streak
      subjectStreaks[subjectId] = (subjectStreaks[subjectId] || 0) + 1
    } else if (lastDate !== today) {
      // Reset streak if it's not the same day and not consecutive
      subjectStreaks[subjectId] = 1
    }
  } else {
    // First activity for this subject
    subjectStreaks[subjectId] = 1
  }

  // Save updated streaks
  localStorage.setItem("subjectStreaks", JSON.stringify(subjectStreaks))

  // Update last activity date
  localStorage.setItem(`lastActivity_${subjectId}`, today)
}

// Get unlocked skills
export function getUnlockedSkills(): string[] {
  if (typeof window === "undefined") {
    return []
  }
  const unlockedSkills = localStorage.getItem("unlockedSkills")
  return unlockedSkills ? JSON.parse(unlockedSkills) : []
}

// Save unlocked skill
export function saveUnlockedSkill(skillId: string): void {
  if (typeof window === "undefined") {
    return
  }
  const unlockedSkills = getUnlockedSkills()
  if (!unlockedSkills.includes(skillId)) {
    unlockedSkills.push(skillId)
    localStorage.setItem("unlockedSkills", JSON.stringify(unlockedSkills))
  }
}

// Get last activity dates for modules
export function getLastActivityDates(): Record<string, string> {
  if (typeof window === "undefined") {
    return {}
  }
  const lastActivityDates = localStorage.getItem("lastActivityDates")
  return lastActivityDates ? JSON.parse(lastActivityDates) : {}
}

// Save last activity date for a module
export function saveLastActivityDate(moduleId: string): void {
  if (typeof window === "undefined") {
    return
  }
  const lastActivityDates = getLastActivityDates()
  lastActivityDates[moduleId] = new Date().toISOString()
  localStorage.setItem("lastActivityDates", JSON.stringify(lastActivityDates))

  // Also update daily streak
  updateDailyStreak()
}
