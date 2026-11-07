import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getFindings, type FindingsFilters } from '../api'

export function useFindings(scanId: string, filters: FindingsFilters) {
  return useQuery({
    queryKey: ['findings', scanId, filters],
    queryFn: () => getFindings(scanId, filters),
    placeholderData: keepPreviousData, // evita a lista "piscar" ao trocar de filtro
  })
}