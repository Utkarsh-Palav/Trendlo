export interface UTMData {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  ref_code?: string
}

export function captureUTM(): void {
  if (typeof window === 'undefined') return

  try {
    const params = new URLSearchParams(window.location.search)
    const utm_source = params.get('utm_source') ?? undefined
    const utm_medium = params.get('utm_medium') ?? undefined
    const utm_campaign = params.get('utm_campaign') ?? undefined
    const ref_code = params.get('ref') ?? undefined

    // Only save if there are UTM params in the current URL
    if (utm_source || utm_medium || utm_campaign || ref_code) {
      const data: UTMData = { utm_source, utm_medium, utm_campaign, ref_code }
      sessionStorage.setItem('trendlo_utm', JSON.stringify(data))
      return
    }

    // If only ref param exists, save as referral
    if (ref_code) {
      const data: UTMData = { utm_source: 'referral', ref_code }
      sessionStorage.setItem('trendlo_utm', JSON.stringify(data))
    }

    // If no params in URL, do NOT overwrite existing UTM
    // (preserves attribution when customer browses after clicking an ad)
  } catch {
    // ignore storage errors
  }
}

export function getUTM(): UTMData | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = sessionStorage.getItem('trendlo_utm')
    if (!stored) return null
    return JSON.parse(stored) as UTMData
  } catch {
    return null
  }
}