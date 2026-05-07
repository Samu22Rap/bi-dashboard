interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = 'Carregando dados...' }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center space-y-3">
        <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-[hsl(var(--primary))]" />
        <p className="text-sm text-gray-400">{message}</p>
      </div>
    </div>
  )
}
