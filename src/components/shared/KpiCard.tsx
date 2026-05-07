import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

export type KpiVariant = 'ok' | 'alert' | 'error' | 'neutral'

interface KpiCardProps {
  label: string
  value: string
  sublabel?: string
  delta?: string           // ex: "+R$ 28,36 acima da meta" ou "-0,40 p.p."
  variant?: KpiVariant
  className?: string
}

const variantStyles: Record<KpiVariant, { dot: string; delta: string }> = {
  ok:      { dot: 'bg-green-500',  delta: 'text-green-600' },
  alert:   { dot: 'bg-red-500',    delta: 'text-red-600' },
  error:   { dot: 'bg-red-500',    delta: 'text-red-600' },
  neutral: { dot: 'bg-gray-300',   delta: 'text-gray-400' },
}

function safeVariant(v: string | undefined): KpiVariant {
  if (v && v in variantStyles) return v as KpiVariant
  return 'neutral'
}

export function KpiCard({ label, value, sublabel, delta, variant = 'neutral', className }: KpiCardProps) {
  const styles = variantStyles[safeVariant(variant)]

  return (
    <Card className={cn('min-w-0', className)}>
      <CardContent className="p-5">
        {/* Label + dot */}
        <div className="flex items-center gap-2 mb-3">
          <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', styles.dot)} />
          <p className="text-xs font-medium text-gray-500 truncate">{label}</p>
        </div>

        {/* Valor principal */}
        <p className="text-2xl font-bold text-gray-900 leading-none truncate">{value}</p>

        {/* Sublabel */}
        {sublabel && (
          <p className="mt-1 text-xs text-gray-400 truncate">{sublabel}</p>
        )}

        {/* Delta vs meta */}
        {delta && (
          <p className={cn('mt-2 text-xs font-medium truncate', styles.delta)}>
            {delta}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
