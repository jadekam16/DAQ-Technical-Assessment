"use client"

import { Responsive, WidthProvider } from "react-grid-layout"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
import { TemperatureChartWidget } from "./widgets/temperature-chart-widget"
import { LiveTemperatureWidget } from "./widgets/live-temperature-widget"
import { EmptyPanelWidget } from "./widgets/empty-panel-widget"
import { useData } from "@/contexts/data-wrapper"

const ResponsiveGridLayout = WidthProvider(Responsive)

/**
 * Dashboard layout component that displays the main dashboard layout.
 *
 * @returns {JSX.Element} The rendered dashboard layout component.
 */
export default function DashboardLayout(): JSX.Element {
  const { layouts, layoutKey, saveLayout, temperatureData } = useData()

  const widgets = {
    "temperature-chart": <TemperatureChartWidget data={temperatureData} />,
    "live-temperature": <LiveTemperatureWidget />,
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
      isResizable={false}
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