// Mock data for the LearnVerse application

export interface Subject {
  id: string
  name: string
  description: string
  color: string
  size?: number
  texture?: string
  rotation?: number
  rings?: boolean
  atmosphere?: boolean
  moons?: number
}

export interface Module {
  id: string
  subjectId: string
  title: string
  description: string
  difficulty: "beginner" | "easy" | "medium" | "hard" | "expert"
  estimatedTime: string
  xpPoints: number
  unlockRequirements?: string[]
  tags?: string[]
  content: {
    title: string
    text: string
  }[]
  quiz: {
    question: string
    options: string[]
    correctAnswer: number
  }[]
}

// Update the subjects array with more realistic planet characteristics
export const subjects: Subject[] = [
  {
    id: "english",
    name: "English",
    description: "Master language skills through reading, writing, and communication.",
    color: "#9c9c9c", // Mercury-like gray
    size: 0.8,
    texture: "/placeholder.svg?height=256&width=256&text=English",
    rotation: 0.005,
    atmosphere: false,
    moons: 0,
  },
  {
    id: "maths",
    name: "Mathematics",
    description: "Explore the universe of numbers, patterns, and logical reasoning.",
    color: "#ffff00", // Venus-like yellowish
    size: 0.95,
    texture: "/placeholder.svg?height=256&width=256&text=Maths",
    rotation: 0.003,
    atmosphere: true,
    moons: 0,
  },
  {
    id: "science",
    name: "Science",
    description: "Discover the wonders of the natural world through scientific exploration.",
    color: "#3b82f6", // Earth-like blue
    size: 1.0,
    texture: "/placeholder.svg?height=256&width=256&text=Science",
    rotation: 0.007,
    atmosphere: true,
    moons: 1,
  },
  {
    id: "history",
    name: "History",
    description: "Journey through time and learn about civilizations and important events.",
    color: "#ef4444", // Mars-like red
    size: 0.9,
    texture: "/placeholder.svg?height=256&width=256&text=History",
    rotation: 0.006,
    atmosphere: false,
    moons: 2,
  },
  {
    id: "arts",
    name: "Arts & Communication",
    description: "Express yourself through creative arts and effective communication.",
    color: "#f59e0b", // Jupiter-like orange/brown
    size: 1.8,
    texture: "/placeholder.svg?height=256&width=256&text=Arts",
    rotation: 0.012,
    atmosphere: true,
    moons: 4,
  },
  {
    id: "hindi",
    name: "Hindi",
    description: "Learn the Hindi language, literature, and cultural expressions.",
    color: "#d97706", // Saturn-like gold
    size: 1.6,
    texture: "/placeholder.svg?height=256&width=256&text=Hindi",
    rotation: 0.009,
    rings: true,
    moons: 3,
  },
  {
    id: "technology",
    name: "Technology",
    description: "Learn coding, digital skills, and technological innovations.",
    color: "#60a5fa", // Uranus-like light blue
    size: 1.3,
    texture: "/placeholder.svg?height=256&width=256&text=Technology",
    rotation: 0.008,
    atmosphere: true,
    moons: 2,
  },
  {
    id: "reasoning",
    name: "Situation-Based Reasoning",
    description: "Enhance critical thinking and decision-making through real-world scenarios.",
    color: "#2563eb", // Neptune-like deep blue
    size: 1.3,
    texture: "/placeholder.svg?height=256&width=256&text=Reasoning",
    rotation: 0.01,
    atmosphere: true,
    moons: 1,
  },
]

// Generate 100 modules for each subject
function generateModules(): Module[] {
  const allModules: Module[] = []

  // Generate modules for each subject
  subjects.forEach((subject) => {
    const subjectModules = generateModulesForSubject(subject.id, 100)
    allModules.push(...subjectModules)
  })

  return allModules
}

// Function to generate modules for a subject
function generateModulesForSubject(subjectId: string, count: number) {
  const modules = []

  // Define grade levels for progression
  const gradeLevels = [
    "5th Grade",
    "6th Grade",
    "7th Grade",
    "8th Grade",
    "9th Grade",
    "10th Grade",
    "11th Grade",
    "12th Grade",
  ]

  // Map difficulty to grade levels
  const difficultyMapping = {
    beginner: ["5th Grade", "6th Grade"],
    easy: ["7th Grade", "8th Grade"],
    medium: ["9th Grade", "10th Grade"],
    hard: ["11th Grade"],
    expert: ["12th Grade"],
  }

  // Generate module content based on subject
  for (let i = 1; i <= count; i++) {
    // Calculate difficulty based on module number
    let difficulty: "beginner" | "easy" | "medium" | "hard" | "expert"
    if (i <= 20) difficulty = "beginner"
    else if (i <= 40) difficulty = "easy"
    else if (i <= 70) difficulty = "medium"
    else if (i <= 90) difficulty = "hard"
    else difficulty = "expert"

    // Calculate estimated grade level
    const gradeIndex = Math.min(Math.floor(i / 13), 7) // Distribute 100 modules across 8 grade levels
    const gradeLevel = gradeLevels[gradeIndex]

    // Generate time estimate based on difficulty
    const timeMap = {
      beginner: "15-20 min",
      easy: "20-25 min",
      medium: "25-30 min",
      hard: "30-40 min",
      expert: "40-50 min",
    }

    // Generate XP points based on difficulty and module number
    const baseXP = {
      beginner: 50,
      easy: 100,
      medium: 150,
      hard: 200,
      expert: 250,
    }
    const xpBonus = Math.floor(i / 10) * 25 // Additional XP for higher modules

    // Create module title and description based on subject and module number
    let title, description, content, quiz

    switch (subjectId) {
      case "english":
        title = `English Module ${i}: ${getEnglishModuleTitle(i)}`
        description = `Enhance your English language skills through reading, writing, and comprehension. Suitable for ${gradeLevel} students.`
        content = generateEnglishContent(i)
        quiz = generateEnglishQuiz(i)
        break
      case "maths":
        title = `Mathematics Module ${i}: ${getMathModuleTitle(i)}`
        description = `Build your mathematical skills through problem-solving and logical reasoning. Suitable for ${gradeLevel} students.`
        content = generateMathContent(i)
        quiz = generateMathQuiz(i)
        break
      case "science":
        title = `Science Module ${i}: ${getScienceModuleTitle(i)}`
        description = `Explore scientific concepts and natural phenomena through observation and experimentation. Suitable for ${gradeLevel} students.`
        content = generateScienceContent(i)
        quiz = generateScienceQuiz(i)
        break
      case "history":
        title = `History Module ${i}: ${getHistoryModuleTitle(i)}`
        description = `Journey through time and learn about civilizations, important events, and cultural developments. Suitable for ${gradeLevel} students.`
        content = generateHistoryContent(i)
        quiz = generateHistoryQuiz(i)
        break
      case "arts":
        title = `Arts & Communication Module ${i}: ${getArtsModuleTitle(i)}`
        description = `Express yourself through creative arts and effective communication techniques. Suitable for ${gradeLevel} students.`
        content = generateArtsContent(i)
        quiz = generateArtsQuiz(i)
        break
      case "hindi":
        title = `Hindi Module ${i}: ${getHindiModuleTitle(i)}`
        description = `Learn Hindi language, literature, and cultural expressions. Suitable for ${gradeLevel} students.`
        content = generateHindiContent(i)
        quiz = generateHindiQuiz(i)
        break
      case "technology":
        title = `Technology Module ${i}: ${getTechnologyModuleTitle(i)}`
        description = `Develop coding skills and understand technological innovations. Suitable for ${gradeLevel} students.`
        content = generateTechnologyContent(i)
        quiz = generateTechnologyQuiz(i)
        break
      case "reasoning":
        title = `Reasoning Module ${i}: ${getReasoningModuleTitle(i)}`
        description = `Enhance critical thinking and decision-making through real-world scenarios. Suitable for ${gradeLevel} students.`
        content = generateReasoningContent(i)
        quiz = generateReasoningQuiz(i)
        break
      default:
        title = `Module ${i}`
        description = `Learn key concepts and skills. Suitable for ${gradeLevel} students.`
        content = [
          {
            title: `Introduction to Module ${i}`,
            text: `This module covers fundamental concepts suitable for ${gradeLevel} students.`,
          },
          {
            title: "Key Concepts",
            text: "You will learn essential principles and applications in this field.",
          },
          {
            title: "Practical Applications",
            text: "Discover how these concepts apply to real-world scenarios and problems.",
          },
        ]
        quiz = generateGenericQuiz(i)
    }

    // Create the module object
    const moduleObj = {
      id: `${subjectId}-${i}`,
      subjectId: subjectId,
      title: title,
      description: description,
      difficulty: difficulty,
      estimatedTime: timeMap[difficulty],
      xpPoints: baseXP[difficulty] + xpBonus,
      tags: [subjectId, difficulty, gradeLevel],
      content: content,
      quiz: quiz,
      // Add unlock requirements for all modules except the first one
      ...(i > 1 ? { unlockRequirements: [`${subjectId}-${i - 1}`] } : {}),
    }

    modules.push(moduleObj)
  }

  return modules
}

