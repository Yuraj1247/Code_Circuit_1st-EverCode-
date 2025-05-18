// Speech recognition setup
export const setupSpeechRecognition = () => {
  if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
    console.warn("Speech recognition not supported in this browser")
    return null
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  const recognition = new SpeechRecognition()

  recognition.lang = "en-US"
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  return recognition
}

// Speech synthesis setup
export const speak = (text: string) => {
  if (!("speechSynthesis" in window)) {
    console.warn("Speech synthesis not supported in this browser")
    return
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = "en-US"
  utterance.pitch = 1
  utterance.rate = 1

  window.speechSynthesis.speak(utterance)
}

// Intent detection data
export const intentData = {
  // Subject navigation intents
  NAVIGATE_MATHS: [
    "go to maths",
    "open maths",
    "open math",
    "start maths",
    "take me to maths",
    "i want to study maths",
    "maths please",
    "launch maths",
    "load maths subject",
    "maths world",
    "enter the maths section",
    "click maths",
    "maths zone",
    "show me maths",
    "open the maths tab",
    "begin maths",
    "maths activity",
    "navigate to maths",
    "explore maths",
    "go into maths",
    "jump into maths",
    "open mathss", // Added for British English
    "go to mathss", // Added for British English
    "mathss please", // Added for British English
    "show me mathss", // Added for British English
  ],
  NAVIGATE_ENGLISH: [
    "go to english",
    "open english",
    "start english",
    "take me to english",
    "i want to study english",
    "english please",
    "launch english",
    "load english subject",
    "english world",
    "enter the english section",
    "click english",
    "english zone",
    "show me english",
    "open the english tab",
    "begin english",
    "english activity",
    "navigate to english",
    "explore english",
    "go into english",
    "jump into english",
  ],
  NAVIGATE_SCIENCE: [
    "open science",
    "go to science",
    "i want to study science",
    "show me science",
    "enter science tab",
    "click on science",
    "begin science",
    "explore science",
    "launch science subject",
    "science world",
    "study science now",
    "science topic",
    "start science",
    "navigate to science",
    "science please",
    "jump to science",
    "let's learn science",
    "take me to science",
    "unlock science",
    "go inside science",
  ],
  NAVIGATE_HISTORY: [
    "open history",
    "go to history",
    "take me to history",
    "click on history",
    "history subject",
    "learn history",
    "explore history",
    "history tab",
    "study history",
    "show me history",
    "enter the history world",
    "launch history",
    "navigate to history",
    "begin history",
    "history zone",
    "i want to know history",
    "go inside history",
    "jump into history",
    "history please",
    "open history topic",
  ],
  NAVIGATE_ARTS: [
    "go to arts",
    "open communication subject",
    "arts and communication",
    "show me arts",
    "arts tab",
    "enter arts",
    "click arts subject",
    "launch arts",
    "open arts tab",
    "explore arts",
    "study arts",
    "arts and media",
    "arts zone",
    "communication tab",
    "arts please",
    "begin arts",
    "start communication",
    "unlock arts",
    "navigate to arts",
    "arts activity",
  ],
  NAVIGATE_HINDI: [
    "open hindi",
    "go to hindi",
    "take me to hindi",
    "launch hindi",
    "hindi please",
    "study hindi",
    "click hindi subject",
    "show me hindi",
    "hindi zone",
    "start hindi",
    "navigate to hindi",
    "begin hindi",
    "explore hindi",
    "jump into hindi",
    "hindi world",
    "learn hindi",
    "go inside hindi",
    "open hindi section",
    "start learning hindi",
    "enter hindi tab",
  ],
  NAVIGATE_TECH: [
    "open technology",
    "go to tech subject",
    "click on technology",
    "study tech",
    "tech world",
    "navigate to technology",
    "begin tech",
    "learn technology",
    "start tech",
    "launch tech tab",
    "open tech section",
    "go inside technology",
    "tech zone",
    "technology please",
    "technology tab",
    "explore technology",
    "jump into tech",
    "enter tech",
    "open tech subject",
    "go to the technology area",
  ],
  NAVIGATE_REASONING: [
    "open reasoning",
    "go to reasoning",
    "launch reasoning tab",
    "enter reasoning",
    "study reasoning",
    "reasoning please",
    "explore reasoning",
    "click reasoning",
    "reasoning subject",
    "navigate to reasoning",
    "go inside reasoning",
    "begin reasoning",
    "reasoning zone",
    "show me reasoning",
    "reasoning module",
    "unlock reasoning",
    "reasoning activity",
    "reasoning section",
    "start reasoning",
    "open reasoning part",
  ],

  // Performance tab intents
  OPEN_PERFORMANCE: [
    "show my performance",
    "how am i doing",
    "open performance tab",
    "check my progress",
    "check performance",
    "open report",
    "see my stats",
    "performance section",
    "my learning performance",
    "show me my graph",
    "student report",
    "progress bar",
    "current performance",
    "performance tab",
    "navigate to performance",
    "click on performance",
    "show progress",
    "performance overview",
    "open report card",
    "learning summary",
  ],
  VIEW_BADGES: [
    "show badges",
    "open badges",
    "my achievements",
    "display rewards",
    "view badges",
    "badges please",
    "go to badges",
    "badge list",
    "my earned badges",
    "unlockables",
    "rewards tab",
    "achievements section",
    "let me see badges",
    "earned rewards",
    "see badge tab",
    "show me my badges",
    "click badges",
    "badges unlocked",
    "check achievements",
    "where are my badges",
  ],

  // General actions
  START_QUIZ: [
    "start quiz",
    "start the game",
    "i want to play",
    "let's play quiz",
    "open a game",
    "quiz please",
    "show me quiz",
    "launch quiz now",
    "start practice",
    "start activity",
    "test me",
    "open challenge",
    "start level",
    "run quiz",
    "initiate game",
    "i want to play quiz",
    "quiz section",
    "start fun activity",
    "open quiz tab",
    "play now",
  ],
  ASK_HELP: [
    "i need help",
    "how do i do this",
    "help me",
    "what is this",
    "can you guide me",
    "give me tips",
    "i'm stuck",
    "tell me what to do",
    "explain this",
    "how does this work",
    "i'm confused",
    "guide me please",
    "learn more about this",
    "what's next",
    "show how to use this",
    "how can i continue",
    "where should i go",
    "open help",
    "open assistant",
    "teach me this",
  ],
}

// Detect intent from user input
export const detectIntent = (userInput: string): string | null => {
  const lowerInput = userInput.toLowerCase().trim()

  // Check each intent category
  for (const [intent, phrases] of Object.entries(intentData)) {
    // Check if any phrase is contained in the user input
    for (const phrase of phrases) {
      if (lowerInput.includes(phrase)) {
        return intent
      }
    }
  }

  // Special case for single-word commands
  if (lowerInput === "maths" || lowerInput === "mathss") return "NAVIGATE_MATHS" // Fix: Changed from NAVIGATE_maths to NAVIGATE_MATHS
  if (lowerInput === "english") return "NAVIGATE_ENGLISH"
  if (lowerInput === "science") return "NAVIGATE_SCIENCE"
  if (lowerInput === "history") return "NAVIGATE_HISTORY"
  if (lowerInput === "arts") return "NAVIGATE_ARTS"
  if (lowerInput === "hindi") return "NAVIGATE_HINDI"
  if (lowerInput === "tech" || lowerInput === "technology") return "NAVIGATE_TECH"
  if (lowerInput === "reasoning") return "NAVIGATE_REASONING"
  if (lowerInput === "performance") return "OPEN_PERFORMANCE"
  if (lowerInput === "badges" || lowerInput === "achievements") return "VIEW_BADGES"
  if (lowerInput === "help") return "ASK_HELP"

  return null
}

// Map intent to subject ID for navigation
export const getSubjectIdFromIntent = (intent: string): string | null => {
  const intentToSubject: Record<string, string> = {
    NAVIGATE_MATHS: "maths", // Fix: Changed from NAVIGATE_maths to NAVIGATE_MATHS
    NAVIGATE_ENGLISH: "english",
    NAVIGATE_SCIENCE: "science",
    NAVIGATE_HISTORY: "history",
    NAVIGATE_ARTS: "arts",
    NAVIGATE_HINDI: "hindi",
    NAVIGATE_TECH: "technology",
    NAVIGATE_REASONING: "reasoning",
  }

  return intentToSubject[intent] || null
}
