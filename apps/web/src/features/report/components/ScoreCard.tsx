import type { Scan } from '../../../types/contract'

type Label = 'Bom' | 'Atenção' | 'Risco alto' | 'Crítico'

const LABEL_STYLES: Record<Label, string> = {
  'Bom': 'text-emerald-400 border-emerald-500/40',
  'Atenção': 'text-amber-400 border-amber-500/40',
  'Risco alto': 'text-orange-400 border-orange-500/40',
  'Crítico': 'text-red-400 border-red-500/40',
}

// Faixas e regra de rebaixamento: ver docs/scoring.md
function getLabel(score: number, openCritical: number): Label {
  let label: Label =
    score >= 90 ? 'Bom' : score >= 70 ? 'Atenção' : score >= 40 ? 'Risco alto' : 'Crítico'
  if (openCritical > 0 && label === 'Bom') label = 'Atenção'
  return label
}

export function ScoreCard({ scan }: { scan: Scan }) {
  const summary = scan.summary
  if (!summary) return null

  const label = getLabel(summary.score, summary.bySeverity.critical)
  const partialCoverage = scan.coverage.languages.some((l) => l.level === 'partial')

  return (
    <section className={`rounded-xl border bg-zinc-900 p-6 ${LABEL_STYLES[label]}`}>
      <div className="flex items-end gap-4">
        <span className="text-6xl font-bold tabular-nums">{summary.score}</span>
        <div className="pb-2">
          <p className="text-sm text-zinc-400">Score de segurança</p>
          <p className="text-xl font-semibold">{label}</p>
        </div>
      </div>

      <ul className="mt-5 space-y-1 text-sm text-zinc-300">
        {summary.scoreBreakdown
          .filter((b) => b.pointsLost > 0)
          .map((b) => (
            <li key={b.severity}>
              −{b.pointsLost} pts: {b.count} achado(s) {b.severity}
              {b.cappedCount > 0 && ` (${b.count - b.cappedCount} de ${b.count} contados)`}
            </li>
          ))}
      </ul>

      {scan.status === 'partial' && (
        <p className="mt-4 rounded-md bg-amber-500/10 p-3 text-sm text-amber-300">
          A análise terminou parcialmente: alguma etapa falhou. O score considera
          apenas o que foi analisado.
        </p>
      )}
      {partialCoverage && (
        <p className="mt-3 rounded-md bg-amber-500/10 p-3 text-sm text-amber-300">
          Cobertura parcial para algumas linguagens deste projeto.
        </p>
      )}

      <p className="mt-4 text-xs text-zinc-500">
        Um score alto não significa ausência de vulnerabilidades: ferramentas
        estáticas têm falsos negativos.
      </p>
    </section>
  )
}