// Helper functions to generate module titles
function getEnglishModuleTitle(moduleNumber: number) {
  const titles = [
     "Alphabet Recognition",
  "Vowels and Consonants",
  "Capital and Small Letters",
  "Matching Letters",
  "Alphabetical Order",
  "Phonics Sounds",
  "Rhyming Words",
  "Simple Words Reading",
  "Word Families",
  "Sight Words",
  "Making 3-Letter Words",
  "Nouns (Naming Words)",
  "Proper Nouns",
  "Common Nouns",
  "Plural and Singular",
  "Gender Words",
  "Pronouns",
  "Articles (a, an, the)",
  "Verbs (Action Words)",
  "Opposites",
  "Adjectives (Describing Words)",
  "Prepositions (in, on, under)",
  "Simple Sentences",
  "Question Words",
  "Reading Comprehension",
  "Picture Reading",
  "Sentence Formation",
  "Use of 'This' and 'That'",
  "Use of 'These' and 'Those'",
  "Conjunctions (and, but)",
  "Verb Tense (is/am/are)",
  "Verb Tense (was/were)",
  "Use of 'has' and 'have'",
  "Use of 'do' and 'does'",
  "Parts of a Sentence",
  "Story Reading",
  "Story Structure (Beginning, Middle, End)",
  "Listening Comprehension",
  "Reading with Expression",
  "Picture Description",
  "Use of Capital Letters",
  "Use of Full Stop",
  "Use of Question Mark",
  "Use of Exclamation Mark",
  "Writing Your Name",
  "Writing Short Words",
  "Writing Simple Sentences",
  "Writing My Family",
  "Writing About Myself",
  "Writing About My Pet",
  "My Favorite Toy",
  "My School",
  "Things I Like",
  "Action Words in a Sentence",
  "Describe the Picture",
  "Animals Vocabulary",
  "Fruits Vocabulary",
  "Vegetables Vocabulary",
  "Colors Vocabulary",
  "Weather Words",
  "Days of the Week",
  "Months of the Year",
  "Body Parts Vocabulary",
  "Matching Words to Pictures",
  "Vocabulary Fill in the Blanks",
  "Riddle Words (Who Am I?)",
  "Reading Aloud",
  "Listening to Instructions",
  "Circle the Correct Word",
  "Unscramble the Word",
  "Guess the Word from Clue",
  "Pick the Odd One Out",
  "Match Opposites",
  "Match Rhyming Words",
  "Match Synonyms",
  "Fill in with Correct Article",
  "Circle the Noun in a Sentence",
  "Find the Verb",
  "Choose the Right Pronoun",
  "Rewrite the Sentence",
  "Complete the Sentence",
  "Sequence Sentences",
  "Story Sequencing",
  "Use of 'Can' and 'Cannot'",
  "Use of 'Will' and 'Shall'",
  "Use of 'May' and 'Might'",
  "Simple Word Search",
  "Crossword with 3-letter Words",
  "Match Picture to Action",
  "Describe What’s Happening",
  "Use of 'Because'",
  "Use of 'So'",
  "Letter Writing to a Friend",
  "Writing a Thank You Note",
  "Writing a Greeting Card",
  "Writing an Invitation Card",
  "Essay on My Favorite Animal",
  "Poem Recitation",
  "Essay on My Dream",
  "Reading a Poem",
  "Grammar Game Activities",
  "Mini Spelling Tests",
  "My Daily Routine (Writing)",
  "What I Did on Weekend (Writing)",
  "How to Be Kind (Writing)",
  "Punctuation Practice"
  ]
  return titles[moduleNumber % titles.length]
}

