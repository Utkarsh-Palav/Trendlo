import fs from 'fs'
import path from 'path'

const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0/v1'

// Store token in a file so it survives server restarts and hot reloads
const TOKEN_FILE = path.join(process.cwd(), '.cj-token.json')

interface CJTokenCache {
  accessToken: string
  refreshToken: string
  accessTokenExpiry: number
  refreshTokenExpiry: number
}

interface CJAuthResponse {
  code: number
  result: boolean
  message: string
  data: {
    accessToken: string
    accessTokenExpiryDate: string
    refreshToken: string
    refreshTokenExpiryDate: string
  } | null
}

function readTokenFromFile(): CJTokenCache | null {
  try {
    if (!fs.existsSync(TOKEN_FILE)) return null
    const raw = fs.readFileSync(TOKEN_FILE, 'utf-8')
    const parsed = JSON.parse(raw) as CJTokenCache
    // Basic validation
    if (!parsed.accessToken || !parsed.accessTokenExpiry) return null
    return parsed
  } catch {
    return null
  }
}

function writeTokenToFile(cache: CJTokenCache): void {
  try {
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(cache, null, 2), 'utf-8')
  } catch (err) {
    console.error('CJ: Failed to write token cache file:', err)
  }
}

// In-memory cache — avoids file reads on every request
// Falls back to file on process restart
declare global {
  // eslint-disable-next-line no-var
  var __cj_auth: {
    cache: CJTokenCache | null
    inProgress: Promise<string> | null
  } | undefined
}

if (!global.__cj_auth) {
  global.__cj_auth = {
    cache: readTokenFromFile(),
    inProgress: null,
  }
}

const store = global.__cj_auth

async function fetchNewToken(): Promise<string> {
  const apiKey = process.env.CJ_API_KEY
  if (!apiKey) throw new Error('Missing CJ_API_KEY in .env.local')

  console.log('CJ: Fetching new token from API...')

  const res = await fetch(`${CJ_BASE}/authentication/getAccessToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey }),
    cache: 'no-store',
  })

  const data = (await res.json()) as CJAuthResponse

  if (!data.result || !data.data) {
    throw new Error(`CJ Auth failed: ${data.message}`)
  }

  const cache: CJTokenCache = {
    accessToken: data.data.accessToken,
    refreshToken: data.data.refreshToken,
    accessTokenExpiry: new Date(data.data.accessTokenExpiryDate).getTime(),
    refreshTokenExpiry: new Date(data.data.refreshTokenExpiryDate).getTime(),
  }

  store.cache = cache
  writeTokenToFile(cache)

  console.log('CJ: Token obtained and saved. Expires:', data.data.accessTokenExpiryDate)

  return cache.accessToken
}

async function refreshExistingToken(): Promise<string> {
  if (!store.cache?.refreshToken) return fetchNewToken()

  console.log('CJ: Refreshing access token...')

  const res = await fetch(`${CJ_BASE}/authentication/refreshAccessToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: store.cache.refreshToken }),
    cache: 'no-store',
  })

  const data = (await res.json()) as CJAuthResponse

  if (!data.result || !data.data) {
    console.warn('CJ: Refresh failed — re-authenticating...')
    store.cache = null
    return fetchNewToken()
  }

  const cache: CJTokenCache = {
    accessToken: data.data.accessToken,
    refreshToken: data.data.refreshToken,
    accessTokenExpiry: new Date(data.data.accessTokenExpiryDate).getTime(),
    refreshTokenExpiry: new Date(data.data.refreshTokenExpiryDate).getTime(),
  }

  store.cache = cache
  writeTokenToFile(cache)

  console.log('CJ: Token refreshed. Expires:', data.data.accessTokenExpiryDate)

  return cache.accessToken
}

export async function getTokenForProducts(): Promise<string> {
  const now = Date.now()
  const oneHour = 60 * 60 * 1000

  // If no in-memory cache, try reading from file (after restart)
  if (!store.cache) {
    store.cache = readTokenFromFile()
  }

  // Valid token exists — return it
  if (store.cache && store.cache.accessToken && now < store.cache.accessTokenExpiry - oneHour) {
    return store.cache.accessToken
  }

  // Auth already running — wait for it
  if (store.inProgress) {
    console.log('CJ: Auth in progress, waiting...')
    return store.inProgress
  }

  // Refresh token is valid — use it
  if (store.cache?.refreshToken && now < store.cache.refreshTokenExpiry) {
    store.inProgress = refreshExistingToken().finally(() => {
      store.inProgress = null
    })
    return store.inProgress
  }

  // Full re-auth needed
  store.inProgress = fetchNewToken().finally(() => {
    store.inProgress = null
  })
  return store.inProgress
}

class CJClient {
  async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' = 'GET',
    body?: Record<string, unknown>
  ): Promise<T> {
    const token = await getTokenForProducts()

    const res = await fetch(`${CJ_BASE}${endpoint}`, {
      method,
      headers: {
        'CJ-Access-Token': token,
        'Content-Type': 'application/json',
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      cache: 'no-store',
    })

    const data = await res.json() as {
      result: boolean
      message: string
      data: T
      code: number
    }

    if (!data.result) {
      throw new Error(`CJ API error [${data.code}]: ${data.message}`)
    }

    return data.data
  }
}

export const cj = new CJClient()
