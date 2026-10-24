import { fetchJson } from '../../lib/http'
import type { Scan } from '../../types/contract'

export const getScan = (id: string) => fetchJson<Scan>(`/api/scans/${id}`)