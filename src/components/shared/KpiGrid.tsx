import { cn } from '@/lib/utils'

interface KpiGridProps {
  children: React.ReactNode
  cols?: 2 | 3 | 4
  className?: string
}

const colsClass: Record<number, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

export function KpiGrid({ children, cols = 4, className }: KpiGridProps) {
  return (
    <div className={cn('grid gap-4', colsClass[cols], className)}>
      {children}
    </div>
  )
}