function getMathModuleTitle(moduleNumber: number) {
  const titles = [
   "Counting and Number Recognition",
  "Place Value and Face Value",
  "Comparing Numbers",
  "Odd and Even Numbers",
  "Skip Counting and Patterns",
  "Basic Addition",
  "Basic Subtraction",
  "Word Problems on Addition & Subtraction",
  "Introduction to Multiplication",
  "Multiplication Tables (1–10)",
  "Basic Division",
  "Long Division and Remainders",
  "Understanding Factors",
  "Understanding Multiples",
  "Prime and Composite Numbers",
  "Highest Common Factor (HCF)",
  "Lowest Common Multiple (LCM)",
  "Introduction to Fractions",
  "Equivalent Fractions",
  "Comparing Fractions",
  "Addition of Fractions",
  "Subtraction of Fractions",
  "Multiplication of Fractions",
  "Division of Fractions",
  "Introduction to Decimals",
  "Decimal Place Values",
  "Addition of Decimals",
  "Subtraction of Decimals",
  "Multiplication of Decimals",
  "Division of Decimals",
  "Fractions to Decimals",
  "Decimals to Fractions",
  "Introduction to Percentages",
  "Converting Percentages",
  "Calculating Simple Percentages",
  "Percentage Increase & Decrease",
  "Real-life Percentage Problems",
  "Understanding Ratios",
  "Simplifying Ratios",
  "Ratio and Proportion",
  "Unitary Method",
  "Measurement Units and Tools",
  "Conversion of Units",
  "Perimeter of Shapes",
  "Area of Squares and Rectangles",
  "Word Problems on Area & Perimeter",
  "Understanding Angles",
  "Types of Angles",
  "Using a Protractor",
  "Triangles and their Types",
  "Properties of Triangles",
  "Quadrilaterals and their Properties",
  "Circles: Radius, Diameter, Circumference",
  "Area of Circle",
  "Volume and Surface Area Basics",
  "Data Collection and Organization",
  "Tally Marks and Tables",
  "Pictographs and Bar Graphs",
  "Reading Line Graphs",
  "Mean, Median, and Mode",
  "Basic Probability",
  "Patterns and Sequences",
  "Number Patterns",
  "Symmetry and Reflection",
  "Introduction to Algebra",
  "Terms and Variables",
  "Simplifying Algebraic Expressions",
  "One-Step Linear Equations",
  "Two-Step Linear Equations",
  "Solving Word Problems with Equations",
  "Linear Equations in One Variable",
  "Simple Inequalities",
  "Graphing Inequalities",
  "Algebraic Identities",
  "Polynomials and Basics",
  "Addition and Subtraction of Polynomials",
  "Multiplication of Polynomials",
  "Division of Polynomials",
  "Introduction to Coordinate Geometry",
  "Plotting Points on a Graph",
  "Basics of Geometry Proofs",
  "Lines and Angles Proofs",
  "Triangle Congruence Rules",
  "Understanding Similarity",
  "Circle Theorems",
  "Mensuration – Advanced Shapes",
  "Surface Area of Cubes and Cuboids",
  "Surface Area of Cylinders and Cones",
  "Volume of Cubes, Cones, and Spheres",
  "Applications of Mensuration",
  "Real-life Geometry Applications",
  "Basic Trigonometry Introduction",
  "Trigonometric Ratios",
  "Using Trigonometry in Right Triangles",
  "Statistics – Data Representation",
  "Probability – Real-life Examples",
  "Math Puzzles and Brain Teasers",
  "Problem Solving Strategies",
  "Math Olympiad Practice",
  "Exam Preparation & Tips",
  "Mock Quiz: Beginner Level",
  "Mock Quiz: Intermediate Level",
  "Mock Quiz: Advanced Level",
  ]
  return titles[moduleNumber % titles.length]
}

function getScienceModuleTitle(moduleNumber: number) {
  const titles = [
    "Living Things",
    "Plants and Animals",
    "Human Body",
    "Ecosystems",
    "Matter and Materials",
    "Forces and Motion",
    "Energy",
    "Light and Sound",
    "Earth and Space",
    "Weather and Climate",
    "Chemical Reactions",
    "Electricity and Magnetism",
    "Genetics",
    "Evolution",
    "Environmental Science",
    "Physics Laws",
    "Atomic Structure",
    "Periodic Table",
    "Organic Chemistry",
    "Scientific Method",
  ]
  return titles[moduleNumber % titles.length]
}

function getHistoryModuleTitle(moduleNumber: number) {
  const titles = [
    "Early Civilizations",
    "Ancient Egypt",
    "Ancient Greece",
    "Roman Empire",
    "Medieval Period",
    "Renaissance",
    "Age of Exploration",
    "Industrial Revolution",
    "World War I",
    "World War II",
    "Cold War",
    "Modern History",
    "Indian Independence",
    "Ancient India",
    "Mughal Empire",
    "British Raj",
    "Freedom Struggle",
    "Post-Independence India",
    "World Leaders",
    "Cultural History",
  ]
  return titles[moduleNumber % titles.length]
}

function getArtsModuleTitle(moduleNumber: number) {
  const titles = [
    "Drawing Basics",
    "Color Theory",
    "Painting Techniques",
    "Sculpture",
    "Music Fundamentals",
    "Dance Forms",
    "Theater Arts",
    "Film Studies",
    "Photography",
    "Digital Art",
    "Animation",
    "Graphic Design",
    "Public Speaking",
    "Debate",
    "Persuasive Communication",
    "Presentation Skills",
    "Creative Writing",
    "Poetry",
    "Storytelling",
    "Media Literacy",
  ]
  return titles[moduleNumber % titles.length]
}

function getHindiModuleTitle(moduleNumber: number) {
  const titles = [
    "वर्णमाला (Alphabet)",
    "शब्दावली (Vocabulary)",
    "वाक्य रचना (Sentence Structure)",
    "व्याकरण (Grammar)",
    "कहानी लेखन (Story Writing)",
    "पत्र लेखन (Letter Writing)",
    "निबंध (Essays)",
    "कविता (Poetry)",
    "साहित्य (Literature)",
    "महाकाव्य (Epics)",
    "नाटक (Drama)",
    "उपन्यास (Novels)",
    "हिंदी साहित्य का इतिहास (History of Hindi Literature)",
    "छंद (Meters)",
    "अलंकार (Figures of Speech)",
    "रस (Aesthetics)",
    "हिंदी भाषा का विकास (Development of Hindi Language)",
    "बोलियाँ (Dialects)",
    "हिंदी में अनुवाद (Translation in Hindi)",
    "समकालीन हिंदी साहित्य (Contemporary Hindi Literature)",
  ]
  return titles[moduleNumber % titles.length]
}

function getTechnologyModuleTitle(moduleNumber: number) {
  const titles = [
    "Computer Basics",
    "Internet Fundamentals",
    "Digital Literacy",
    "Typing Skills",
    "Algorithms",
    "Programming Logic",
    "HTML Basics",
    "CSS Fundamentals",
    "JavaScript Introduction",
    "App Development",
    "Game Design",
    "Robotics",
    "Artificial Intelligence",
    "Cybersecurity",
    "Data Science",
    "Web Development",
    "Mobile Development",
    "Cloud Computing",
    "Internet of Things",
    "Ethical Hacking",
  ]
  return titles[moduleNumber % titles.length]
}

function getReasoningModuleTitle(moduleNumber: number) {
  const titles = [
    "Logical Thinking",
    "Problem Solving",
    "Decision Making",
    "Critical Analysis",
    "Ethical Dilemmas",
    "Social Situations",
    "Conflict Resolution",
    "Team Dynamics",
    "Leadership Challenges",
    "Resource Management",
    "Crisis Handling",
    "Strategic Planning",
    "Emotional Intelligence",
    "Cultural Sensitivity",
    "Environmental Ethics",
    "Scientific Ethics",
    "Digital Citizenship",
    "Media Literacy",
    "Financial Decision Making",
    "Career Planning",
  ]
  return titles[moduleNumber % titles.length]
}

