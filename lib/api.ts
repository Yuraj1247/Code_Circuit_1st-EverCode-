// API utility functions

// Mock leaderboard data
export function getMockLeaderboard() {
  if (typeof window === "undefined") {
    return [
      { name: "CosmicMaster42", modulesCompleted: 320, badges: 28, score: 18500, level: 37 },
      { name: "StarGazer", modulesCompleted: 280, badges: 24, score: 16200, level: 32 },
      { name: "GalaxyQuest", modulesCompleted: 240, badges: 20, score: 14000, level: 28 },
      { name: "AstroLearner", modulesCompleted: 200, badges: 18, score: 11900, level: 24 },
      { name: "Explorer", modulesCompleted: 0, badges: 0, score: 0, level: 1 },
      { name: "QuantumStudent", modulesCompleted: 160, badges: 15, score: 9500, level: 19 },
      { name: "NebulaNerd", modulesCompleted: 140, badges: 12, score: 8200, level: 16 },
      { name: "CosmicCadet", modulesCompleted: 100, badges: 8, score: 5800, level: 12 },
      { name: "MoonWalker", modulesCompleted: 80, badges: 6, score: 4600, level: 9 },
      { name: "SpaceRookie", modulesCompleted: 40, badges: 3, score: 2300, level: 5 },
    ]
  }

  const storedUsername = localStorage.getItem("userName") || "Explorer"
  const completedModules = JSON.parse(localStorage.getItem("completedModules") || "[]")
  const userBadges = JSON.parse(localStorage.getItem("badges") || "[]")
  const perfectQuizzes = JSON.parse(localStorage.getItem("perfectQuizzes") || "[]")
  const streakCount = getCurrentStreakCount()

  // Calculate user score based on completed modules, badges, perfect quizzes, and streak
  const userScore =
    completedModules.length * 100 + userBadges.length * 50 + perfectQuizzes.length * 25 + streakCount * 10

  const userLevel = Math.floor(userScore / 500) + 1

  // Create mock leaderboard with user included
  const mockUsers = [
    { name: "CosmicMaster42", modulesCompleted: 320, badges: 28, score: 18500, level: 37 },
    { name: "StarGazer", modulesCompleted: 280, badges: 24, score: 16200, level: 32 },
    { name: "GalaxyQuest", modulesCompleted: 240, badges: 20, score: 14000, level: 28 },
    { name: "AstroLearner", modulesCompleted: 200, badges: 18, score: 11900, level: 24 },
    {
      name: storedUsername,
      modulesCompleted: completedModules.length,
      badges: userBadges.length,
      score: userScore,
      level: userLevel,
    },
    { name: "QuantumStudent", modulesCompleted: 160, badges: 15, score: 9500, level: 19 },
    { name: "NebulaNerd", modulesCompleted: 140, badges: 12, score: 8200, level: 16 },
    { name: "CosmicCadet", modulesCompleted: 100, badges: 8, score: 5800, level: 12 },
    { name: "MoonWalker", modulesCompleted: 80, badges: 6, score: 4600, level: 9 },
    { name: "SpaceRookie", modulesCompleted: 40, badges: 3, score: 2300, level: 5 },
  ]

  // Sort by score (highest first)
  return mockUsers.sort((a, b) => b.score - a.score)
}

// Helper function to get current streak count
function getCurrentStreakCount(): number {
  if (typeof window === "undefined") {
    return 0
  }

  const streak = localStorage.getItem("dailyStreak")
  if (!streak) return 0

  const dates = JSON.parse(streak) as string[]
  if (dates.length === 0) return 0

  let count = 1
  const sortedDates = [...dates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
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

// Get motivational quote
export async function getMotivationalQuote() {
  // Fallback quotes in case API fails
  const fallbackQuotes = [
    { text: "The only way to learn is by doing.", author: "Isaac Asimov" },
    { text: "Education is not the filling of a pot but the lighting of a fire.", author: "W.B. Yeats" },
    { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
    {
      text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
      author: "Dr. Seuss",
    },
    { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
    {
      text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.",
      author: "Brian Herbert",
    },
    { text: "Anyone who stops learning is old, whether at twenty or eighty.", author: "Henry Ford" },
    { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  ]

  // Return a random quote from our fallback list
  return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)]
}
