"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { TooltipProvider } from "@/components/ui/tooltip"
import { RotateCcw, Sun, Moon } from "lucide-react"
import { TooltipButton } from "@/components/custom/tooltip-button"
import DashboardLayout from "@/components/custom/dashboard/dashboard-layout"
import RedbackLogoDarkMode from "../../public/logo-darkmode.svg"
import RedbackLogoLightMode from "../../public/logo-lightmode.svg"
import { DataProvider, useData } from "@/contexts/data-wrapper"

/**
 * Dashboard content component that displays the main dashboard layout.
 *
 * @returns {JSX.Element} The rendered dashboard content component.
 */
function DashboardContent() {
  const { theme, setTheme } = useTheme()
  const { connectionStatus, resetLayout } = useData()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Placeholder content while loading
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="px-5 h-20 flex items-center gap-5 border-b">
          <div className="h-12 w-36 bg-muted rounded animate-pulse"></div>
          <h1 className="text-foreground text-xl font-semibold">DAQ Technical Assessment</h1>
          <div className="ml-auto flex items-center gap-2">
            <div className="h-6 w-20 bg-muted rounded-full animate-pulse"></div>
            <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
            <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
          </div>
        </header>
        <main className="flex-grow p-4 md:p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array(8).fill(0).map((_, i) => (
              <div 
                key={i}
                className="bg-muted rounded-lg shadow-sm h-64 p-4 animate-pulse flex flex-col"
              >
                <div className="h-6 w-3/4 bg-muted-foreground/20 rounded mb-4"></div>
                <div className="flex-grow flex items-center justify-center">
                  <div className="h-24 w-24 bg-muted-foreground/20 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-5 h-20 flex items-center gap-5 border-b">
        {theme === "dark" ? (
          <Image
            src={RedbackLogoDarkMode}
            className="h-12 w-auto"
            alt="Redback Racing Logo"
          />
        ) : (
          <Image
            src={RedbackLogoLightMode}
            className="h-12 w-auto"
            alt="Redback Racing Logo"
          />
        )}
        <h1 className="text-foreground text-xl font-semibold">DAQ Technical Assessment</h1>
        <Badge variant={connectionStatus === "Connected" ? "success" : "destructive"} className="ml-auto">
          {connectionStatus}
        </Badge>
        <TooltipProvider>
          <TooltipButton
            tooltip="Toggle between light and dark mode"
            onClick={toggleTheme}
            icon={theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            label={theme === "dark" ? "Light Mode" : "Dark Mode"}
          />
        </TooltipProvider>
        <TooltipProvider>
          <TooltipButton
            tooltip="Reset dashboard to default layout"
            onClick={resetLayout}
            icon={<RotateCcw className="h-4 w-4" />}
            label="Reset Layout"
          />
        </TooltipProvider>
      </header>
      <main className="flex-grow p-4 md:p-6 overflow-hidden">
        <DashboardLayout />
      </main>
    </div>
  )
}

/**
 * Page component that displays DAQ technical assessment. Contains the LiveValue component as well as page header and labels.
 *
 * @returns {JSX.Element} The rendered page component.
 */
export default function Page(): JSX.Element {
  return (
    <DataProvider>
      <DashboardContent />
    </DataProvider>
  )
}