// Content generation functions
function generateEnglishContent(moduleNumber: number) {
  // Sample content for English modules
  const contents = [
    {
    title: "🧑‍🏫 Module 1: Introduction to Letters and Sounds – Full Concept Overview",
    text: "In this module, we focus on the foundational elements of English language learning. We begin by exploring letter recognition, the sounds of vowels and consonants, and their role in forming words. This is the first step in understanding how letters come together to form the words we use daily.",
  },
  {
    title: "🟠 What are Letters?",
    text: "Letters are the building blocks of words. The alphabet consists of 26 letters, which are divided into two categories: vowels (A, E, I, O, U) and consonants (all the other letters). Each letter has a specific sound or phoneme that it represents. For example, 'A' is pronounced as /æ/ or /a/ in different contexts.",
  },
  {
    title: "🔵 Vowels and Consonants",
    text: "Vowels are the sounds made by the letters A, E, I, O, U. These sounds are more open and produced with less restriction in the vocal tract. Consonants are the other letters in the alphabet, and their sounds are formed by obstructing airflow in the vocal tract. Understanding vowels and consonants helps in pronunciation and word formation.",
  },
  {
    title: "🟡 Alphabetical Order",
    text: "Alphabetical order is a way of arranging words or items in order based on the first letter of each word. This helps us organize information like a list or a dictionary. For example, 'Apple' comes before 'Banana' because A comes before B in the alphabet.",
  },
  {
    title: "🟢 Letter Sounds (Phonics)",
    text: "Phonics involves learning the relationship between letters and their sounds. For example, the letter 'B' makes the sound /b/ as in 'ball'. Phonics helps in decoding new words and enhances reading skills. As children learn phonics, they start recognizing patterns and sounds in words.",
  },
  {
    title: "🔴 Rhyming Words",
    text: "Rhyming words are words that have the same ending sound. For example, 'cat' and 'hat' rhyme. Recognizing rhymes helps children with reading fluency and pronunciation. Rhyming also builds phonemic awareness, which is crucial for developing spelling skills.",
  },
  {
    title: "🟣 Simple Word Formation",
    text: "In this section, we learn how to combine consonants and vowels to create simple words. For example, combining 'C' and 'A' makes 'Ca', and adding 'T' creates 'Cat'. This is the beginning of understanding how sounds combine to form meaningful words.",
  },
  {
    title: "🟤 Nouns (Naming Words)",
    text: "Nouns are words that name people, places, things, or ideas. For example, 'dog', 'school', and 'happiness' are all nouns. Recognizing and using nouns is key to constructing meaningful sentences and building vocabulary.",
  },
  {
    title: "⚪ Pronouns and Articles",
    text: "Pronouns are words that replace nouns, like 'he', 'she', 'it', 'they'. Articles, such as 'a' and 'the', are used before nouns to specify them. For example, 'a dog' vs. 'the dog'. Understanding pronouns and articles helps in sentence construction and clarity.",
  },
  {
    title: "✅ Final Thoughts",
    text: "By the end of this module, learners will:\n\n• Recognize and pronounce letters of the alphabet\n• Understand the difference between vowels and consonants\n• Be able to form simple words using letters\n• Identify and use nouns and pronouns\n• Start forming simple sentences and rhyming words\n• Build the foundation for reading and writing in English",
  },
  ]
  return contents
}

function generateMathContent(moduleNumber: number) {
  // Sample content for Math modules
  const contents = [
     {
    title: "🧮 Module 1: Counting and Number Recognition – Full Concept Overview",
    text: "Counting is the process of listing numbers in order while keeping track of the amount of items. It’s one of the first things we learn in math because it's how we understand how many objects are in a group.",
  },
  {
    title: "🟠 What is Counting?",
    text: "If there are 5 apples on the table, you count them one by one:\n1, 2, 3, 4, 5 → That means you have 5 apples.\n\nWe always start counting from 0 or 1, and the numbers increase one at a time. This increase by one is called successor (next number).",
  },
  {
    title: "🔵 Number Recognition",
    text: "Number recognition means identifying numbers by seeing, saying, and understanding their value. It’s more than just memorizing—it's about knowing what the number means.\n\nFor example:\n2 means there are two items (like 2 pens).\nWhen you see 7, your brain should quickly understand that it's the value between 6 and 8.\n\nThis is where number shapes, colors, or object association helps. Like:\n🔴🔴 = 2 red balls\n🟦🟦🟦🟦🟦 = 5 blue squares",
  },
  {
    title: "🟡 Number Names (Words)",
    text: "Just like we have names for people, numbers also have names. For example:\n1 = One\n2 = Two\n3 = Three\n10 = Ten\n15 = Fifteen\n100 = One Hundred\n\nLearning number names helps with both math reading and writing.",
  },
  {
    title: "🟢 Forward and Backward Counting",
    text: "Forward Counting: Going from small to big numbers.\nExample: 1, 2, 3, 4, 5…\nUse this when adding or moving right on a number line.\n\nBackward Counting: Going from big to small numbers.\nExample: 10, 9, 8, 7…\nUse this when subtracting or moving left on a number line.\n\nThis helps build the concept of increase (addition) and decrease (subtraction) in the future.",
  },
  {
    title: "🔴 Skip Counting",
    text: "Skip counting means counting by a number other than 1. This forms the base for multiplication tables.\n\nExamples:\nBy 2: 2, 4, 6, 8, 10…\nBy 5: 5, 10, 15, 20…\nBy 10: 10, 20, 30, 40…\n\nThis helps us count things faster and understand grouped items.",
  },
  {
    title: "🟣 Even and Odd Numbers (Intro)",
    text: "We start by explaining:\n\nEven numbers end in 0, 2, 4, 6, 8. They can be grouped into equal pairs (e.g., 4 apples = 2 pairs of 2).\n\nOdd numbers end in 1, 3, 5, 7, 9. They cannot be grouped into equal pairs completely.\n\nThis visual pairing method builds the idea of division and logic later.",
  },
  {
    title: "🟤 Visual Counting & Object Recognition",
    text: "Children and learners often understand numbers better through pictures and physical items:\n\n🧸🧸🧸 = 3 toys\n🍎🍎 = 2 apples\n\nThis builds the connection between numbers and real life.",
  },
  {
    title: "⚪ Using a Number Line",
    text: "The number line is a visual tool that shows numbers in order:\n\n0 —— 1 —— 2 —— 3 —— 4 —— 5 —— 6 —— 7 —— 8 —— 9 —— 10\nMove right = Add\nMove left = Subtract\n\nIt helps understand order, distance between numbers, and supports visual learners.",
  },
  {
    title: "✅ Final Thoughts",
    text: "By the end of this module, learners will:\n\n• Recognize numbers up to at least 100\n• Read and write number names\n• Count forward, backward, and in skips\n• Know which numbers are even or odd\n• Use visual tools like number lines or real objects\n• Build a strong number sense, which is the foundation for all future math topics",
  },
  ]
  return contents
}

function generateScienceContent(moduleNumber: number) {
  // Sample content for Science modules
  const contents = [
    {
      title: "Introduction to Science",
      text: "Science is the systematic study of the structure and behavior of the physical and natural world through observation and experiment. This module will introduce you to scientific concepts appropriate for your grade level.",
    },
    {
      title: "Key Concepts",
      text: "In this module, you will learn about scientific inquiry, natural phenomena, physical laws, and biological systems. These foundational elements will help you understand how the world works.",
    },
    {
      title: "Practical Applications",
      text: "The skills you learn in this module will help you understand natural processes, technological innovations, and environmental challenges. Scientific literacy is crucial for making informed decisions in our increasingly complex world.",
    },
  ]
  return contents
}

function generateHistoryContent(moduleNumber: number) {
  // Sample content for History modules
  const contents = [
    {
      title: "Introduction to History",
      text: "History is the study of past events, particularly human affairs. It helps us understand how societies, governments, and cultures have changed over time. This module will introduce you to historical concepts appropriate for your grade level.",
    },
    {
      title: "Key Concepts",
      text: "In this module, you will learn about significant historical periods, influential figures, major events, and cultural developments. These foundational elements will help you understand how the past has shaped our present.",
    },
    {
      title: "Practical Applications",
      text: "The skills you learn in this module will help you analyze current events, understand cultural contexts, and appreciate diverse perspectives. Historical knowledge helps us avoid repeating past mistakes and build a better future.",
    },
  ]
  return contents
}

