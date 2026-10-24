export async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Erro ${res.status} ao buscar ${url}`)
  return res.json() as Promise<T>
}