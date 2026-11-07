import { fetchJson } from '../../lib/http'
import type {
  Category, FindingsPage, Scan, Severity, TriageStatus, Finding, 
} from '../../types/contract'

export interface FindingsFilters {
  severity?: Severity
  category?: Category
  status?: TriageStatus
}

export const getScan = (id: string) => fetchJson<Scan>(`/api/scans/${id}`)

export function getFindings(scanId: string, filters: FindingsFilters) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value)
  }
  const qs = params.toString()
  return fetchJson<FindingsPage>(`/api/scans/${scanId}/findings${qs ? `?${qs}` : ''}`)
}

export const getFinding = (id: string) =>
  fetchJson<Finding>(`/api/findings/${encodeURIComponent(id)}`)