function generateArtsContent(moduleNumber: number) {
  // Sample content for Arts modules
  const contents = [
    {
      title: "Introduction to Arts & Communication",
      text: "Arts and communication encompass various forms of creative expression and effective information exchange. This module will introduce you to concepts in visual arts, performing arts, and communication skills appropriate for your grade level.",
    },
    {
      title: "Key Concepts",
      text: "In this module, you will learn about artistic techniques, creative processes, performance skills, and communication strategies. These foundational elements will help you express ideas and connect with others.",
    },
    {
      title: "Practical Applications",
      text: "The skills you learn in this module will help you in creative pursuits, public speaking, interpersonal relationships, and professional communication. Artistic and communication abilities enhance your capacity for self-expression and understanding others.",
    },
  ]
  return contents
}

function generateHindiContent(moduleNumber: number) {
  // Sample content for Hindi modules
  const contents = [
    {
      title: "Introduction to Hindi Language",
      text: "Hindi is one of the official languages of India and is spoken by millions of people worldwide. It has a rich literary tradition and cultural significance. This module will introduce you to Hindi language concepts appropriate for your grade level.",
    },
    {
      title: "Key Concepts",
      text: "In this module, you will learn about Hindi vocabulary, grammar, reading comprehension, and writing skills. These foundational elements will help you communicate effectively in Hindi.",
    },
    {
      title: "Practical Applications",
      text: "The skills you learn in this module will help you in everyday communication, understanding Hindi literature, and appreciating Indian culture. Hindi proficiency connects you to a rich cultural heritage and millions of speakers worldwide.",
    },
  ]
  return contents
}

function generateTechnologyContent(moduleNumber: number) {
  // Sample content for Technology modules
  const contents = [
    {
      title: "Introduction to Technology",
      text: "Technology encompasses the tools, systems, and methods used to solve problems and improve our lives. Coding is a key aspect of modern technology that allows us to create software and digital solutions. This module will introduce you to technology concepts appropriate for your grade level.",
    },
    {
      title: "Key Concepts",
      text: "In this module, you will learn about digital literacy, computational thinking, programming basics, and technological innovations. These foundational elements will help you understand and create technology.",
    },
    {
      title: "Practical Applications",
      text: "The skills you learn in this module will help you use technology effectively, create digital solutions, and understand technological impacts on society. Technology proficiency is essential in our increasingly digital world.",
    },
  ]
  return contents
}

function generateReasoningContent(moduleNumber: number) {
  // Sample content for Reasoning modules
  const contents = [
    {
      title: "Introduction to Situation-Based Reasoning",
      text: "Situation-based reasoning involves analyzing real-world scenarios to make logical, ethical, and effective decisions. It enhances critical thinking and problem-solving abilities. This module will introduce you to reasoning concepts appropriate for your grade level.",
    },
    {
      title: "Key Concepts",
      text: "In this module, you will learn about logical analysis, ethical considerations, decision-making frameworks, and problem-solving strategies. These foundational elements will help you navigate complex situations.",
    },
    {
      title: "Practical Applications",
      text: "The skills you learn in this module will help you make better decisions in personal life, academic settings, and future professional environments. Strong reasoning abilities are valuable in all aspects of life and prepare you for future challenges.",
    },
  ]
  return contents
}

// Quiz generation functions
function generateEnglishQuiz(moduleNumber: number) {
  // Sample quiz for English modules
  return [
    {
    question: "Which letter comes right after 'A' in the alphabet?",
    options: ["B", "C", "D", "E"],
    correctAnswer: 0,
    explanationText: "'B' comes right after 'A' in the English alphabet.",
  },
  {
    question: "Which of these words is a noun?",
    options: ["Run", "Jump", "Happiness", "Quickly"],
    correctAnswer: 2,
    explanationText: "Happiness is a noun as it is the name of a feeling or state.",
  },
  {
    question: "What sound does the letter 'M' make?",
    options: ["/b/", "/m/", "/t/", "/k/"],
    correctAnswer: 1,
    explanationText: "The letter 'M' makes the /m/ sound, like in 'man'.",
  },
  {
    question: "Which word is a pronoun?",
    options: ["Dog", "She", "Apple", "Tree"],
    correctAnswer: 1,
    explanationText: "'She' is a pronoun because it replaces a noun (like the name of a person).",
  },
  {
    question: "Which of these is the correct plural form of 'cat'?",
    options: ["Cat", "Cats", "Cattes", "Catty"],
    correctAnswer: 1,
    explanationText: "The plural form of 'cat' is 'cats'.",
  },
  {
    question: "Which of these is a consonant?",
    options: ["A", "E", "I", "B"],
    correctAnswer: 3,
    explanationText: "'B' is a consonant because it is not a vowel (A, E, I, O, U).",
  },
  {
    question: "Which letter comes before 'D' in the alphabet?",
    options: ["C", "B", "A", "E"],
    correctAnswer: 0,
    explanationText: "'C' comes before 'D' in the English alphabet.",
  },
  {
    question: "What is the correct sound of the letter 'S'?",
    options: ["/s/", "/z/", "/p/", "/t/"],
    correctAnswer: 0,
    explanationText: "The letter 'S' makes the /s/ sound, like in 'snake'.",
  },
  {
    question: "Which word is an example of an adjective?",
    options: ["Red", "Jump", "Book", "He"],
    correctAnswer: 0,
    explanationText: "'Red' is an adjective because it describes a noun (like a red ball).",
  },
  {
    question: "Which of the following is a correct sentence?",
    options: ["She play football.", "She plays football.", "She playing football.", "She played footballs."],
    correctAnswer: 1,
    explanationText: "The correct sentence is 'She plays football.' because it follows proper grammar rules.",
  }
  ]
}

function generateMathQuiz(moduleNumber: number) {
  // Sample quiz for Math modules
  return [
    {
    question: "What number comes right after 7 when counting forward?",
    options: ["6", "8", "9", "10"],
    correctAnswer: 1,
    explanationText: "8 comes right after 7 when counting forward in sequence: 6, 7, 8, 9, 10.",
  },
  {
    question: "Which number is an odd number?",
    options: ["2", "4", "6", "7"],
    correctAnswer: 3,
    explanationText: "7 is odd because it cannot be divided into two equal parts.",
  },
  {
    question: "How many red balls are there? 🔴🔴🔴🔴",
    options: ["3", "4", "5", "6"],
    correctAnswer: 1,
    explanationText: "There are four red balls shown, so the answer is 4.",
  },
  {
    question: "Which number is missing in the skip counting by 5? 5, 10, ___, 20",
    options: ["12", "13", "15", "25"],
    correctAnswer: 2,
    explanationText: "Skip counting by 5 goes 5, 10, 15, 20. So the missing number is 15.",
  },
  {
    question: "Which of these is the number name for 15?",
    options: ["Fifty", "Five", "Fifteen", "Fifty-one"],
    correctAnswer: 2,
    explanationText: "The number name for 15 is Fifteen.",
  },
  {
    question: "What is the correct backward counting from 10?",
    options: ["10, 9, 8, 7", "10, 8, 6, 4", "1, 2, 3, 4", "9, 10, 11, 12"],
    correctAnswer: 0,
    explanationText: "Backward counting from 10 goes 10, 9, 8, 7.",
  },
  {
    question: "If 🧸🧸🧸🧸🧸 = ?",
    options: ["4 toys", "6 toys", "3 toys", "5 toys"],
    correctAnswer: 3,
    explanationText: "There are 5 toy emojis shown, so the answer is 5 toys.",
  },
  {
    question: "What is the correct position of number 6 on the number line?",
    options: ["Before 4", "After 7", "Between 5 and 7", "After 10"],
    correctAnswer: 2,
    explanationText: "Number 6 is between 5 and 7 on the number line.",
  },
  {
    question: "Which of these numbers is even?",
    options: ["3", "5", "8", "9"],
    correctAnswer: 2,
    explanationText: "8 is even because it ends in 8 and can be grouped in equal pairs.",
  },
  {
    question: "What does number recognition help us with?",
    options: [
      "Writing stories",
      "Identifying letters",
      "Knowing what a number means",
      "Drawing pictures"
    ],
    correctAnswer: 2,
    explanationText: "Number recognition helps us understand what a number means, not just how it looks.",
  }
  ]
}

