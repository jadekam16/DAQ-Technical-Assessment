import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface TooltipButtonProps {
  tooltip: string
  onClick: () => void
  icon: React.ReactNode
  label: string
}

/**
 * Tooltip button component that displays a button with a tooltip.
 *
 * @param {TooltipButtonProps} props The component props.
 * @returns {JSX.Element} The rendered tooltip button component.
 */
export function TooltipButton({ tooltip, onClick, icon, label }: TooltipButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClick} 
          className="flex items-center gap-1"
        >
          {icon}
          {label}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  )
}