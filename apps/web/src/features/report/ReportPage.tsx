import { useScan } from './hooks/useScan'
import { ScoreCard } from './components/ScoreCard'

export function ReportPage({ scanId }: { scanId: string }) {
  const { data: scan, isLoading, error } = useScan(scanId)

  if (isLoading) return <p className="p-8 text-zinc-400">Carregando relatório...</p>
  if (error || !scan) return <p className="p-8 text-red-400">Não foi possível carregar o relatório.</p>

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Relatório de segurança</h1>
      <ScoreCard scan={scan} />
    </main>
  )
}