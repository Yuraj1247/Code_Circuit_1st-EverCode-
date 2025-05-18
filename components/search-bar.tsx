"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { getAllModules, getSubjectById } from "@/lib/data"

export function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Close search results when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearching(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (searchTerm.trim().length > 1) {
      const modules = getAllModules()
      const filteredModules = modules.filter(
        (module) =>
          module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          module.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )

      setSearchResults(filteredModules.slice(0, 5)) // Limit to 5 results
      setIsSearching(true)
    } else {
      setSearchResults([])
      setIsSearching(false)
    }
  }, [searchTerm])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim().length > 0) {
      // In a real app, you might navigate to a search results page
      console.log("Searching for:", searchTerm)
    }
  }

  const handleResultClick = (moduleId: string) => {
    router.push(`/module/${moduleId}`)
    setSearchTerm("")
    setIsSearching(false)
  }

  const clearSearch = () => {
    setSearchTerm("")
    setIsSearching(false)
  }

  return (
    <div className="relative" ref={searchRef}>
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="text"
          placeholder="Search modules..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10"
        />
        {searchTerm ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        ) : (
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        )}
      </form>

      {isSearching && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
          {searchResults.map((module) => {
            const subject = getSubjectById(module.subjectId)

            return (
              <div
                key={module.id}
                className="p-3 hover:bg-gray-800 cursor-pointer border-b border-gray-700 last:border-b-0"
                onClick={() => handleResultClick(module.id)}
              >
                <div className="flex items-center">
                  <div
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: subject?.color || "#666" }}
                  ></div>
                  <span className="text-sm text-gray-400">{subject?.name}</span>
                </div>
                <p className="font-medium">{module.title}</p>
                <p className="text-sm text-gray-400 truncate">{module.description}</p>
              </div>
            )
          })}
        </div>
      )}

      {isSearching && searchTerm.trim().length > 1 && searchResults.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50 p-4 text-center">
          <p>No modules found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  )
}
