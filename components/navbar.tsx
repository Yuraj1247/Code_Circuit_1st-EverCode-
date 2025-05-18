"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, User, Search, BarChart3, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/search-bar"
import { useMobile } from "@/hooks/use-mobile"
import { useLearnverseTheme, themeDetails } from "@/contexts/theme-context" // Import themeDetails

export function Navbar() {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme } = useLearnverseTheme()

  const themeInfo = themeDetails[theme]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false)
    setIsSearchOpen(false)
  }, [pathname])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  const getNavItemClass = (path: string) => {
    const isActive = pathname === path
    return `px-4 py-2 rounded-md transition-colors ${
      isActive ? "bg-gray-800 text-white font-medium" : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`
  }

  const getThemeColors = () => {
    switch (theme) {
      case "solar":
        return "from-purple-900/80 to-black"
      case "kingdom":
        return "from-indigo-900/80 to-black"
      case "terminal":
        return "from-green-900/80 to-black"
      default:
        return "from-purple-900/80 to-black"
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2 bg-gradient-to-b " + getThemeColors() : "py-4 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <BookOpen className={`h-8 w-8 text-${themeInfo.primaryColor}-500 mr-2`} />
            <span
              className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${themeInfo.gradientFrom} ${themeInfo.gradientTo}`}
            >
              LearnVerse
            </span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className={getNavItemClass(link.href)}>
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right side actions */}
          <div className="flex items-center">
            {/* Search button (desktop) */}
            {!isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-white mr-2"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="h-5 w-5" />
              </Button>
            )}

            {/* Notifications */}
            <Link href="/performance">
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white mr-2">
                <BarChart3 className="h-5 w-5" />
              </Button>
            </Link>

            {/* Profile */}
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            {/* Mobile menu button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-white ml-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            )}
          </div>
        </div>

        {/* Search bar (desktop) */}
        {!isMobile && isSearchOpen && (
          <div className="mt-4 animate-fadeIn">
            <SearchBar onSearch={() => setIsSearchOpen(false)} />
          </div>
        )}

        {/* Mobile menu */}
        {isMobile && isMenuOpen && (
          <div className="mt-4 py-4 bg-gray-900 rounded-lg animate-fadeIn">
            <nav className="flex flex-col space-y-2 px-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className={getNavItemClass(link.href)}>
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 pb-1 px-2">
                <SearchBar onSearch={() => setIsMenuOpen(false)} />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
