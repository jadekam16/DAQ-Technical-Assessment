// src/components/dashboard/widgets/live-temperature-widget.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { GripVertical, Thermometer } from "lucide-react"
import Numeric from "@/components/custom/numeric"
import { useData } from "@/contexts/data-wrapper"

/**
 * Live temperature widget component that displays the live temperature.
 *
 * @returns {JSX.Element} The rendered live temperature widget component.
 */
export function LiveTemperatureWidget() {
  const { temperature } = useData()
  
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="cursor-move flex flex-row items-center p-4">
        <GripVertical className="mr-2 h-5 w-5 text-muted-foreground" />
        <CardTitle className="text-xl font-light flex items-center gap-2">
          <Thermometer className="h-6 w-6" />
          Live Battery Temperature
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center">
        <Numeric temp={temperature} />
      </CardContent>
    </Card>
  )
}