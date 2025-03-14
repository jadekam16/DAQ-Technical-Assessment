"use client"

import { Responsive, WidthProvider } from "react-grid-layout"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
import { useWebSocketData } from "@/hooks/use-websocket-data"
import { TemperatureChartWidget } from "./widgets/temperature-chart-widget"
import { LiveTemperatureWidget } from "./widgets/live-temperature-widget"
import { EmptyPanelWidget } from "./widgets/empty-panel-widget"

const ResponsiveGridLayout = WidthProvider(Responsive)

interface DashboardLayoutProps {
  temperature: number
  temperatureData: { timestamp: number; temperature: number }[]
  layoutKey?: number 
}

/**
 * Dashboard layout component that displays the widgets in a responsive grid layout.
 *
 * @param {DashboardLayoutProps} props The component props.
 * @returns {JSX.Element} The rendered dashboard layout component.
 */
export default function DashboardLayout({ 
  temperature, 
  temperatureData, 
  layoutKey = 0
}: DashboardLayoutProps): JSX.Element {
  const { layouts, saveLayout } = useWebSocketData()

  const widgets = {
    "temperature-chart": <TemperatureChartWidget data={temperatureData} />,
    "live-temperature": <LiveTemperatureWidget temperature={temperature} />,
    "panel-1": <EmptyPanelWidget title="Available Panel" />,
    "panel-2": <EmptyPanelWidget title="Available Panel" />
  }

  return (
    <ResponsiveGridLayout
      key={layoutKey}
      className="layout"
      layouts={layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
      cols={{ lg: 12, md: 12, sm: 12, xs: 12 }}
      rowHeight={40}
      isResizable={true}
      isDraggable={true}
      onLayoutChange={(currentLayout, allLayouts) => saveLayout(currentLayout, allLayouts)}
      draggableHandle=".cursor-move"
    >
      {Object.keys(widgets).map(key => (
        <div key={key}>
          {widgets[key as keyof typeof widgets]}
        </div>
      ))}
    </ResponsiveGridLayout>
  )
}