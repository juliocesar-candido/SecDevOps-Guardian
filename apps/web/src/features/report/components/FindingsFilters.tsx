import {
  CATEGORIES, SEVERITIES, STATUSES, useFindingsFilters,
} from '../hooks/useFindingsFilters'
import { CATEGORY_LABEL, SEVERITY_LABEL, STATUS_LABEL } from '../labels'

const selectClass =
  'rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100'

export function FindingsFilters() {
  const { filters, setFilter, clear, hasFilters } = useFindingsFilters()

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select aria-label="Severidade" className={selectClass}
        value={filters.severity ?? ''} onChange={(e) => setFilter('severity', e.target.value)}>
        <option value="">Todas as severidades</option>
        {SEVERITIES.map((s) => <option key={s} value={s}>{SEVERITY_LABEL[s]}</option>)}
      </select>

      <select aria-label="Categoria" className={selectClass}
        value={filters.category ?? ''} onChange={(e) => setFilter('category', e.target.value)}>
        <option value="">Todas as categorias</option>
        {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>)}
      </select>

      <select aria-label="Status" className={selectClass}
        value={filters.status ?? ''} onChange={(e) => setFilter('status', e.target.value)}>
        <option value="">Todos os status</option>
        {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
      </select>

      {hasFilters && (
        <button onClick={clear} className="text-sm text-zinc-400 underline hover:text-zinc-200">
          Limpar filtros
        </button>
      )}
    </div>
  )
}