function generateScienceQuiz(moduleNumber: number) {
  // Sample quiz for Science modules
  return [
    {
      question: "Which of the following is NOT a state of matter?",
      options: ["Solid", "Liquid", "Gas", "Energy"],
      correctAnswer: 3,
    },
    {
      question: "What is photosynthesis?",
      options: [
        "The process by which plants make their own food using sunlight",
        "The process by which plants reproduce",
        "The process by which plants absorb water",
        "The process by which plants grow taller",
      ],
      correctAnswer: 0,
    },
    {
      question: "Which of the following is a renewable resource?",
      options: ["Coal", "Natural gas", "Solar energy", "Petroleum"],
      correctAnswer: 2,
    },
    {
      question: "What is the main function of the respiratory system?",
      options: [
        "To pump blood throughout the body",
        "To digest food",
        "To exchange oxygen and carbon dioxide",
        "To filter waste from the blood",
      ],
      correctAnswer: 2,
    },
    {
      question: "Which force keeps planets in orbit around the Sun?",
      options: ["Magnetic force", "Gravitational force", "Frictional force", "Electrical force"],
      correctAnswer: 1,
    },
    {
      question: "What would happen to a plant if it was kept in complete darkness for an extended period?",
      options: [
        "It would grow faster",
        "It would produce more oxygen",
        "It would die due to inability to photosynthesize",
        "It would change color to adapt",
      ],
      correctAnswer: 2,
    },
    {
      question: "Which of the following is an example of a chemical change?",
      options: ["Ice melting", "Water evaporating", "Paper being cut", "Wood burning"],
      correctAnswer: 3,
    },
    {
      question: "What is the basic unit of heredity?",
      options: ["Cell", "Atom", "Gene", "Tissue"],
      correctAnswer: 2,
    },
    {
      question: "Which layer of Earth's atmosphere contains the ozone layer?",
      options: ["Troposphere", "Stratosphere", "Mesosphere", "Thermosphere"],
      correctAnswer: 1,
    },
    {
      question:
        "If you were to design an experiment to test the effect of fertilizer on plant growth, what would be your control group?",
      options: [
        "Plants with double the fertilizer",
        "Plants with half the fertilizer",
        "Plants with no fertilizer",
        "Plants with different types of fertilizer",
      ],
      correctAnswer: 2,
    },
  ]
}

