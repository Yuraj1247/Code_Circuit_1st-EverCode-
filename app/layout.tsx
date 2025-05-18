import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { LearnverseThemeProvider } from "@/contexts/theme-context"
import { PlatformChatbot } from "@/components/platform-chatbot"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LearnVerse - Interactive Learning Platform",
  description: "A gamified learning platform with interactive subjects and themed worlds",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <LearnverseThemeProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
              <PlatformChatbot />
            </div>
          </LearnverseThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'