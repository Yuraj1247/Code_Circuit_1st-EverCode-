import Link from "next/link"
import {
  BookOpen,
  GraduationCap,
  Award,
  Heart,
  Github,
  Twitter,
  Facebook,
  Instagram,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
} from "lucide-react"

export function Footer() {
  return (
    <footer className="relative mt-auto">
      {/* Decorative top border with gradient */}
      <div className="h-1 bg-gradient-to-r from-purple-600 via-cyan-500 to-purple-600"></div>

      {/* Main footer content */}
      <div className="bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1: About */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-purple-400" />
                About LearnVerse
              </h3>
              <p className="text-gray-300 mb-4">
                Transforming education through immersive, gamified learning experiences in our cosmic educational
                platform.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <Github className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <Instagram className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <ExternalLink className="mr-2 h-5 w-5 text-purple-400" />
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-purple-400 transition-colors flex items-center">
                    <span className="mr-2">•</span> Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-gray-300 hover:text-purple-400 transition-colors flex items-center"
                  >
                    <span className="mr-2">•</span> About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/achievements"
                    className="text-gray-300 hover:text-purple-400 transition-colors flex items-center"
                  >
                    <span className="mr-2">•</span> Achievements
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile"
                    className="text-gray-300 hover:text-purple-400 transition-colors flex items-center"
                  >
                    <span className="mr-2">•</span> Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-300 hover:text-purple-400 transition-colors flex items-center"
                  >
                    <span className="mr-2">•</span> Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Subjects */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <GraduationCap className="mr-2 h-5 w-5 text-purple-400" />
                Explore Subjects
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/subject/math"
                    className="text-gray-300 hover:text-purple-400 transition-colors flex items-center"
                  >
                    <span className="mr-2">•</span> Mathematics
                  </Link>
                </li>
                <li>
                  <Link
                    href="/subject/science"
                    className="text-gray-300 hover:text-purple-400 transition-colors flex items-center"
                  >
                    <span className="mr-2">•</span> Science
                  </Link>
                </li>
                <li>
                  <Link
                    href="/subject/history"
                    className="text-gray-300 hover:text-purple-400 transition-colors flex items-center"
                  >
                    <span className="mr-2">•</span> History
                  </Link>
                </li>
                <li>
                  <Link
                    href="/subject/language"
                    className="text-gray-300 hover:text-purple-400 transition-colors flex items-center"
                  >
                    <span className="mr-2">•</span> Language Arts
                  </Link>
                </li>
                <li>
                  <Link
                    href="/subject/tech"
                    className="text-gray-300 hover:text-purple-400 transition-colors flex items-center"
                  >
                    <span className="mr-2">•</span> Technology
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Mail className="mr-2 h-5 w-5 text-purple-400" />
                Contact Us
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Mail className="h-5 w-5 mr-2 text-purple-400 mt-0.5" />
                  <span className="text-gray-300">info@learnverse.edu</span>
                </li>
                <li className="flex items-start">
                  <Phone className="h-5 w-5 mr-2 text-purple-400 mt-0.5" />
                  <span className="text-gray-300">+91 1122334455</span>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 text-purple-400 mt-0.5" />
                  <span className="text-gray-300">
                    India
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Awards and Recognitions */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <h3 className="text-center text-xl font-bold mb-6 flex items-center justify-center">
              <Award className="mr-2 h-5 w-5 text-purple-400" />
              Awards & Recognition
            </h3>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="bg-gray-800 p-4 rounded-lg flex items-center">
                <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center mr-3">
                  <Award className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="font-bold">Academic Excellence Award</p>
                  <p className="text-sm text-gray-400">Highest Grade Average</p>
                </div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg flex items-center">
                <div className="w-12 h-12 rounded-full bg-cyan-900/50 flex items-center justify-center mr-3">
                  <Award className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <p className="font-bold">Best Subject Performance</p>
                  <p className="text-sm text-gray-400">Top Subject Achiever</p>
                </div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg flex items-center">
                <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center mr-3">
                  <Award className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="font-bold">Most Active User</p>
                  <p className="text-sm text-gray-400">Consistent Daily Engagement</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright section */}
        <div className="bg-black px-12 py-6">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">© 2023 LearnVerse. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">Developed by Team Evercode.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
