import Markdown from 'react-markdown'
import type { AiAnalysis } from '../../../types/contract'
import { DiffView } from './DiffView'

const VERDICT_LABEL = {
  likely_exploitable: 'Provavelmente explorável',
  needs_review: 'Requer revisão manual',
  likely_false_positive: 'Provável falso positivo',
} as const

export function AiPanel({ ai }: { ai: AiAnalysis }) {
  if (ai.status === 'pending') {
    return (
      <div className="animate-pulse space-y-2" aria-label="Análise da IA em andamento">
        <div className="h-4 w-3/4 rounded bg-zinc-800" />
        <div className="h-4 w-full rounded bg-zinc-800" />
        <div className="h-4 w-2/3 rounded bg-zinc-800" />
      </div>
    )
  }

  if (ai.status === 'failed') {
    return (
      <p className="rounded-md bg-amber-500/10 p-3 text-sm text-amber-300">
        A análise da IA falhou para este achado. A detecção da ferramenta continua válida;
        revise o trecho de código manualmente.
      </p>
    )
  }

  if (ai.status === 'skipped') {
    return <p className="text-sm text-zinc-400">Este achado não foi enviado para análise da IA.</p>
  }

  return (
    <div className="space-y-4">
      {ai.verdict && (
        <p className="text-sm">
          <span className="text-zinc-400">Triagem da IA: </span>
          <span className="font-medium">{VERDICT_LABEL[ai.verdict]}</span>
          <span className="text-zinc-500"> (palpite, não altera o score)</span>
        </p>
      )}

      {ai.explanation && (
        <div className="space-y-2 text-sm leading-relaxed text-zinc-200">
          <Markdown
            components={{
              p: (props) => <p className="my-2" {...props} />,
              code: (props) => (
                <code className="rounded bg-zinc-800 px-1 py-0.5 text-xs" {...props} />
              ),
              a: (props) => (
                <a className="text-sky-400 underline" target="_blank" rel="noopener noreferrer" {...props} />
              ),
            }}
          >
            {ai.explanation}
          </Markdown>
        </div>
      )}

      {ai.fix && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Correção sugerida</h4>
          <p className="text-sm text-zinc-300">{ai.fix.description}</p>
          <DiffView patch={ai.fix.patch} />
        </div>
      )}

      {ai.disclaimer && <p className="text-xs text-zinc-500">{ai.disclaimer}</p>}
    </div>
  )
}