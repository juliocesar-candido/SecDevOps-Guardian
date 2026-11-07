import { useScan } from './hooks/useScan'
import { useFindingsFilters } from './hooks/useFindingsFilters'
import { ScoreCard } from './components/ScoreCard'
import { FindingsFilters } from './components/FindingsFilters'
import { FindingsList } from './components/FindingsList'
import { FindingDetail } from './components/FindingDetail'

export function ReportPage({ scanId }: { scanId: string }) {
  const { data: scan, isLoading, error } = useScan(scanId)
  const { filters } = useFindingsFilters()

  if (isLoading) return <p className="p-8 text-zinc-400">Carregando relatório...</p>
  if (error || !scan) return <p className="p-8 text-red-400">Não foi possível carregar o relatório.</p>

  return (
    <main className="mx-auto max-w-3xl space-y-8 p-6">
      <h1 className="text-2xl font-bold">Relatório de segurança</h1>
      <ScoreCard scan={scan} />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Vulnerabilidades</h2>
        <FindingsFilters />
        <FindingsList scanId={scanId} filters={filters} />
      </section>

      <FindingDetail />
    </main>
  )
}