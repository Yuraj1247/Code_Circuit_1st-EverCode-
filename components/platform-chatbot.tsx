"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Bot, X, Send, Loader2, Mic, Volume2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { subjects } from "@/lib/data"
import { useLearnverseTheme } from "@/contexts/theme-context"
import { useMobile } from "@/hooks/use-mobile"

// Add these imports at the top
import { setupSpeechRecognition, speak, detectIntent, getSubjectIdFromIntent } from "@/lib/speech"

export function PlatformChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content: "Hi there! I'm your LearnVerse assistant. How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { setTheme } = useLearnverseTheme()
  const isMobile = useMobile()

  // Add these state variables inside the PlatformChatbot component
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<any>(null)

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Add this useEffect hook after the existing useEffect
  useEffect(() => {
    // Initialize speech recognition
    recognitionRef.current = setupSpeechRecognition()

    if (recognitionRef.current) {
      recognitionRef.current.onresult = (event: any) => {
        const voiceText = event.results[0][0].transcript
        // Don't set input text when using voice
        // Process voice input directly
        handleVoiceSubmit(voiceText)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      // Clean up
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  // Modify the toggleChat function to include voice feedback
  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen && voiceEnabled) {
      speak("How can I help you today?")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage = { role: "user" as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Process the message
    setTimeout(() => {
      processUserMessage(userMessage.content)
      setIsLoading(false)
    }, 500)
  }

  // Add this function after the handleSubmit function
  const handleVoiceSubmit = (voiceText: string) => {
    if (!voiceText.trim()) return

    // Add user message
    const userMessage = { role: "user" as const, content: voiceText }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Process the message
    setTimeout(() => {
      processVoiceMessage(voiceText)
      setIsLoading(false)
    }, 500)
  }

  const processUserMessage = (message: string) => {
    // First check for intents using the improved intent detection
    const intent = detectIntent(message)

    if (intent) {
      executeIntent(intent, message)
      return
    }

    const lowerMessage = message.toLowerCase()

    // Check for navigation commands
    if (
      lowerMessage.includes("go to") ||
      lowerMessage.includes("navigate to") ||
      lowerMessage.includes("take me to") ||
      lowerMessage.includes("show me")
    ) {
      handleNavigationCommand(lowerMessage)
      return
    }

    // Check for theme change commands
    if (
      lowerMessage.includes("change theme") ||
      lowerMessage.includes("switch theme") ||
      lowerMessage.includes("set theme")
    ) {
      handleThemeCommand(lowerMessage)
      return
    }

    // Check for information about LearnVerse
    if (
      lowerMessage.includes("what is learnverse") ||
      lowerMessage.includes("tell me about learnverse") ||
      lowerMessage.includes("explain learnverse")
    ) {
      respondWithLearnverseInfo()
      return
    }

    // Check for subject information
    if (lowerMessage.includes("subject") || lowerMessage.includes("subjects")) {
      handleSubjectInfoCommand(lowerMessage)
      return
    }

    // Check for feature information
    if (lowerMessage.includes("feature") || lowerMessage.includes("features")) {
      respondWithFeatureInfo()
      return
    }

    // Check for who can use
    if (lowerMessage.includes("who can use") || lowerMessage.includes("who is it for")) {
      respondWithUserInfo()
      return
    }

    // Check for help command
    if (lowerMessage.includes("help") || lowerMessage === "?") {
      respondWithHelp()
      return
    }

    // Default response
    const response =
      "I'm here to help you navigate LearnVerse and answer your questions. You can ask me about subjects, features, or how to use the platform. Try asking 'What is LearnVerse?' or 'Show me my performance'."
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: response,
      },
    ])

    if (voiceEnabled) {
      speak(response)
    }
  }

  // Add this function after the processUserMessage function
  const processVoiceMessage = (message: string) => {
    // Process using the same logic as text input
    processUserMessage(message)
  }

  // Add this function after the processVoiceMessage function
  const executeIntent = (intent: string, originalMessage: string) => {
    let response = ""

    switch (intent) {
      // Subject navigation
      case "NAVIGATE_MATHS": // Fix: Changed from NAVIGATE_MATH to NAVIGATE_MATHS
      case "NAVIGATE_ENGLISH":
      case "NAVIGATE_SCIENCE":
      case "NAVIGATE_HISTORY":
      case "NAVIGATE_ARTS":
      case "NAVIGATE_HINDI":
      case "NAVIGATE_TECH":
      case "NAVIGATE_REASONING":
        const subjectId = getSubjectIdFromIntent(intent)
        if (subjectId) {
          // Find the subject name for a more natural response
          const subject = subjects.find((s) => s.id === subjectId)
          const subjectName = subject ? subject.name : subjectId

          response = `Taking you to the ${subjectName} subject...`
          setMessages((prev) => [...prev, { role: "assistant", content: response }])
          if (voiceEnabled) speak(response)

          // Debug log
          console.log(`Navigating to subject: ${subjectId}`)

          setTimeout(() => {
            router.push(`/subject/${subjectId}`)
            setIsOpen(false)
          }, 1000)
        }
        break

      // Performance and badges
      case "OPEN_PERFORMANCE":
        response = "Opening your performance dashboard..."
        setMessages((prev) => [...prev, { role: "assistant", content: response }])
        if (voiceEnabled) speak(response)
        setTimeout(() => {
          router.push("/performance")
          setIsOpen(false)
        }, 1000)
        break

      case "VIEW_BADGES":
        response = "Taking you to your badges and achievements..."
        setMessages((prev) => [...prev, { role: "assistant", content: response }])
        if (voiceEnabled) speak(response)
        setTimeout(() => {
          router.push("/achievements")
          setIsOpen(false)
        }, 1000)
        break

      // Theme toggle
      case "DARK_MODE":
        response = "Switching to terminal theme..."
        setMessages((prev) => [...prev, { role: "assistant", content: response }])
        if (voiceEnabled) speak(response)
        setTheme("terminal")
        break

      case "LIGHT_MODE":
        response = "Switching to solar theme..."
        setMessages((prev) => [...prev, { role: "assistant", content: response }])
        if (voiceEnabled) speak(response)
        setTheme("solar")
        break

      // Help
      case "ASK_HELP":
        respondWithHelp()
        break

      // Quiz
      case "START_QUIZ":
        response = "Let's start a quiz! Which subject would you like to practice?"
        setMessages((prev) => [...prev, { role: "assistant", content: response }])
        if (voiceEnabled) speak(response)
        break

      default:
        // No recognized intent, fall back to regular processing
        // This shouldn't happen since we already checked for intent
        // But just in case, we'll handle the message normally
        const lowerMessage = originalMessage.toLowerCase()

        // Check for navigation commands
        if (
          lowerMessage.includes("go to") ||
          lowerMessage.includes("navigate to") ||
          lowerMessage.includes("take me to") ||
          lowerMessage.includes("show me")
        ) {
          handleNavigationCommand(lowerMessage)
        } else {
          // Default response
          response =
            "I'm here to help you navigate LearnVerse. You can ask me to open subjects, check your performance, or view your badges."
          setMessages((prev) => [...prev, { role: "assistant", content: response }])
          if (voiceEnabled) speak(response)
        }
        break
    }
  }

  const handleNavigationCommand = (message: string) => {
    // Check for subject navigation
    for (const subject of subjects) {
      if (
        message.includes(subject.id) ||
        message.includes(subject.name.toLowerCase()) ||
        message.includes(`${subject.name.toLowerCase()} planet`) ||
        message.includes(`${subject.name.toLowerCase()} tower`) ||
        message.includes(`${subject.name.toLowerCase()} subject`) ||
        // Fix: Changed "math" to "maths" to match the subject ID in data.ts
        (subject.id === "maths" && message.includes("maths"))
      ) {
        const response = `Taking you to the ${subject.name} subject page...`
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: response,
          },
        ])

        if (voiceEnabled) {
          speak(response)
        }

        // Debug log
        console.log(`Navigating to subject: ${subject.id}`)

        setTimeout(() => {
          router.push(`/subject/${subject.id}`)
          setIsOpen(false)
        }, 1000)
        return
      }
    }

    // Check for specific page navigation
    const pageMatches = [
      { keywords: ["home", "main", "start", "galaxy"], path: "/", name: "home" },
      { keywords: ["performance", "progress", "dashboard", "stats"], path: "/performance", name: "performance" },
      { keywords: ["achievements", "badges", "awards"], path: "/achievements", name: "achievements" },
      { keywords: ["profile", "account", "my profile"], path: "/profile", name: "profile" },
      { keywords: ["about", "about us"], path: "/about", name: "about" },
      { keywords: ["contact", "contact us"], path: "/contact", name: "contact" },
    ]

    for (const page of pageMatches) {
      if (page.keywords.some((keyword) => message.includes(keyword))) {
        const response = `Taking you to the ${page.name} page...`
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: response,
          },
        ])

        if (voiceEnabled) {
          speak(response)
        }

        setTimeout(() => {
          router.push(page.path)
          setIsOpen(false)
        }, 1000)
        return
      }
    }

    // If no specific navigation found
    const response =
      "I'm not sure where you want to go. You can navigate to subjects like 'Math' or 'Science', or pages like 'Performance', 'Achievements', 'Profile', 'About', or 'Contact'."
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: response,
      },
    ])

    if (voiceEnabled) {
      speak(response)
    }
  }

  const handleThemeCommand = (message: string) => {
    const themeMatches = [
      { keywords: ["solar", "galaxy", "space", "planets"], theme: "solar" },
      { keywords: ["kingdom", "enchanted", "castle", "fantasy", "magic"], theme: "kingdom" },
      { keywords: ["terminal", "hacker", "code", "programming", "computer"], theme: "terminal" },
    ]

    for (const theme of themeMatches) {
      if (theme.keywords.some((keyword) => message.includes(keyword))) {
        const response = `Changing theme to ${theme.theme}...`
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: response,
          },
        ])

        if (voiceEnabled) {
          speak(response)
        }

        setTheme(theme.theme)
        return
      }
    }

    // If no specific theme found
    const response =
      "I can change the theme to 'Solar System', 'Enchanted Kingdom', or 'Terminal Hacker'. Which one would you like?"
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: response,
      },
    ])

    if (voiceEnabled) {
      speak(response)
    }
  }

  const handleSubjectInfoCommand = (message: string) => {
    // Check if asking about a specific subject
    for (const subject of subjects) {
      if (message.includes(subject.id) || message.includes(subject.name.toLowerCase())) {
        const response = `${subject.name} is one of our core subjects in LearnVerse. It includes interactive modules, quizzes, and skill trees to help you master ${subject.name.toLowerCase()} concepts. Would you like me to take you to the ${subject.name} subject page?`
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: response,
          },
        ])

        if (voiceEnabled) {
          speak(response)
        }

        return
      }
    }

    // General subject info
    const response = `LearnVerse offers ${subjects.length} exciting subjects: ${subjects.map((s) => s.name).join(", ")}. Each subject has its own interactive modules, quizzes, and skill trees. Which subject would you like to explore?`
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: response,
      },
    ])

    if (voiceEnabled) {
      speak(response)
    }
  }

  const respondWithLearnverseInfo = () => {
    const response =
      "LearnVerse is an interactive, gamified learning platform designed to make education fun and engaging. It transforms traditional learning into an exciting journey through different themed worlds like the Solar System, Enchanted Kingdom, and Terminal Hacker. LearnVerse covers multiple subjects including Mathematics, Science, English, History, Arts, Hindi, Technology, and Reasoning, with personalized learning paths and real-time progress tracking."

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: response,
      },
    ])

    if (voiceEnabled) {
      speak(response)
    }
  }

  const respondWithFeatureInfo = () => {
    const response =
      "LearnVerse offers many exciting features:\n\n• Interactive themed worlds (Solar System, Enchanted Kingdom, Terminal)\n• Multiple subjects with customized learning paths\n• Skill trees to visualize your learning journey\n• Quizzes and challenges to test your knowledge\n• Badges and achievements to track your progress\n• Real-time performance dashboard\n• Daily challenges and streaks\n• Personalized recommendations\n\nWhich feature would you like to know more about?"

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: response,
      },
    ])

    if (voiceEnabled) {
      speak(
        "LearnVerse offers many exciting features like interactive themed worlds, multiple subjects with customized learning paths, and more. Which feature would you like to know about?",
      )
    }
  }

  const respondWithUserInfo = () => {
    const response =
      "LearnVerse is designed for learners of all ages, particularly students in K-12 education. It's perfect for:\n\n• Students looking for a fun way to learn\n• Parents who want to supplement their children's education\n• Teachers seeking interactive teaching tools\n• Anyone interested in lifelong learning\n\nThe platform adapts to different learning styles and paces, making it accessible to everyone."

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: response,
      },
    ])

    if (voiceEnabled) {
      speak(
        "LearnVerse is designed for learners of all ages, particularly students in K-12 education. The platform adapts to different learning styles and paces, making it accessible to everyone.",
      )
    }
  }

  // Add this function to toggle voice recognition
  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.abort()
      setIsListening(false)
    } else {
      try {
        recognitionRef.current?.start()
        setIsListening(true)
      } catch (error) {
        console.error("Error starting speech recognition:", error)
      }
    }
  }

  // Add this function to toggle voice output
  const toggleVoiceOutput = () => {
    setVoiceEnabled(!voiceEnabled)
    if (!voiceEnabled) {
      speak("Voice assistant is now active")
    }
  }

  // Modify the respondWithHelp function to include voice info
  const respondWithHelp = () => {
    const helpMessage =
      "Here are some things you can ask me:\n\n• What is LearnVerse?\n• What features does LearnVerse have?\n• Who can use LearnVerse?\n• Take me to [subject name]\n• Show me my performance\n• Change theme to [theme name]\n• Tell me about [subject]\n• Navigate to [page name]\n\nYou can also use voice commands by clicking the microphone button. I'm here to help you make the most of your LearnVerse experience!"

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: helpMessage,
      },
    ])

    if (voiceEnabled) {
      speak("I can help you navigate LearnVerse, answer questions, and more. Try asking about subjects or features.")
    }
  }

  // Calculate chat window position and size based on screen size
  const getChatWindowStyles = () => {
    if (isMobile) {
      return {
        width: "calc(100% - 20px)",
        height: "60vh",
        bottom: "70px",
        right: "10px",
        left: "10px",
      }
    }
    return {
      width: "380px",
      height: "400px",
      bottom: "80px",
      right: "20px",
    }
  }

  return (
    <>
      {/* Chat button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-3 shadow-lg z-50 transition-all duration-300"
        aria-label="Chat with LearnVerse Assistant"
      >
        <Bot size={24} />
      </button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bg-gray-900 rounded-lg shadow-xl overflow-hidden z-50 flex flex-col"
            style={getChatWindowStyles()}
          >
            {/* Chat header */}
            <div className="bg-purple-600 p-3 flex justify-between items-center">
              <div className="flex items-center">
                <Bot className="text-white mr-2" size={20} />
                <h3 className="text-white font-medium">LearnVerse Assistant</h3>
              </div>
              <button onClick={toggleChat} className="text-white hover:text-gray-200" aria-label="Close chat">
                <X size={20} />
              </button>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-purple-600 text-white rounded-br-none"
                        : "bg-gray-800 text-white rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-3 bg-gray-800 text-white rounded-bl-none">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat input */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-gray-800 bg-gray-900 flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-gray-800 text-white rounded-l-lg px-4 py-2 focus:outline-none"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 ${isListening ? "text-red-400" : "text-white"}`}
                disabled={isLoading}
                aria-label="Voice input"
              >
                {isListening ? <Loader2 size={18} className="animate-spin" /> : <Mic size={18} />}
              </button>
              <button
                type="button"
                onClick={toggleVoiceOutput}
                className={`bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 ${voiceEnabled ? "text-green-400" : "text-white"}`}
                disabled={isLoading}
                aria-label="Voice output"
              >
                <Volume2 size={18} />
              </button>
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-r-lg px-4 py-2 disabled:opacity-50"
                disabled={isLoading || !input.trim()}
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
