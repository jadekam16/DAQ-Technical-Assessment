import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { GripVertical } from "lucide-react"

interface EmptyPanelWidgetProps {
  title: string
}

/**
 * Empty panel widget component that displays an empty panel.
 *
 * @param {EmptyPanelWidgetProps} props The component props.
 * @returns {JSX.Element} The rendered empty panel widget component.
 */
export function EmptyPanelWidget({ title }: EmptyPanelWidgetProps) {
  return (
    <Card className="w-full h-full">
      <CardHeader className="cursor-move flex flex-row items-center p-4">
        <GripVertical className="mr-2 h-5 w-5 text-muted-foreground" />
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center text-muted-foreground">
        Space for additional components
      </CardContent>
    </Card>
  )
}