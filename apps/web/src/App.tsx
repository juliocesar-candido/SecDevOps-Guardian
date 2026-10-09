import { useEffect, useState } from 'react'

export default function App() {
  const [status, setStatus] = useState('carregando...')

  useEffect(() => {
    fetch('/api/scans/scan_8f3a2c1d')
      .then((r) => r.json())
      .then((scan) => setStatus(`${scan.id}: ${scan.status}, score ${scan.summary.score}`))
  }, [])

  return <h1 className="text-2xl font-bold text-emerald-400 p-8">{status}</h1>
}