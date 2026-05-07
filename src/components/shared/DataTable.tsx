import { cn } from '@/lib/utils'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

export interface ColumnDef<T> {
  key: keyof T | string
  header: string
  /** Renderização customizada. Recebe a linha inteira. */
  cell?: (row: T) => React.ReactNode
  /** Alinhamento da coluna. Default: 'left' */
  align?: 'left' | 'right' | 'center'
  className?: string
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[]
  data: T[]
  className?: string
  emptyMessage?: string
}

export function DataTable<T extends object>({
  columns,
  data,
  className,
  emptyMessage = 'Sem dados disponíveis.',
}: DataTableProps<T>) {
  const alignClass = {
    left: 'text-left',
    right: 'text-right',
    center: 'text-center',
  }

  return (
    <div className={cn('rounded-lg border border-gray-100 overflow-hidden', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={String(col.key)}
                className={cn(alignClass[col.align ?? 'left'], col.className)}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-8 text-center text-gray-400">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIdx) => (
              <TableRow key={rowIdx}>
                {columns.map((col) => (
                  <TableCell
                    key={String(col.key)}
                    className={cn(alignClass[col.align ?? 'left'], col.className)}
                  >
                    {col.cell
                      ? col.cell(row)
                      : String((row as Record<string, unknown>)[String(col.key)] ?? '—')}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
