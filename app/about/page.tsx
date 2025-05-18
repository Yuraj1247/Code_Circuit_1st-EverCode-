import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Award, Lightbulb, Code, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 px-4 bg-black text-white">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
            About LearnVerse
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Transforming education through immersive, gamified learning experiences
          </p>
        </div>

        <Card className="mb-12 bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-purple-500" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <p>
              LearnVerse was founded with a simple yet powerful mission: to make learning engaging, accessible, and
              effective for everyone. We believe that education should be an adventure, not a chore.
            </p>
            <p>
              By combining cutting-edge technology with proven educational principles, we've created a platform that
              transforms traditional learning into an immersive journey through knowledge. Our approach is designed to
              spark curiosity, foster deep understanding, and make the learning process genuinely enjoyable.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-purple-500" />
                Our Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                LearnVerse is built by a diverse team of educators, developers, designers, and learning specialists who
                share a passion for revolutionizing education.
              </p>
              <p>
                Our team combines decades of experience in education with technical expertise to create a platform
                that's both pedagogically sound and technologically advanced.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5 text-purple-500" />
                Our Approach
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                We believe that effective learning happens when students are engaged, motivated, and able to see their
                progress. That's why we've built LearnVerse around three core principles:
              </p>
              <ul className="space-y-2 list-disc pl-5">
                <li>Immersive, theme-based learning environments</li>
                <li>Gamification that rewards progress and achievement</li>
                <li>Adaptive content that grows with the learner</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center">Our Values</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
                Innovation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We constantly push the boundaries of what's possible in educational technology, seeking new ways to make
                learning more effective and engaging.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Code className="mr-2 h-5 w-5 text-green-500" />
                Quality
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We're committed to excellence in both our educational content and our technical implementation,
                delivering a platform that's reliable, intuitive, and effective.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Heart className="mr-2 h-5 w-5 text-red-500" />
                Accessibility
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We believe that quality education should be available to everyone, regardless of background or
                circumstances. We strive to make LearnVerse accessible to all learners.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center">Join Our Journey</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <p>
              LearnVerse is more than just a platform—it's a community of learners, educators, and innovators who share
              a vision of what education can be. We're constantly growing and evolving, and we invite you to be part of
              our journey.
            </p>
            <p>
              Whether you're a student looking to expand your horizons, an educator seeking new tools for your
              classroom, or simply someone who believes in the power of learning, there's a place for you in the
              LearnVerse community.
            </p>
            <p className="font-medium">
              Thank you for joining us as we reimagine education for the digital age. Together, we can unlock the full
              potential of every learner.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
