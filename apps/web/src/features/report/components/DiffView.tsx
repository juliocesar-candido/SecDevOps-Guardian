function lineClass(line: string) {
  if (line.startsWith('+++') || line.startsWith('---')) return 'text-zinc-500'
  if (line.startsWith('@@')) return 'text-sky-400'
  if (line.startsWith('+')) return 'bg-emerald-500/10 text-emerald-300'
  if (line.startsWith('-')) return 'bg-red-500/10 text-red-300'
  return 'text-zinc-400'
}

export function DiffView({ patch }: { patch: string }) {
  return (
    <pre className="overflow-x-auto rounded-md border border-zinc-800 bg-zinc-950 py-2 text-sm">
      {patch.split('\n').map((line, i) => (
        <div key={i} className={`px-3 ${lineClass(line)}`}>{line || ' '}</div>
      ))}
    </pre>
  )
}