import { useQuery } from '@tanstack/react-query'
import { getFinding } from '../api'

export function useFinding(id: string | null) {
  return useQuery({
    queryKey: ['finding', id],
    queryFn: () => getFinding(id as string),
    enabled: id !== null,
  })
}