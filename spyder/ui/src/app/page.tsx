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
import { useWebSocketData } from "@/hooks/use-websocket-data"

/**
 * Page component that displays DAQ technical assessment. Contains the LiveValue component as well as page header and labels.
 *
 * @returns {JSX.Element} The rendered page component.
 */
export default function Page(): JSX.Element {
  const { theme, setTheme } = useTheme()
  const { temperature, temperatureData, connectionStatus, resetLayout, layoutKey } = useWebSocketData()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Render loading state if not mounted yet
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="px-5 h-20 flex items-center gap-5 border-b">
          <div className="h-12 w-36" /> {/* Placeholder for logo */}
          <h1 className="text-foreground text-xl font-semibold">DAQ Technical Assessment</h1>
        </header>
        <main className="flex-grow p-4 md:p-6">
          {/* Loading state or placeholder for widgets */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* Placeholder boxes */}
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
        <DashboardLayout
          temperature={temperature}
          temperatureData={temperatureData}
          layoutKey={layoutKey}
        />
      </main>
    </div>
  )
}