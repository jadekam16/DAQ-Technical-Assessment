import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { GripVertical } from "lucide-react"
import TemperatureChart from "@/components/custom/temperature-chart"

interface TemperatureChartWidgetProps {
  data: { timestamp: number; temperature: number }[]
}

/**
 * Temperature chart widget component that displays the temperature chart.
 *
 * @param {TemperatureChartWidgetProps} props The component props.
 * @returns {JSX.Element} The rendered temperature chart widget component.
 */
export function TemperatureChartWidget({ data }: TemperatureChartWidgetProps) {
  return (
    <Card className="w-full h-full">
      <CardHeader className="cursor-move flex flex-row items-center p-4">
        <GripVertical className="mr-2 h-5 w-5 text-muted-foreground" />
        <CardTitle>Temperature Chart</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <TemperatureChart data={data} />
      </CardContent>
    </Card>
  )
}