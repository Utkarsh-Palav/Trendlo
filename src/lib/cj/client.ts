const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0/v1'

interface CJTokenResponse {
  data: {
    accessToken: string
    tokenExpiryDate: number
  }
  result: boolean
  message: string
}

class CJClient {
  private accessToken: string | null = null
  private tokenExpiry: number = 0

  async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }

    const res = await fetch(`${CJ_BASE}/authentication/getAccessToken`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: process.env.CJ_EMAIL,
        password: process.env.CJ_PASSWORD,
      }),
    })

    const data = (await res.json()) as CJTokenResponse

    if (!data.result) {
      throw new Error(`CJ Auth failed: ${data.message}`)
    }

    this.accessToken = data.data.accessToken
    // Refresh 1 day before expiry
    this.tokenExpiry = data.data.tokenExpiryDate - 24 * 60 * 60 * 1000

    return this.accessToken
  }

  async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' = 'GET',
    body?: Record<string, unknown>
  ): Promise<T> {
    const token = await this.getAccessToken()

    const res = await fetch(`${CJ_BASE}${endpoint}`, {
      method,
      headers: {
        'CJ-Access-Token': token,
        'Content-Type': 'application/json',
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    })

    const data = await res.json() as { result: boolean; message: string; data: T }

    if (!data.result) {
      throw new Error(`CJ API error: ${data.message}`)
    }

    return data.data
  }
}

export const cj = new CJClient()