function generateHistoryQuiz(moduleNumber: number) {
  // Sample quiz for History modules
  return [
    {
      question: "Which civilization built the Great Pyramids of Giza?",
      options: ["Mesopotamian", "Egyptian", "Greek", "Roman"],
      correctAnswer: 1,
    },
    {
      question: "Who led India's non-violent movement for independence from British rule?",
      options: ["Jawaharlal Nehru", "Subhas Chandra Bose", "Mahatma Gandhi", "Bhagat Singh"],
      correctAnswer: 2,
    },
    {
      question: "Which event marked the beginning of World War I?",
      options: [
        "The assassination of Archduke Franz Ferdinand",
        "The invasion of Poland",
        "The bombing of Pearl Harbor",
        "The Russian Revolution",
      ],
      correctAnswer: 0,
    },
    {
      question: "What was the main purpose of the Silk Road?",
      options: ["Military conquest", "Religious pilgrimage", "Trade and cultural exchange", "Scientific exploration"],
      correctAnswer: 2,
    },
    {
      question: "Which empire was ruled by Ashoka the Great?",
      options: ["Mughal Empire", "Maurya Empire", "Gupta Empire", "Vijayanagara Empire"],
      correctAnswer: 1,
    },
    {
      question: "What significant event occurred in India in 1947?",
      options: [
        "The First War of Independence",
        "The Jallianwala Bagh Massacre",
        "Independence and Partition",
        "The formation of the Indian National Congress",
      ],
      correctAnswer: 2,
    },
    {
      question: "Which of the following was NOT one of the ancient world's Seven Wonders?",
      options: [
        "The Great Pyramid of Giza",
        "The Hanging Gardens of Babylon",
        "The Taj Mahal",
        "The Colossus of Rhodes",
      ],
      correctAnswer: 2,
    },
    {
      question: "Who was the first Emperor of the Mughal Empire in India?",
      options: ["Akbar", "Babur", "Shah Jahan", "Aurangzeb"],
      correctAnswer: 1,
    },
    {
      question: "What was the significance of the Quit India Movement?",
      options: [
        "It was a peaceful protest against salt taxes",
        "It was a call for immediate independence from British rule",
        "It was a movement for women's rights in India",
        "It was a campaign for Hindu-Muslim unity",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "If you were living during the Indus Valley Civilization, what technological advancement would you most likely have benefited from?",
      options: ["Electricity", "Steam engines", "Advanced urban planning and drainage systems", "Gunpowder weapons"],
      correctAnswer: 2,
    },
  ]
}

function generateArtsQuiz(moduleNumber: number) {
  // Sample quiz for Arts modules
  return [
    {
      question: "Which of the following is a primary color?",
      options: ["Green", "Orange", "Purple", "Blue"],
      correctAnswer: 3,
    },
    {
      question: "What is the term for the art of beautiful handwriting?",
      options: ["Typography", "Calligraphy", "Iconography", "Lithography"],
      correctAnswer: 1,
    },
    {
      question: "Which musical instrument belongs to the percussion family?",
      options: ["Flute", "Violin", "Drums", "Guitar"],
      correctAnswer: 2,
    },
    {
      question: "What is the purpose of body language in communication?",
      options: [
        "To replace verbal communication entirely",
        "To contradict verbal messages",
        "To enhance and support verbal communication",
        "To confuse the audience",
      ],
      correctAnswer: 2,
    },
    {
      question: "Which of the following is a classical Indian dance form?",
      options: ["Ballet", "Salsa", "Kathak", "Tango"],
      correctAnswer: 2,
    },
    {
      question: "What technique involves creating an image by cutting away parts of a surface?",
      options: ["Painting", "Carving", "Collage", "Weaving"],
      correctAnswer: 1,
    },
    {
      question: "Which of the following is most important when delivering a public speech?",
      options: [
        "Speaking as quickly as possible",
        "Using complex vocabulary",
        "Maintaining eye contact with the audience",
        "Reading directly from notes",
      ],
      correctAnswer: 2,
    },
    {
      question: "What is the rule of thirds in visual composition?",
      options: [
        "Dividing the canvas into three equal parts",
        "Using only three colors",
        "Placing key elements along lines that divide the image into thirds",
        "Including exactly three subjects in every artwork",
      ],
      correctAnswer: 2,
    },
    {
      question: "Which of the following is a traditional Indian art form?",
      options: ["Origami", "Madhubani", "Ikebana", "Batik"],
      correctAnswer: 1,
    },
    {
      question:
        "If you were creating a presentation to persuade an audience, which communication strategy would be most effective?",
      options: [
        "Using technical jargon throughout",
        "Speaking in a monotone voice",
        "Telling personal stories that relate to your message",
        "Avoiding visual aids",
      ],
      correctAnswer: 2,
    },
  ]
}

function generateHindiQuiz(moduleNumber: number) {
  // Sample quiz for Hindi modules
  return [
    {
      question: "हिंदी वर्णमाला में कितने स्वर हैं? (How many vowels are there in the Hindi alphabet?)",
      options: ["10", "11", "12", "13"],
      correctAnswer: 1,
    },
    {
      question: "'अनुस्वार' का चिन्ह क्या है? (What is the symbol for 'Anusvara'?)",
      options: ["ः", "ं", "ँ", "्"],
      correctAnswer: 1,
    },
    {
      question: "निम्न में से कौन सा शब्द स्त्रीलिंग है? (Which of the following words is feminine?)",
      options: ["घर", "पुस्तक", "आम", "देश"],
      correctAnswer: 1,
    },
    {
      question: "'प्रेमचंद' किस विधा के लिए प्रसिद्ध हैं? (For which literary form is Premchand famous?)",
      options: ["कविता (Poetry)", "नाटक (Drama)", "कहानी और उपन्यास (Stories and Novels)", "निबंध (Essays)"],
      correctAnswer: 2,
    },
    {
      question: "निम्न में से कौन सा वाक्य शुद्ध है? (Which of the following sentences is correct?)",
      options: ["मैं स्कूल जाता है।", "मैं स्कूल जाता हूँ।", "मैं स्कूल जाती है।", "मैं स्कूल जाते हैं।"],
      correctAnswer: 1,
    },
    {
      question: "'रामचरितमानस' के रचयिता कौन हैं? (Who is the author of 'Ramcharitmanas'?)",
      options: ["कबीरदास", "सूरदास", "तुलसीदास", "मीराबाई"],
      correctAnswer: 2,
    },
    {
      question: "निम्न में से कौन सा शब्द तत्सम है? (Which of the following words is Tatsam?)",
      options: ["आँख", "काम", "पुस्तक", "घर"],
      correctAnswer: 2,
    },
    {
      question: "'दीवार' का पर्यायवाची शब्द क्या है? (What is a synonym for 'Deewar'?)",
      options: ["भित्ति", "द्वार", "छत", "खिड़की"],
      correctAnswer: 0,
    },
    {
      question: "निम्न में से कौन सा वाक्य भूतकाल में है? (Which of the following sentences is in past tense?)",
      options: ["वह खाना खाएगा।", "वह खाना खा रहा है।", "वह खाना खाता है।", "उसने खाना खाया।"],
      correctAnswer: 3,
    },
    {
      question:
        "यदि आप एक कविता लिख रहे हों, तो निम्न में से किस तत्व पर सबसे अधिक ध्यान देंगे? (If you were writing a poem, which element would you focus on the most?)",
      options: [
        "लंबे वाक्य (Long sentences)",
        "लय और छंद (Rhythm and meter)",
        "तथ्यात्मक जानकारी (Factual information)",
        "वैज्ञानिक शब्दावली (Scientific vocabulary)",
      ],
      correctAnswer: 1,
    },
  ]
}

function generateTechnologyQuiz(moduleNumber: number) {
  // Sample quiz for Technology modules
  return [
    {
      question: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "High Tech Modern Language",
        "Hyper Transfer Markup Language",
        "Home Tool Markup Language",
      ],
      correctAnswer: 0,
    },
    {
      question: "Which of the following is NOT a programming language?",
      options: ["Java", "Python", "HTML", "C++"],
      correctAnswer: 2,
    },
    {
      question: "What is an algorithm?",
      options: [
        "A type of computer virus",
        "A step-by-step procedure for solving a problem",
        "A hardware component",
        "A type of computer memory",
      ],
      correctAnswer: 1,
    },
    {
      question: "What does CPU stand for?",
      options: [
        "Central Processing Unit",
        "Computer Personal Unit",
        "Central Program Utility",
        "Central Processor Undertaking",
      ],
      correctAnswer: 0,
    },
    {
      question: "Which of the following is an example of an input device?",
      options: ["Printer", "Monitor", "Keyboard", "Speaker"],
      correctAnswer: 2,
    },
    {
      question: "What is the purpose of a loop in programming?",
      options: [
        "To store data",
        "To repeat a set of instructions",
        "To connect to the internet",
        "To create a user interface",
      ],
      correctAnswer: 1,
    },
    {
      question: "What is the function of an 'if' statement in programming?",
      options: [
        "To repeat code",
        "To define a variable",
        "To make decisions based on conditions",
        "To import libraries",
      ],
      correctAnswer: 2,
    },
    {
      question: "Which of the following is a valid variable name in most programming languages?",
      options: ["2myVariable", "my-variable", "myVariable", "my variable"],
      correctAnswer: 2,
    },
    {
      question: "What is the purpose of comments in code?",
      options: [
        "To make the code run faster",
        "To explain the code to humans reading it",
        "To create output for users",
        "To debug errors automatically",
      ],
      correctAnswer: 1,
    },
    {
      question: "If you were designing a website, which principle would be most important for good user experience?",
      options: [
        "Using as many animations as possible",
        "Making the text as small as possible to fit more content",
        "Making navigation intuitive and easy to use",
        "Using as many different fonts as possible",
      ],
      correctAnswer: 2,
    },
  ]
}

