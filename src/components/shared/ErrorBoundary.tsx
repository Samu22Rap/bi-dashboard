import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
          <div className="max-w-xl w-full bg-white border border-red-200 rounded-xl p-8 shadow-sm space-y-4">
            <h1 className="text-sm font-bold text-red-600 uppercase tracking-wide">Erro de inicializacao</h1>
            <p className="text-sm text-gray-700 font-mono bg-gray-50 rounded p-3 break-all">
              {this.state.error.message}
            </p>
            <pre className="text-xs text-gray-400 overflow-auto max-h-48">
              {this.state.error.stack}
            </pre>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
