import type { Category, Severity, TriageStatus } from '../../types/contract'

export const SEVERITY_LABEL: Record<Severity, string> = {
  critical: 'Crítica', high: 'Alta', medium: 'Média', low: 'Baixa',
}

export const SEVERITY_STYLE: Record<Severity, string> = {
  critical: 'bg-red-500/15 text-red-300 border-red-500/40',
  high: 'bg-orange-500/15 text-orange-300 border-orange-500/40',
  medium: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
  low: 'bg-sky-500/15 text-sky-300 border-sky-500/40',
}

export const CATEGORY_LABEL: Record<Category, string> = {
  secrets: 'Segredos expostos',
  injection: 'Injection',
  dependencies: 'Dependências',
  dangerous_practices: 'Práticas perigosas',
}

export const STATUS_LABEL: Record<TriageStatus, string> = {
  open: 'Aberto', ignored: 'Ignorado', false_positive: 'Falso positivo', fixed: 'Corrigido',
}

export const AI_STATUS_LABEL = {
  pending: 'IA analisando...',
  ready: 'Análise da IA pronta',
  failed: 'Análise da IA falhou',
  skipped: 'Sem análise da IA',
} as const