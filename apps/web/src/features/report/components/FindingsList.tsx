import { useFindings } from '../hooks/useFindings'
import type { FindingsFilters } from '../api'
import { AI_STATUS_LABEL, CATEGORY_LABEL, SEVERITY_LABEL, SEVERITY_STYLE } from '../labels'

export function FindingsList({ scanId, filters }: { scanId: string; filters: FindingsFilters }) {
  const { data, isLoading, error } = useFindings(scanId, filters)

  if (isLoading) return <p className="text-zinc-400">Carregando achados...</p>
  if (error || !data) return <p className="text-red-400">Não foi possível carregar os achados.</p>
  if (data.items.length === 0) {
    return <p className="text-zinc-400">Nenhum achado com esses filtros.</p>
  }

  return (
    <ul className="space-y-3">
      {data.items.map((f) => (
        <li key={f.id} className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded border px-2 py-0.5 text-xs font-semibold ${SEVERITY_STYLE[f.severity]}`}>
              {SEVERITY_LABEL[f.severity]}
            </span>
            <span className="text-xs text-zinc-500">{CATEGORY_LABEL[f.category]}</span>
            {f.cwe.map((c) => (
              <span key={c} className="text-xs text-zinc-500">{c}</span>
            ))}
          </div>

          <h3 className="mt-2 font-medium">{f.title}</h3>

          <p className="mt-1 text-sm text-zinc-400">
            {f.location
              ? `${f.location.file}:${f.location.startLine}`
              : f.dependency
                ? `${f.dependency.name}@${f.dependency.installedVersion}`
                : ''}
          </p>

          <p className="mt-2 text-xs text-zinc-500">{AI_STATUS_LABEL[f.ai.status]}</p>
        </li>
      ))}
    </ul>
  )
}