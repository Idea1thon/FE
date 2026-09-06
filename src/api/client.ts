/**
 * 백엔드 호출 공통 계층.
 *
 * 배포에서는 nginx 가 FE 와 API 를 한 오리진으로 서빙하므로 `/api/v1/...` 상대
 * 경로면 충분하다. 로컬 개발은 vite.config.ts 의 proxy 가 같은 경로를 배포
 * 서버로 넘긴다 — 그래서 코드에 서버 주소가 들어가지 않는다.
 */

const BASE = '/api/v1'

/** 백엔드 공통 오류 봉투 (API_SPEC 0-3). */
interface ErrorEnvelope {
  error: { code: string; message: string; occurred_at: string }
}

export class ApiError extends Error {
  // tsconfig 가 erasableSyntaxOnly 라 생성자 파라미터 프로퍼티를 쓸 수 없다.
  readonly status: number
  readonly code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

const TOKEN_KEY = 'geumbowon.token'

function readToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token: string | null) {
  try {
    if (token === null) sessionStorage.removeItem(TOKEN_KEY)
    else sessionStorage.setItem(TOKEN_KEY, token)
  } catch {
    /* storage unavailable — 메모리에만 남는다 */
  }
}

/** 401 을 받았을 때 호출된다. SessionProvider 가 로그아웃 처리를 붙인다. */
let onUnauthorized: (() => void) | null = null
export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  body?: unknown
  /** 로그인처럼 토큰이 아직 없는 호출. */
  anonymous?: boolean
  signal?: AbortSignal
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, anonymous = false, signal } = options

  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (!anonymous) {
    const token = readToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let response: Response
  try {
    response = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    })
  } catch (cause) {
    // 네트워크 단절·CORS 등. 상태 코드가 없으므로 0 으로 둔다.
    if (cause instanceof DOMException && cause.name === 'AbortError') throw cause
    throw new ApiError(0, 'NETWORK_ERROR', '서버에 연결할 수 없습니다')
  }

  if (response.status === 204) return undefined as T

  const text = await response.text()
  const payload: unknown = text ? safeParse(text) : null

  if (!response.ok) {
    const envelope = payload as ErrorEnvelope | null
    const code = envelope?.error?.code ?? 'UNKNOWN'
    const message = envelope?.error?.message ?? `요청에 실패했습니다 (${response.status})`

    // 토큰 만료·무효. 화면이 로그인 상태처럼 보이는 채로 계속 실패하지 않게 한다.
    if (response.status === 401 && !anonymous) onUnauthorized?.()

    throw new ApiError(response.status, code, message)
  }

  return payload as T
}

function safeParse(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

/** 202 + 폴링을 쓰는 엔드포인트용. 상태 코드까지 알아야 한다. */
export async function requestWithStatus<T>(
  path: string,
  options: RequestOptions = {},
): Promise<{ status: number; data: T }> {
  const { method = 'GET', body, signal } = options
  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = readToken()
  if (token) headers.Authorization = `Bearer ${token}`

  let response: Response
  try {
    response = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    })
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError') throw cause
    throw new ApiError(0, 'NETWORK_ERROR', '서버에 연결할 수 없습니다')
  }

  const text = await response.text()
  const payload: unknown = text ? safeParse(text) : null

  if (!response.ok) {
    const envelope = payload as ErrorEnvelope | null
    if (response.status === 401) onUnauthorized?.()
    throw new ApiError(
      response.status,
      envelope?.error?.code ?? 'UNKNOWN',
      envelope?.error?.message ?? `요청에 실패했습니다 (${response.status})`,
    )
  }

  return { status: response.status, data: payload as T }
}
