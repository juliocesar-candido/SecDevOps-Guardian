import { useSearchParams } from 'react-router-dom'
import type { Category, Severity, TriageStatus } from '../../../types/contract'
import type { FindingsFilters } from '../api'

export const SEVERITIES: Severity[] = ['critical', 'high', 'medium', 'low']
export const CATEGORIES: Category[] = ['secrets', 'injection', 'dependencies', 'dangerous_practices']
export const STATUSES: TriageStatus[] = ['open', 'ignored', 'false_positive', 'fixed']

// A URL é entrada não confiável: só aceitamos valores conhecidos.
function pick<T extends string>(value: string | null, allowed: readonly T[]): T | undefined {
  return allowed.find((a) => a === value)
}

export function useFindingsFilters() {
  const [params, setParams] = useSearchParams()

  const filters: FindingsFilters = {
    severity: pick(params.get('severity'), SEVERITIES),
    category: pick(params.get('category'), CATEGORIES),
    status: pick(params.get('status'), STATUSES),
  }

  function setFilter(key: keyof FindingsFilters, value: string) {
    setParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value) next.set(key, value)
      else next.delete(key)
      return next
    })
  }

  const clear = () => setParams({})
  const hasFilters = Object.values(filters).some(Boolean)

  return { filters, setFilter, clear, hasFilters }
}