"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { GalaxyExplorer } from "@/components/galaxy-explorer"
import { EnchantedKingdom } from "@/components/enchanted-kingdom"
import { TerminalWorld } from "@/components/terminal-world"
import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"
import { DailyChallenge } from "@/components/daily-challenge"
import { SearchBar } from "@/components/search-bar"
import { StudyTimer } from "@/components/study-timer"
import { CosmicGames } from "@/components/cosmic-games"
import { Interactive3DLearning } from "@/components/interactive-3d-learning"
import { ThemeSelector } from "@/components/theme-selector"
import { useLearnverseTheme, themeDetails } from "@/contexts/theme-context"

export default function Home() {
  const { theme, isThemeSelected } = useLearnverseTheme()
  const themeInfo = themeDetails[theme]

  const [scrolled, setScrolled] = useState(false)
  const [username, setUsername] = useState("")
  const [streakCount, setStreakCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Get username from localStorage if it exists
    const storedUsername = localStorage.getItem("userName")
    if (storedUsername) {
      setUsername(storedUsername)
    }

    // Get streak count
    const dailyStreak = localStorage.getItem("dailyStreak")
    if (dailyStreak) {
      try {
        setStreakCount(JSON.parse(dailyStreak).length)
      } catch (e) {
        setStreakCount(0)
      }
    }

    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleUsernameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newUsername = formData.get("username") as string

    if (newUsername) {
      localStorage.setItem("userName", newUsername)
      setUsername(newUsername)
    }
  }

  // Render the appropriate explorer component based on the selected theme
  const renderThemeExplorer = () => {
    switch (theme) {
      case "solar":
        return <GalaxyExplorer />
      case "kingdom":
        return <EnchantedKingdom />
      case "terminal":
        return <TerminalWorld />
      default:
        return <GalaxyExplorer />
    }
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center relative px-4">
        <div
          className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-${themeInfo.primaryColor}-900/20 via-black to-black z-0`}
        ></div>

        <div className="z-10 text-center max-w-3xl mx-auto">
          <h1
            className={`text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r ${themeInfo.gradientFrom} ${themeInfo.gradientTo}`}
          >
            Welcome to LearnVerse
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">Your Perfect EduTech Platform</p>

          {!username ? (
            <form onSubmit={handleUsernameSubmit} className="mb-8">
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your cosmic explorer name"
                  className="px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <Button type="submit" className={`bg-gradient-to-r ${themeInfo.gradientFrom} ${themeInfo.gradientTo}`}>
                  Set Name
                </Button>
              </div>
            </form>
          ) : (
            <p className="text-lg mb-8">
              Welcome back, <span className={`font-bold text-${themeInfo.primaryColor}-400`}>{username}</span>!
            </p>
          )}

          <Button
            onClick={() => {
              document.getElementById("theme-section")?.scrollIntoView({ behavior: "smooth" })
            }}
            className={`bg-gradient-to-r ${themeInfo.gradientFrom} ${themeInfo.gradientTo} text-lg px-8 py-6`}
          >
            Begin Your Journey
          </Button>
        </div>

        <div className="absolute bottom-10 animate-bounce">
          <ArrowDown className={`h-8 w-8 text-${themeInfo.primaryColor}-400`} />
        </div>
      </section>

      {/* Theme Selection Section */}
      <section
        id="theme-section"
        className="min-h-screen flex flex-col items-center justify-center relative px-4 py-16"
      >
        <div
          className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-${themeInfo.primaryColor}-900/20 via-black to-black z-0`}
        ></div>

        <div className="container mx-auto z-10">
          <h2
            className={`text-3xl md:text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r ${themeInfo.gradientFrom} ${themeInfo.gradientTo}`}
          >
            Choose Your Learning Universe
          </h2>
          <p className="text-center text-gray-300 mb-16 max-w-2xl mx-auto">
            Select a theme that resonates with your learning style. Each universe offers a unique visual experience
            while maintaining the same powerful learning content.
          </p>

          <ThemeSelector />

          {isThemeSelected && (
            <div className="mt-16 text-center">
              <Button
                onClick={() => {
                  document.getElementById("explorer-section")?.scrollIntoView({ behavior: "smooth" })
                }}
                className={`bg-gradient-to-r ${themeInfo.gradientFrom} ${themeInfo.gradientTo} text-lg px-8 py-6`}
              >
                Explore Your Universe
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Explorer Section - Only show if theme is selected */}
      {isThemeSelected && (
        <section id="explorer-section" className="min-h-screen relative">
          <div className="container mx-auto px-4 py-16 relative z-10">
            <h2
              className={`text-3xl md:text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r ${themeInfo.gradientFrom} ${themeInfo.gradientTo}`}
            >
              The 8 Pillars of Basic Knowledge
            </h2>
            <p className="text-center text-gray-300 mb-16 max-w-2xl mx-auto">
              Each Pillars represents a different field of knowledge. Click on a any Pillar to explore modules and begin
              your learning adventure!
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-500 mx-auto mb-2"></div>
                <p className="font-medium">English</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-amber-500 mx-auto mb-2"></div>
                <p className="font-medium">Mathematics</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500 mx-auto mb-2"></div>
                <p className="font-medium">Science</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-red-500 mx-auto mb-2"></div>
                <p className="font-medium">History</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-pink-500 mx-auto mb-2"></div>
                <p className="font-medium">Arts & Communication</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-purple-500 mx-auto mb-2"></div>
                <p className="font-medium">Hindi</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-500 mx-auto mb-2"></div>
                <p className="font-medium">Technology</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-sky-500 mx-auto mb-2"></div>
                <p className="font-medium">Reasoning</p>
              </div>
            </div>
          </div>

          <div className="h-[600px] w-full">{renderThemeExplorer()}</div>
        </section>
      )}

      {/* Advanced Features Section - Only show if theme is selected */}
      {isThemeSelected && mounted && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2
              className={`text-3xl md:text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r ${themeInfo.gradientFrom} ${themeInfo.gradientTo}`}
            >
              Learning Tools
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <div>
                <DailyChallenge onComplete={(correct) => console.log("Challenge completed:", correct)} />
              </div>

              <div>
                <StudyTimer />
              </div>

              <div>
                <div className="space-y-6">
                  <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4">Quick Search</h3>
                    <SearchBar />
                  </div>

                  <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4">Learning Streak</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-3xl font-bold text-${themeInfo.primaryColor}-400`}>{streakCount}</p>
                        <p className="text-sm text-gray-400">Days in a row</p>
                      </div>
                      <div
                        className={`h-16 w-16 bg-${themeInfo.primaryColor}-900/30 rounded-full flex items-center justify-center`}
                      >
                        <span className="text-2xl">🔥</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mb-12">
              <Button
                onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}
                className={`bg-gradient-to-r ${themeInfo.gradientFrom} ${themeInfo.gradientTo}`}
              >
                {showAdvancedFeatures ? "Hide Advanced Features" : "Show Advanced Features"}
              </Button>
            </div>

            {showAdvancedFeatures && (
              <div className="space-y-12">
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-center">Interactive 3D Learning</h3>
                  <Interactive3DLearning />
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-6 text-center">Cosmic Games</h3>
                  <CosmicGames />
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  )
}
