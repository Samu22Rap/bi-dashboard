import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ChartCardProps {
  title: string
  description?: string
  children: React.ReactNode
  /** Altura do container do gráfico em px. Default: 260 */
  height?: number
  className?: string
  /** Slot opcional no canto superior direito (ex: badge, botão) */
  action?: React.ReactNode
}

export function ChartCard({
  title,
  description,
  children,
  height = 260,
  className,
  action,
}: ChartCardProps) {
  return (
    <Card className={cn('min-w-0 flex flex-col', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="text-sm font-semibold text-gray-900">{title}</CardTitle>
            {description && (
              <p className="mt-0.5 text-xs text-gray-400">{description}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      </CardHeader>

      <CardContent className="pt-0 flex-1 min-w-0">
        {/* Container com min-w-0 para evitar overflow em CSS Grid */}
        <div style={{ width: '100%', height }} className="min-w-0">
          {children}
        </div>
      </CardContent>
    </Card>
  )
}
