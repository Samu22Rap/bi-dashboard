import { useSearchParams } from 'react-router-dom'
import { useCallback } from 'react'

/**
 * Hook genérico que sincroniza filtros com a URL via useSearchParams.
 * - Filtros sobrevivem a F5
 * - URL pode ser compartilhada com o estado dos filtros
 * - Botão "voltar" restaura o estado anterior
 *
 * @param defaults - Objeto com chaves de filtro e seus valores padrão (ex: { mes: 'all' })
 * @returns [values, setFilter, resetFilters]
 */
export function useFilters<T extends Record<string, string>>(defaults: T) {
  const [searchParams, setSearchParams] = useSearchParams()

  // Lê os valores atuais da URL, fazendo fallback para os defaults
  const values = Object.fromEntries(
    Object.keys(defaults).map((key) => [
      key,
      searchParams.get(key) ?? defaults[key],
    ])
  ) as T

  // Atualiza um único filtro na URL
  const setFilter = useCallback(
    (key: keyof T, value: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        if (value === defaults[key as string]) {
          // Remove o param quando for o valor default (URL mais limpa)
          next.delete(key as string)
        } else {
          next.set(key as string, value)
        }
        return next
      }, { replace: true })
    },
    [setSearchParams, defaults]
  )

  // Reseta todos os filtros removendo os params da URL
  const resetFilters = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      Object.keys(defaults).forEach((key) => next.delete(key))
      return next
    }, { replace: true })
  }, [setSearchParams, defaults])

  return [values, setFilter, resetFilters] as const
}
