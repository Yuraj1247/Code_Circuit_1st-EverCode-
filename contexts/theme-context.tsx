"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define the theme type with the three options
export type Theme = "solar" | "kingdom" | "terminal"

// Define theme features for each theme
export interface ThemeFeature {
  name: string
  description: string
  icon: string
}

export interface ThemeFeatures {
  name: string
  description: string
  primaryColor: string
  secondaryColor: string
  gradientFrom: string
  gradientTo: string
  icon: string
  features: ThemeFeature[]
}

// Theme details mapping with all the detailed features
export const themeDetails: Record<Theme, ThemeFeatures> = {
  solar: {
    name: "Solar System",
    description: "Explore the universe of knowledge through an immersive space journey",
    primaryColor: "purple",
    secondaryColor: "cyan",
    gradientFrom: "from-purple-600",
    gradientTo: "to-cyan-600",
    icon: "🪐",
    features: [
      {
        name: "Planetary Subject Navigation",
        description:
          "Each subject is represented as a planet orbiting a central sun. Math = Mars, Science = Saturn, English = Mercury, Arts = Venus, etc.",
        icon: "🪐",
      },
      {
        name: "Spaceship Progress Tracker",
        description:
          "A spaceship (your progress avatar) orbits each planet. Completing modules levels up your ship and gains boosters.",
        icon: "🚀",
      },
      {
        name: "Zero Gravity Navigation",
        description:
          "Smooth drag-scroll UI that simulates space float movement using GSAP + 3D transforms. Everything floats and fades like it's in a vacuum.",
        icon: "🌠",
      },
      {
        name: "Galactic Achievements Dashboard",
        description:
          "Shows badges like Galaxy Brain (Complete all 100 modules of 1 subject) and Meteoric Rise (5 modules/day streak).",
        icon: "🔭",
      },
      {
        name: "AI Astro Assistant (Cosmobot)",
        description:
          "A floating AI bot (like a hologram) that helps with navigation, explanations, and quiz assistance.",
        icon: "🛰️",
      },
      {
        name: "Dark Mode with Real-Time Starfield",
        description:
          "Uses Three.js to create a live starfield background that changes star patterns as user progresses (unlocks constellations).",
        icon: "🌑",
      },
    ],
  },
  kingdom: {
    name: "Enchanted Kingdom",
    description: "Journey through a magical realm of knowledge and discovery",
    primaryColor: "indigo",
    secondaryColor: "purple",
    gradientFrom: "from-indigo-600",
    gradientTo: "to-purple-600",
    icon: "🏰",
    features: [
      {
        name: "Fantasy Map Navigation",
        description:
          "A magical map scroll view of the kingdom: The Royal Library (English), Wizard's Tower (Science), Knight's Arena (Math), Artisan's Village (Arts), Cursed Forest (Logic).",
        icon: "🧚",
      },
      {
        name: "Mystical Level Unlocking",
        description:
          "Modules are locked in scrolls guarded by mythical creatures. Answer 10 questions to defeat the Guardian and unlock the next scroll.",
        icon: "🔮",
      },
      {
        name: "Owl Companion (Knowledge Guide)",
        description:
          "Appears on the side with helpful messages like 'You've completed Spellbook of Module 3!' and 'Challenge the next guardian of knowledge?'",
        icon: "🦉",
      },
      {
        name: "Day-to-Night Dynamic Visuals",
        description:
          "The background slowly transitions: Morning glow in early modules, Twilight as you go deep, Starry sky when reaching final quizzes.",
        icon: "🌕",
      },
      {
        name: "Mini Story Elements",
        description:
          "Each subject is a mini-story. Example for Arts: 'The Kingdom's color is fading! Restore it by solving art-based riddles!'",
        icon: "🎭",
      },
      {
        name: "Collect Enchanted Runes",
        description:
          "Each correct answer gives a rune. Completing 10 builds your own magic wand with a reward animation.",
        icon: "💎",
      },
      {
        name: "Gamified Battle Mode",
        description:
          "Head-to-head quiz battle with another player (simulated). Progress bar like a battle duel: Correct answers = attack hits enemy.",
        icon: "🗡️",
      },
    ],
  },
  terminal: {
    name: "Terminal Hacker",
    description: "Hack into the mainframe of knowledge with this cyberpunk interface",
    primaryColor: "green",
    secondaryColor: "emerald",
    gradientFrom: "from-green-600",
    gradientTo: "to-emerald-600",
    icon: "💻",
    features: [
      {
        name: "Real-Like Terminal Interface",
        description:
          "The entire UI runs in a realistic hacker terminal with blinking cursor animations, typing effects, and code-style font.",
        icon: "💻",
      },
      {
        name: "Voice-Activated Command System",
        description:
          "Simulated voice command integration for starting modules, switching themes, and loading progress.",
        icon: "🎙️",
      },
      {
        name: "AI Sidekick Chat (Dark Codex)",
        description:
          "A mini terminal-based AI assistant that gives hints, tells stories in hacker voice, and can drop quiz tips.",
        icon: "🤖",
      },
      {
        name: "Digital Glitch Animations",
        description:
          "Page transitions with matrix-style cascade, glitch effects for incorrect answers, and neon unlock effects.",
        icon: "⚡",
      },
      {
        name: "Terminal Boot-Up Animation",
        description:
          "When the theme is selected, loads a system boot sequence with hacker-style initialization messages.",
        icon: "🔄",
      },
      {
        name: "Quests Instead of Modules",
        description: "Each module is called a 'Hack Mission'. Complete missions to unlock 'Dark Files' (quizzes).",
        icon: "🎯",
      },
      {
        name: "Encrypted Progress Tracker",
        description: "Progress shown like terminal logs with mission status indicators.",
        icon: "🔐",
      },
      {
        name: "Hidden Easter Eggs",
        description: "Secret commands unlock hidden quizzes and special modules in the terminal.",
        icon: "🥚",
      },
      {
        name: "Custom Sound Effects",
        description: "Typewriter keystrokes, beep sounds, glitchy audio for wrong answers, and success chimes.",
        icon: "🔊",
      },
      {
        name: "Fake Hacker Leaderboard",
        description: "A stylized leaderboard like a hacker terminal showing rankings and skill levels.",
        icon: "📊",
      },
    ],
  },
}

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  isThemeSelected: boolean
  themeFeatures: ThemeFeatures
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function LearnverseThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("solar")
  const [isThemeSelected, setIsThemeSelected] = useState(false)

  useEffect(() => {
    // Get theme from localStorage on initial load
    const savedTheme = localStorage.getItem("theme") as Theme
    if (savedTheme && Object.keys(themeDetails).includes(savedTheme)) {
      setThemeState(savedTheme)
      setIsThemeSelected(true)
    }
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem("theme", newTheme)
    setIsThemeSelected(true)

    // Force a refresh to apply theme changes immediately
    document.documentElement.style.setProperty("--theme-refresh", Date.now().toString())
  }

  const value = {
    theme,
    setTheme,
    isThemeSelected,
    themeFeatures: themeDetails[theme],
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useLearnverseTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useLearnverseTheme must be used within a LearnverseThemeProvider")
  }
  return context
}
