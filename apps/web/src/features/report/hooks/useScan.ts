import { useQuery } from '@tanstack/react-query'
import { getScan } from '../api'
import type { ScanStatus } from '../../../types/contract'

const IN_PROGRESS: ScanStatus[] = ['queued', 'running']

export function useScan(id: string) {
  return useQuery({
    queryKey: ['scan', id],
    queryFn: () => getScan(id),
    // Faz polling a cada 2s enquanto o scan não terminou; depois para sozinho.
    refetchInterval: (query) => {
      const status = query.state.data?.status
      return status && IN_PROGRESS.includes(status) ? 2000 : false
    },
  })
}