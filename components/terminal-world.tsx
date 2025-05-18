"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { subjects } from "@/lib/data"
import { TerminalIcon, Folder, FolderOpen, ChevronRight, Code, Database } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

export function TerminalWorld() {
  const router = useRouter()
  const isMobile = useMobile()
  const [activeFolder, setActiveFolder] = useState<string | null>(null)
  const [terminalLines, setTerminalLines] = useState<string[]>([
    "LEARNVERSE OS v1.0.0",
    "Copyright © 2023-2024 LearnVerse Corp.",
    "Initializing knowledge database...",
    "Loading subject modules...",
    "System ready.",
    "> Type 'help' for commands",
  ])
  const [inputValue, setInputValue] = useState("")
  const [showPopup, setShowPopup] = useState<string | null>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Auto-scroll terminal to bottom when new lines are added
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }

    // Focus input when component mounts
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [terminalLines])

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputValue.trim()) return

    // Add user command to terminal
    const newLines = [...terminalLines, `> ${inputValue}`]

    // Process command
    const command = inputValue.toLowerCase().trim()

    if (command === "help") {
      newLines.push(
        "Available commands:",
        "  help - Show this help message",
        "  list - List all subjects",
        "  open [subject] - Open a subject",
        "  clear - Clear terminal",
      )
    } else if (command === "list") {
      newLines.push("Available subjects:")
      subjects.forEach((subject) => {
        newLines.push(`  ${subject.id} - ${subject.name}`)
      })
    } else if (command === "clear") {
      setTerminalLines([])
      setInputValue("")
      return
    } else if (command.startsWith("open ")) {
      const subjectId = command.split(" ")[1]
      const subject = subjects.find((s) => s.id === subjectId)

      if (subject) {
        newLines.push(`Opening ${subject.name}...`)
        setTimeout(() => {
          router.push(`/subject/${subject.id}`)
        }, 1000)
      } else {
        newLines.push(`Error: Subject '${subjectId}' not found. Type 'list' to see available subjects.`)
      }
    } else {
      newLines.push(`Command not recognized: ${inputValue}. Type 'help' for available commands.`)
    }

    setTerminalLines(newLines)
    setInputValue("")
  }

  // Subject descriptions for popups
  const getSubjectDescription = (subjectId: string) => {
    switch (subjectId) {
      case "english":
        return "Explore the world of language and literature through code!"
      case "maths":
        return "Decode the language of numbers and patterns!"
      case "science":
        return "Hack into the secrets of nature and the universe!"
      case "history":
        return "Access the database of human history!"
      case "arts":
        return "Render your creativity through digital expression!"
      case "hindi":
        return "Process the beautiful Hindi language algorithms!"
      case "technology":
        return "Dive into the core systems of technology!"
      case "reasoning":
        return "Debug your mind with logical challenges!"
      default:
        return "Access this knowledge database!"
    }
  }

  const handleFolderClick = (subjectId: string) => {
    if (activeFolder === subjectId) {
      // Show popup briefly before navigating
      setShowPopup(subjectId)
      setTimeout(() => {
        setShowPopup(null)
        router.push(`/subject/${subjectId}`)
      }, 1500)
    } else {
      // Otherwise, just open the folder
      setActiveFolder(subjectId)
      setTerminalLines([...terminalLines, `> Opening folder: ${subjectId}`])
    }
  }

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-4 p-2 md:p-4 bg-black text-green-500 font-mono overflow-y-auto md:overflow-hidden">
      {/* File explorer */}
      <div className="w-full md:w-1/3 h-64 md:h-full bg-gray-900/50 border border-green-900/50 rounded-md p-2 overflow-y-auto">
        <div className="flex items-center gap-2 mb-4 p-2 bg-green-900/20 rounded">
          <Database className="h-4 w-4" />
          <span className="font-bold">KNOWLEDGE DATABASE</span>
        </div>

        <div className="space-y-1">
          {subjects.map((subject) => (
            <div key={subject.id} className="select-none">
              <div
                className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-green-900/20 ${
                  activeFolder === subject.id ? "bg-green-900/30" : ""
                }`}
                onClick={() => handleFolderClick(subject.id)}
              >
                <ChevronRight
                  className={`h-4 w-4 transition-transform ${activeFolder === subject.id ? "rotate-90" : ""}`}
                />
                {activeFolder === subject.id ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />}
                <span>{subject.name}</span>

                {/* Popup with subject description */}
                {showPopup === subject.id && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 bg-black/90 border border-green-500 text-green-400 px-4 py-2 rounded-md text-sm animate-pulse z-10">
                    {getSubjectDescription(subject.id)}
                  </div>
                )}

                {/* Always show label on mobile */}
                {isMobile && !activeFolder && (
                  <span className="ml-auto text-[10px] md:text-xs text-green-400 bg-green-900/30 px-1.5 py-0.5 rounded">
                    Tap to open
                  </span>
                )}
              </div>

              <AnimatePresence>
                {activeFolder === subject.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden pl-8"
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-1 rounded cursor-pointer hover:bg-green-900/20"
                        onClick={() => router.push(`/subject/${subject.id}`)}
                      >
                        <Code className="h-3 w-3" />
                        <span className="text-sm">Module_{i + 1}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 p-1 rounded cursor-pointer hover:bg-green-900/20">
                      <Code className="h-3 w-3" />
                      <span className="text-sm">View_All_Modules...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Terminal */}
      <div className="w-full md:w-2/3 h-full min-h-[300px] bg-gray-900/50 border border-green-900/50 rounded-md p-2 flex flex-col">
        <div className="flex items-center gap-2 mb-2 p-2 bg-green-900/20 rounded">
          <TerminalIcon className="h-4 w-4" />
          <span className="font-bold">TERMINAL</span>
        </div>

        <div ref={terminalRef} className="flex-grow overflow-y-auto p-2 font-mono text-sm">
          {terminalLines.map((line, index) => (
            <div key={index} className={line.startsWith(">") ? "text-green-400" : "text-green-600"}>
              {line}
            </div>
          ))}
        </div>

        <form onSubmit={handleCommand} className="flex items-center gap-2 mt-2">
          <span className="text-green-400">{">"}</span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-grow bg-transparent border-none outline-none text-green-400 font-mono"
            autoComplete="off"
            spellCheck="false"
          />
        </form>
      </div>
    </div>
  )
}