function generateReasoningQuiz(moduleNumber: number) {
  // Sample quiz for Reasoning modules
  return [
    {
      question: "You see a classmate struggling with a heavy bag. What would be the most appropriate action?",
      options: [
        "Ignore them as it's not your problem",
        "Laugh at their struggle",
        "Offer to help carry the bag",
        "Tell them they should pack lighter next time",
      ],
      correctAnswer: 2,
    },
    {
      question: "If you find a wallet with money and ID, what should you do?",
      options: [
        "Keep the money and throw away the wallet",
        "Keep the wallet without telling anyone",
        "Return the wallet to the owner or appropriate authority",
        "Take the money and return the empty wallet",
      ],
      correctAnswer: 2,
    },
    {
      question: "Your friend wants to copy your homework. What is the best response?",
      options: [
        "Let them copy it completely",
        "Refuse and report them to the teacher",
        "Refuse but offer to help them understand the material",
        "Ignore them completely",
      ],
      correctAnswer: 2,
    },
    {
      question: "You notice a group of students bullying a classmate. What should you do?",
      options: [
        "Join in the bullying",
        "Ignore it as it's not your business",
        "Secretly record it to post online",
        "Report it to a teacher or trusted adult",
      ],
      correctAnswer: 3,
    },
    {
      question: "You accidentally break something at a friend's house. What should you do?",
      options: [
        "Hide it and say nothing",
        "Blame someone else",
        "Apologize and offer to replace or fix it",
        "Leave immediately",
      ],
      correctAnswer: 2,
    },
    {
      question: "If you see someone posting false information online, what is the most responsible action?",
      options: [
        "Share it with more people",
        "Ignore it completely",
        "Politely provide correct information with reliable sources",
        "Mock the person for being wrong",
      ],
      correctAnswer: 2,
    },
    {
      question: "Your team member isn't contributing to a group project. What's the best approach?",
      options: [
        "Do their work for them",
        "Exclude their name from the project",
        "Talk to them privately about their contribution",
        "Complain about them to everyone else",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "You have limited time to study for two exams. One is worth 30% of your grade, the other 10%. How should you allocate your time?",
      options: [
        "Study only for the 30% exam",
        "Study only for the 10% exam",
        "Split time equally between both",
        "Spend more time on the 30% exam but still prepare for the 10% exam",
      ],
      correctAnswer: 3,
    },
    {
      question: "You witness a friend cheating on a test. What is the most ethical response?",
      options: [
        "Join them in cheating",
        "Ignore it completely",
        "Talk to them privately after class about why cheating is wrong",
        "Shout out during the test that they are cheating",
      ],
      correctAnswer: 2,
    },
    {
      question:
        "If you were faced with a difficult ethical dilemma, what would be the best approach to making a decision?",
      options: [
        "Do whatever benefits you the most",
        "Do whatever is easiest",
        "Consider the consequences of each option and how they affect all involved",
        "Always follow the majority opinion",
      ],
      correctAnswer: 2,
    },
  ]
}

function generateGenericQuiz(moduleNumber: number) {
  // Generic quiz for any module
  return [
    {
      question: "What is the main focus of this module?",
      options: [
        "Understanding fundamental concepts",
        "Memorizing facts without context",
        "Skipping important information",
        "None of the above",
      ],
      correctAnswer: 0,
    },
    {
      question: "Why is this subject important?",
      options: [
        "It has no practical applications",
        "It's only important for tests",
        "It helps develop critical thinking and problem-solving skills",
        "It's only relevant to specialists",
      ],
      correctAnswer: 2,
    },
    {
      question: "What is the best approach to learning this topic?",
      options: [
        "Memorize everything without understanding",
        "Skip difficult concepts",
        "Practice regularly and apply concepts to real problems",
        "Learn only the minimum required",
      ],
      correctAnswer: 2,
    },
    {
      question: "How can you apply the knowledge from this module in real life?",
      options: [
        "You can't - it's purely theoretical",
        "Only in very specific professional settings",
        "In everyday situations requiring critical thinking",
        "Only when taking tests",
      ],
      correctAnswer: 2,
    },
    {
      question: "What skill is most important when studying this subject?",
      options: ["Memorization only", "Understanding concepts and their applications", "Speed-reading", "Handwriting"],
      correctAnswer: 1,
    },
    {
      question: "How does this module connect to other subjects?",
      options: [
        "It doesn't connect to any other subjects",
        "It only connects to closely related subjects",
        "It has interdisciplinary connections to many fields",
        "Connections to other subjects are not important",
      ],
      correctAnswer: 2,
    },
    {
      question: "What is the value of studying this topic?",
      options: [
        "It has no value beyond passing tests",
        "It only has value for certain careers",
        "It develops critical thinking and knowledge applicable to many situations",
        "It only has historical value",
      ],
      correctAnswer: 2,
    },
    {
      question: "How should you approach difficult concepts in this module?",
      options: [
        "Skip them entirely",
        "Memorize without understanding",
        "Break them down into smaller parts and seek help when needed",
        "Focus only on the easy concepts",
      ],
      correctAnswer: 2,
    },
    {
      question: "What is the relationship between theory and practice in this subject?",
      options: [
        "They are completely separate",
        "Theory has no practical applications",
        "Practice doesn't require theoretical understanding",
        "Theory provides the foundation for practical applications",
      ],
      correctAnswer: 3,
    },
    {
      question: "How can you best demonstrate mastery of this module?",
      options: [
        "By memorizing all facts",
        "By applying concepts to solve new problems",
        "By skipping difficult parts",
        "By studying only what will be on the test",
      ],
      correctAnswer: 1,
    },
  ]
}

const modules = generateModules()

// Helper functions to access data
export function getSubjectById(id: string): Subject | undefined {
  return subjects.find((subject) => subject.id === id)
}

export function getModuleById(id: string): Module | undefined {
  return modules.find((module) => module.id === id)
}

export function getModulesBySubjectId(subjectId: string): Module[] {
  return modules.filter((module) => module.subjectId === subjectId)
}

export function getAllModules(): Module[] {
  return modules
}

// Get modules by difficulty
export function getModulesByDifficulty(difficulty: string): Module[] {
  return modules.filter((module) => module.difficulty === difficulty)
}

// Get modules by tag
export function getModulesByTag(tag: string): Module[] {
  return modules.filter((module) => module.tags?.includes(tag))
}

// Get recommended modules based on completed modules
export function getRecommendedModules(completedModuleIds: string[], limit = 5): Module[] {
  // Get all completed modules
  const completedModules = completedModuleIds.map((id) => getModuleById(id)).filter(Boolean) as Module[]

  // Get subjects the user has shown interest in
  const subjectInterests = new Map<string, number>()
  completedModules.forEach((module) => {
    const count = subjectInterests.get(module.subjectId) || 0
    subjectInterests.set(module.subjectId, count + 1)
  })

  // Sort subjects by interest level
  const sortedSubjects = Array.from(subjectInterests.entries())
    .sort((a, b) => b[1] - a[1])
    .map((entry) => entry[0])

  // Get modules from interested subjects that haven't been completed
  const recommendations: Module[] = []

  // First, try to get modules from the same subjects
  for (const subjectId of sortedSubjects) {
    const subjectModules = getModulesBySubjectId(subjectId)
      .filter((module) => !completedModuleIds.includes(module.id))
      .sort((a, b) => {
        // Sort by difficulty progression
        const difficultyOrder = { beginner: 0, easy: 1, medium: 2, hard: 3, expert: 4 }
        return (
          difficultyOrder[a.difficulty as keyof typeof difficultyOrder] -
          difficultyOrder[b.difficulty as keyof typeof difficultyOrder]
        )
      })

    recommendations.push(...subjectModules.slice(0, limit - recommendations.length))

    if (recommendations.length >= limit) break
  }

  // If we still need more recommendations, add modules from other subjects
  if (recommendations.length < limit) {
    const otherSubjects = subjects.map((subject) => subject.id).filter((id) => !sortedSubjects.includes(id))

    for (const subjectId of otherSubjects) {
      const subjectModules = getModulesBySubjectId(subjectId)
        .filter(
          (module) =>
            !completedModuleIds.includes(module.id) &&
            (module.difficulty === "beginner" || module.difficulty === "easy"),
        )
        .slice(0, limit - recommendations.length)

      recommendations.push(...subjectModules)

      if (recommendations.length >= limit) break
    }
  }

  return recommendations.slice(0, limit)
}
