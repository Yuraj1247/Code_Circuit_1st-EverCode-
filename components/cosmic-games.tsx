"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"

export function CosmicGames() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cosmic Games</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="memory">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="memory">Memory Match</TabsTrigger>
            <TabsTrigger value="puzzle">Word Puzzle</TabsTrigger>
            <TabsTrigger value="quiz">Speed Quiz</TabsTrigger>
          </TabsList>

          <TabsContent value="memory" className="mt-4">
            <MemoryGame />
          </TabsContent>

          <TabsContent value="puzzle" className="mt-4">
            <WordPuzzle />
          </TabsContent>

          <TabsContent value="quiz" className="mt-4">
            <SpeedQuiz />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Memory Match Game
function MemoryGame() {
  const [cards, setCards] = useState(() => {
    const items = [
      { id: 1, content: "🪐", matched: false },
      { id: 2, content: "🌎", matched: false },
      { id: 3, content: "🌙", matched: false },
      { id: 4, content: "⭐", matched: false },
      { id: 5, content: "🚀", matched: false },
      { id: 6, content: "☄️", matched: false },
    ]

    // Duplicate cards and shuffle
    const duplicatedCards = [...items, ...items]
      .map((item) => ({ ...item, uniqueId: Math.random() }))
      .sort(() => Math.random() - 0.5)

    return duplicatedCards
  })

  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [disabled, setDisabled] = useState(false)
  const [moves, setMoves] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)

  const handleCardClick = (uniqueId: number, id: number) => {
    if (disabled || flipped.includes(uniqueId) || matched.includes(id)) return

    const newFlipped = flipped.length < 2 ? [...flipped, uniqueId] : [uniqueId]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setDisabled(true)
      setMoves(moves + 1)

      // Get the IDs of the flipped cards
      const flippedCards = cards.filter((card) => newFlipped.includes(card.uniqueId))

      // Check if they match
      if (flippedCards[0].id === flippedCards[1].id) {
        setMatched([...matched, flippedCards[0].id])
        setFlipped([])
        setDisabled(false)

        // Check if game is complete
        if (matched.length + 1 === cards.length / 2) {
          setGameComplete(true)
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          })
        }
      } else {
        // Reset flipped cards after a delay
        setTimeout(() => {
          setFlipped([])
          setDisabled(false)
        }, 1000)
      }
    }
  }

  const resetGame = () => {
    setCards(cards.map((card) => ({ ...card, matched: false })).sort(() => Math.random() - 0.5))
    setFlipped([])
    setMatched([])
    setMoves(0)
    setGameComplete(false)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>Moves: {moves}</div>
        <Button size="sm" onClick={resetGame}>
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {cards.map((card) => (
          <motion.div
            key={card.uniqueId}
            className={`aspect-square flex items-center justify-center rounded-md cursor-pointer text-3xl
              ${flipped.includes(card.uniqueId) || matched.includes(card.id) ? "bg-purple-600" : "bg-gray-700"}`}
            onClick={() => handleCardClick(card.uniqueId, card.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              rotateY: flipped.includes(card.uniqueId) || matched.includes(card.id) ? 180 : 0,
              backgroundColor: matched.includes(card.id) ? "#10b981" : undefined,
            }}
          >
            {(flipped.includes(card.uniqueId) || matched.includes(card.id)) && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                {card.content}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {gameComplete && (
        <div className="mt-4 p-3 bg-green-500/20 text-green-400 rounded-md text-center">
          Congratulations! You completed the game in {moves} moves!
        </div>
      )}
    </div>
  )
}

// Word Puzzle Game
function WordPuzzle() {
  const puzzles = [
    {
      word: "PLANET",
      hint: "A celestial body that orbits a star",
    },
    {
      word: "GALAXY",
      hint: "A system of millions or billions of stars",
    },
    {
      word: "COSMOS",
      hint: "The universe seen as a well-ordered whole",
    },
  ]

  const [currentPuzzle, setCurrentPuzzle] = useState(0)
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])
  const [input, setInput] = useState("")
  const [message, setMessage] = useState("")
  const [gameWon, setGameWon] = useState(false)

  const puzzle = puzzles[currentPuzzle]

  const handleGuess = () => {
    if (!input.trim()) return

    const letter = input.trim().toUpperCase()

    if (guessedLetters.includes(letter)) {
      setMessage("You already guessed that letter!")
    } else {
      setGuessedLetters([...guessedLetters, letter])

      if (!puzzle.word.includes(letter)) {
        setMessage(`The letter ${letter} is not in the word.`)
      } else {
        setMessage(`Good guess! The letter ${letter} is in the word.`)

        // Check if all letters have been guessed
        const allLettersGuessed = [...puzzle.word].every((char) => guessedLetters.includes(char) || letter === char)

        if (allLettersGuessed) {
          setGameWon(true)
          setMessage("Congratulations! You solved the puzzle!")
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          })
        }
      }
    }

    setInput("")
  }

  const nextPuzzle = () => {
    setCurrentPuzzle((currentPuzzle + 1) % puzzles.length)
    setGuessedLetters([])
    setInput("")
    setMessage("")
    setGameWon(false)
  }

  return (
    <div>
      <div className="mb-4">
        <p className="text-sm text-gray-400">Hint: {puzzle.hint}</p>
      </div>

      <div className="flex justify-center mb-6">
        {[...puzzle.word].map((letter, index) => (
          <div key={index} className="w-10 h-10 border-b-2 border-purple-500 mx-1 flex items-center justify-center">
            <span className="text-xl font-bold">{guessedLetters.includes(letter) || gameWon ? letter : ""}</span>
          </div>
        ))}
      </div>

      {!gameWon ? (
        <div className="flex gap-2">
          <input
            type="text"
            maxLength={1}
            value={input}
            onChange={(e) => setInput(e.target.value.replace(/[^a-zA-Z]/g, ""))}
            className="w-12 h-12 text-center text-xl bg-gray-800 border border-gray-700 rounded-md"
          />
          <Button onClick={handleGuess} className="flex-1">
            Guess Letter
          </Button>
        </div>
      ) : (
        <Button onClick={nextPuzzle} className="w-full">
          Next Puzzle
        </Button>
      )}

      {message && (
        <div
          className={`mt-4 p-3 rounded-md text-center ${
            gameWon ? "bg-green-500/20 text-green-400" : "bg-gray-800 text-gray-300"
          }`}
        >
          {message}
        </div>
      )}

      {guessedLetters.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-400">Guessed letters:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {guessedLetters.map((letter, index) => (
              <span
                key={index}
                className={`px-2 py-1 text-xs rounded-md ${
                  puzzle.word.includes(letter) ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                }`}
              >
                {letter}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Speed Quiz Game
function SpeedQuiz() {
  const questions = [
    {
      question: "What is the closest planet to the Sun?",
      options: ["Venus", "Mercury", "Earth", "Mars"],
      answer: 1,
    },
    {
      question: "What is the largest planet in our Solar System?",
      options: ["Earth", "Saturn", "Jupiter", "Neptune"],
      answer: 2,
    },
    {
      question: "What is the name of our galaxy?",
      options: ["Andromeda", "Milky Way", "Triangulum", "Whirlpool"],
      answer: 1,
    },
    {
      question: "How many planets are in our Solar System?",
      options: ["7", "8", "9", "10"],
      answer: 1,
    },
    {
      question: "What is the hottest planet in our Solar System?",
      options: ["Mercury", "Venus", "Mars", "Jupiter"],
      answer: 1,
    },
  ]

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(10)
  const [gameActive, setGameActive] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  const startGame = () => {
    setCurrentQuestion(0)
    setScore(0)
    setTimeLeft(10)
    setGameActive(true)
    setGameOver(false)
  }

  const handleAnswer = (selectedIndex: number) => {
    if (selectedIndex === questions[currentQuestion].answer) {
      setScore(score + 1)
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setTimeLeft(10)
    } else {
      setGameActive(false)
      setGameOver(true)
    }
  }

  // Timer effect
  useState(() => {
    let timer: NodeJS.Timeout

    if (gameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && gameActive) {
      // Time's up for this question
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setTimeLeft(10)
      } else {
        setGameActive(false)
        setGameOver(true)
      }
    }

    return () => clearInterval(timer)
  })

  return (
    <div>
      {!gameActive && !gameOver ? (
        <div className="text-center">
          <p className="mb-4">Answer as many questions as you can before time runs out!</p>
          <Button onClick={startGame}>Start Quiz</Button>
        </div>
      ) : gameOver ? (
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Game Over!</h3>
          <p className="mb-4">
            Your score: {score} / {questions.length}
          </p>
          <Button onClick={startGame}>Play Again</Button>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              Question {currentQuestion + 1} / {questions.length}
            </div>
            <div className={`font-bold ${timeLeft <= 3 ? "text-red-500" : ""}`}>Time: {timeLeft}s</div>
          </div>

          <h3 className="text-lg font-medium mb-4">{questions[currentQuestion].question}</h3>

          <div className="space-y-2">
            {questions[currentQuestion].options.map((option, index) => (
              <motion.button
                key={index}
                className="w-full p-3 text-left rounded-md border border-gray-700 hover:bg-gray-800"
                onClick={() => handleAnswer(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {option}
              </motion.button>
            ))}
          </div>

          <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all duration-1000"
              style={{ width: `${(timeLeft / 10) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  )
}
