"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import useWebSocket, { ReadyState } from "react-use-websocket"

const WS_URL = "ws://localhost:8080"
const MAX_DATA_POINTS = 50

interface VehicleData {
  battery_temperature: number
  timestamp: number
}

interface TemperatureDataPoint {
  temperature: number
  timestamp: number
}

interface DataContextType {
  temperature: number
  temperatureData: TemperatureDataPoint[]
  connectionStatus: string
  layouts: any
  layoutKey: number
  saveLayout: (currentLayout: any, allLayouts: any) => void
  resetLayout: () => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

interface DataProviderProps {
  children: ReactNode
}

/**
 * Data provider component to manage the application data.
 *
 * @param {DataProviderProps} props The component props.
 * @returns {JSX.Element} The rendered data provider component.
 */
export function DataProvider({ children }: DataProviderProps) {
  const [temperature, setTemperature] = useState<number>(0)
  const [connectionStatus, setConnectionStatus] = useState<string>("Disconnected")
  const [temperatureData, setTemperatureData] = useState<TemperatureDataPoint[]>([])
  const [layoutKey, setLayoutKey] = useState<number>(0)
  
  const { lastJsonMessage, readyState } = useWebSocket(WS_URL, {
    share: false,
    shouldReconnect: () => true,
  })

  const defaultLayouts = {
    lg: [
      { i: "temperature-chart", x: 0, y: 0, w: 8, h: 8 },
      { i: "live-temperature", x: 8, y: 0, w: 4, h: 8 },
      { i: "panel-1", x: 0, y: 8, w: 6, h: 6 },
      { i: "panel-2", x: 6, y: 8, w: 6, h: 6 }
    ],
    md: [
      { i: "temperature-chart", x: 0, y: 0, w: 8, h: 8 },
      { i: "live-temperature", x: 8, y: 0, w: 4, h: 8 },
      { i: "panel-1", x: 0, y: 8, w: 6, h: 6 },
      { i: "panel-2", x: 6, y: 8, w: 6, h: 6 }
    ],
    sm: [
      { i: "temperature-chart", x: 0, y: 0, w: 12, h: 8 },
      { i: "live-temperature", x: 0, y: 8, w: 12, h: 8 },
      { i: "panel-1", x: 0, y: 16, w: 12, h: 6 },
      { i: "panel-2", x: 0, y: 22, w: 12, h: 6 }
    ],
    xs: [
      { i: "temperature-chart", x: 0, y: 0, w: 12, h: 8 },
      { i: "live-temperature", x: 0, y: 8, w: 12, h: 8 },
      { i: "panel-1", x: 0, y: 16, w: 12, h: 6 },
      { i: "panel-2", x: 0, y: 22, w: 12, h: 6 }
    ]
  }
  
  const [layouts, setLayouts] = useState(defaultLayouts)

  /**
   * Effect hook to handle WebSocket connection state changes.
   */
  useEffect(() => {
    switch (readyState) {
      case ReadyState.OPEN:
        console.log("Connected to streaming service")
        setConnectionStatus("Connected")
        break
      case ReadyState.CLOSED:
        console.log("Disconnected from streaming service")
        setConnectionStatus("Disconnected")
        break
      case ReadyState.CONNECTING:
        setConnectionStatus("Connecting")
        break
      default:
        setConnectionStatus("Disconnected")
        break
    }
  }, [readyState])

  /**
   * Effect hook to handle incoming WebSocket messages.
   */
  useEffect(() => {
    console.log("Received: ", lastJsonMessage)
    if (lastJsonMessage === null) {
      return
    }
    
    const data = lastJsonMessage as VehicleData
    setTemperature(data.battery_temperature)

    // Add to temperature history (for chart display)
    setTemperatureData(prevData => {
      const newDataPoint = {
        temperature: data.battery_temperature,
        timestamp: data.timestamp,
      }
      
      // Keep only the latest MAX_DATA_POINTS readings
      const updatedData = [...prevData, newDataPoint]
      if (updatedData.length > MAX_DATA_POINTS) {
        return updatedData.slice(-MAX_DATA_POINTS)
      }
      return updatedData
    })
  }, [lastJsonMessage])

  /**
   * Effect hook to load saved layout from localStorage.
   */
  useEffect(() => {
    const savedLayout = localStorage.getItem('dashboard-layout')
    if (savedLayout) {
      try {
        setLayouts(JSON.parse(savedLayout))
      } catch (e) {
        console.error('Error loading saved layout:', e)
      }
    }
  }, [])

  const saveLayout = (currentLayout: any, allLayouts: any) => {
    localStorage.setItem('dashboard-layout', JSON.stringify(allLayouts))
  }

  const resetLayout = () => {
    setLayouts(defaultLayouts)
    localStorage.removeItem('dashboard-layout')
    setLayoutKey(prevKey => prevKey + 1)
  }

  /**
   * The context value to provide to the children.
   */
  const contextValue: DataContextType = {
    temperature,
    temperatureData,
    connectionStatus,
    layouts,
    layoutKey,
    saveLayout,
    resetLayout
  }

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  )
}

/**
 * Custom hook to use the data context.
 * @returns The data context.
 */
export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}