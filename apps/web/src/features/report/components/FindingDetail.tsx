import { useEffect } from 'react'
import { useFinding } from '../hooks/useFinding'
import { useSelectedFinding } from '../hooks/useSelectedFinding'
import { CATEGORY_LABEL, SEVERITY_LABEL, SEVERITY_STYLE, STATUS_LABEL } from '../labels'
import { AiPanel } from './AiPanel'
import { CodeSnippet } from './CodeSnippet'

export function FindingDetail() {
  const { selectedId, close } = useSelectedFinding()
  const { data: f, isLoading, error } = useFinding(selectedId)

  useEffect(() => {
    if (!selectedId) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedId, close])

  if (!selectedId) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60" onClick={close}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Detalhe do achado"
        className="h-full w-full max-w-xl overflow-y-auto border-l border-zinc-800 bg-zinc-900 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={close} className="mb-4 text-sm text-zinc-400 hover:text-zinc-200">
          ← Fechar (Esc)
        </button>

        {isLoading && <p className="text-zinc-400">Carregando achado...</p>}
        {(error || (!isLoading && !f)) && (
          <p className="text-red-400">Achado não encontrado.</p>
        )}

        {f && (
          <div className="space-y-6">
            <header className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded border px-2 py-0.5 text-xs font-semibold ${SEVERITY_STYLE[f.severity]}`}>
                  {SEVERITY_LABEL[f.severity]}
                </span>
                <span className="text-xs text-zinc-500">{CATEGORY_LABEL[f.category]}</span>
                <span className="text-xs text-zinc-500">Confiança: {f.confidence}</span>
                <span className="text-xs text-zinc-500">{STATUS_LABEL[f.triage.status]}</span>
              </div>
              <h2 className="text-xl font-semibold">{f.title}</h2>
              <p className="text-xs text-zinc-500">
                {[...f.cwe, ...f.owasp].join(' · ')} · {f.tool} · {f.ruleId}
              </p>
            </header>

            {f.location && (
              <section className="space-y-2">
                <h3 className="text-sm font-semibold">
                  {f.location.file}:{f.location.startLine}
                </h3>
                {f.location.snippet && (
                  <CodeSnippet
                    snippet={f.location.snippet}
                    startLine={f.location.snippetStartLine}
                    highlightFrom={f.location.startLine}
                    highlightTo={f.location.endLine}
                    masked={f.location.snippetMasked}
                  />
                )}
              </section>
            )}

            {f.dependency && (
              <section className="space-y-1 text-sm">
                <h3 className="font-semibold">Dependência afetada</h3>
                <p className="text-zinc-300">
                  {f.dependency.name}@{f.dependency.installedVersion}
                  {f.dependency.fixedVersion && ` → corrigida em ${f.dependency.fixedVersion}`}
                </p>
                <p className="text-xs text-zinc-500">{f.dependency.advisoryIds.join(', ')}</p>
              </section>
            )}

            <section className="space-y-2">
              <h3 className="text-sm font-semibold">Análise da IA</h3>
              <AiPanel ai={f.ai} />
            </section>
          </div>
        )}
      </aside>
    </div>
  )
}