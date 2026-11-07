import { http, HttpResponse, delay } from 'msw'
import type { ScanFixture, Finding } from '../types/contract'
import fixtureJson from '../../../../contracts/fixtures/scan-partial.json'

const fixture = fixtureJson as unknown as ScanFixture

export const handlers = [
  http.get('/api/scans/:id', async ({ params }) => {
    await delay(400)
    if (params.id !== fixture.scan.id) {
      return HttpResponse.json({ code: 'NOT_FOUND' }, { status: 404 })
    }
    return HttpResponse.json(fixture.scan)
  }),

  http.get('/api/scans/:id/findings', async ({ request }) => {
    await delay(400)
    const url = new URL(request.url)
    const severity = url.searchParams.get('severity')
    const category = url.searchParams.get('category')
    const status = url.searchParams.get('status')

    const items: Finding[] = fixture.findings.filter(
      (f) =>
        (!severity || f.severity === severity) &&
        (!category || f.category === category) &&
        (!status || f.triage.status === status),
    )
    return HttpResponse.json({ items, nextCursor: null })
  }),

    http.get('/api/findings/:id', async ({ params }) => {
    await delay(300)
    const finding = fixture.findings.find((f) => f.id === params.id)
    if (!finding) return HttpResponse.json({ code: 'NOT_FOUND' }, { status: 404 })
    return HttpResponse.json(finding)
  }),
  
]