interface ErrorStateProps {
  message?: string
}

export function ErrorState({ message = 'Erro ao carregar dados.' }: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center h-64 rounded-xl border border-red-100 bg-red-50">
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-red-600">Falha na conexao</p>
        <p className="text-xs text-red-400">{message}</p>
      </div>
    </div>
  )
}
