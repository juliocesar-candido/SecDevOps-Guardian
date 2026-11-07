import { useSearchParams } from 'react-router-dom'

export function useSelectedFinding() {
  const [params, setParams] = useSearchParams()
  const selectedId = params.get('finding')

  const select = (id: string) =>
    setParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('finding', id)
      return next
    })

  const close = () =>
    setParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete('finding')
      return next
    })

  return { selectedId, select, close }
}