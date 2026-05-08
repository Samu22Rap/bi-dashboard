import { cn } from '@/lib/utils'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

export interface FilterOption {
  value: string
  label: string
}

interface FilterSelectProps {
  label: string
  value: string
  options: FilterOption[]
  placeholder?: string
  onChange: (value: string) => void
  className?: string
}

/** Select individual com label acima */
export function FilterSelect({
  label,
  value,
  options,
  placeholder = 'Todos',
  onChange,
  className,
}: FilterSelectProps) {
  return (
    <div className={cn('flex flex-col gap-1 min-w-[140px]', className)}>
      <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{placeholder}</SelectItem>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

interface FilterBarProps {
  children: React.ReactNode
  onReset?: () => void
  /** Quando true, exibe o botão "Limpar". Passar false oculta o botão mesmo que onReset exista. */
  hasActiveFilters?: boolean
  className?: string
}

/** Wrapper horizontal que agrupa os FilterSelect e o botão de reset */
export function FilterBar({ children, onReset, hasActiveFilters = true, className }: FilterBarProps) {
  return (
    <div className={cn('flex flex-wrap items-end gap-3', className)}>
      {children}

      {onReset && hasActiveFilters && (
        <button
          onClick={onReset}
          className="h-8 px-3 text-xs font-medium text-gray-500 border border-gray-200 rounded-md bg-white hover:bg-gray-50 hover:text-gray-700 transition-colors"
        >
          Limpar
        </button>
      )}
    </div>
  )
}
