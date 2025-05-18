"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SpaceIcon as Planet, Castle, Terminal, Palette } from "lucide-react"
import { useLearnverseTheme } from "@/contexts/theme-context"

export function ThemeSwitcher() {
  const { theme, setTheme } = useLearnverseTheme()
  const [open, setOpen] = useState(false)

  const themes = [
    {
      id: "solar",
      name: "Solar System",
      icon: Planet,
    },
    {
      id: "kingdom",
      name: "Enchanted Kingdom",
      icon: Castle,
    },
    {
      id: "terminal",
      name: "Terminal Hacker World",
      icon: Terminal,
    },
  ]

  const getCurrentThemeName = () => {
    switch (theme) {
      case "solar":
        return "Solar System"
      case "kingdom":
        return "Enchanted Kingdom"
      case "terminal":
        return "Terminal Hacker World"
      default:
        return "Select Theme"
    }
  }

  const getCurrentThemeIcon = () => {
    switch (theme) {
      case "solar":
        return <Planet className="h-4 w-4" />
      case "kingdom":
        return <Castle className="h-4 w-4" />
      case "terminal":
        return <Terminal className="h-4 w-4" />
      default:
        return <Palette className="h-4 w-4" />
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          {getCurrentThemeIcon()}
          <span className="hidden md:inline">{getCurrentThemeName()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((item) => (
          <DropdownMenuItem
            key={item.id}
            className={`flex items-center gap-2 cursor-pointer ${theme === item.id ? "bg-accent" : ""}`}
            onClick={() => {
              setTheme(item.id as any)
              setOpen(false)
            }}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
