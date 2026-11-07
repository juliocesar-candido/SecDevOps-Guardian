interface Props {
  snippet: string
  startLine: number      // snippetStartLine: onde o snippet começa no arquivo
  highlightFrom: number  // location.startLine
  highlightTo: number    // location.endLine
  masked: boolean
}

export function CodeSnippet({ snippet, startLine, highlightFrom, highlightTo, masked }: Props) {
  const lines = snippet.split('\n')

  return (
    <div>
      {masked && (
        <p className="mb-2 text-xs text-amber-300">
          Valor sensível ocultado: a credencial real nunca é armazenada.
        </p>
      )}
      <pre className="overflow-x-auto rounded-md border border-zinc-800 bg-zinc-950 py-2 text-sm">
        {lines.map((line, i) => {
          const n = startLine + i
          const hit = n >= highlightFrom && n <= highlightTo
          return (
            <div key={n} className={hit ? 'bg-red-500/10' : ''}>
              <span className="inline-block w-12 select-none pr-3 text-right text-zinc-600">{n}</span>
              <span className={hit ? 'text-red-200' : 'text-zinc-300'}>{line}</span>
            </div>
          )
        })}
      </pre>
    </div>
  )
}