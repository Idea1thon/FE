import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import * as api from '../api'
import { SessionContext } from './SessionContext'
import type { Role, Session, SessionUser } from './SessionContext'

const USER_KEY = 'geumbowon.user'
const REFRESH_KEY = 'geumbowon.refresh'

/** 백엔드의 user_type 을 화면 용어로 옮긴다. 역할은 서버가 정한다. */
function toRole(userType: api.UserType): Role {
  return userType === 'HQ' ? 'enterprise' : 'owner'
}

function readStoredUser(): SessionUser | null {
  try {
    const raw = sessionStorage.getItem(USER_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as SessionUser
    return parsed.role === 'enterprise' || parsed.role === 'owner' ? parsed : null
  } catch {
    return null
  }
}

function store(key: string, value: string | null) {
  try {
    if (value === null) sessionStorage.removeItem(key)
    else sessionStorage.setItem(key, value)
  } catch {
    /* storage unavailable — 메모리에만 남는다 */
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(readStoredUser)
  const [pending, setPending] = useState(false)

  const logout = useCallback(() => {
    setUser(null)
    api.setToken(null)
    store(USER_KEY, null)
    store(REFRESH_KEY, null)
  }, [])

  // 토큰이 만료되면 화면만 로그인 상태로 남아 모든 요청이 실패한다.
  // 401 을 받는 즉시 세션을 비워 로그인 화면으로 돌아가게 한다.
  useEffect(() => {
    api.setUnauthorizedHandler(logout)
    return () => api.setUnauthorizedHandler(null)
  }, [logout])

  const login = useCallback(async (email: string, password: string) => {
    setPending(true)
    try {
      const res = await api.login(email, password)
      // 역할은 화면에서 고른 탭이 아니라 서버 응답으로 정한다. 기업용 칸에
      // 점주 계정을 넣어도 점주 화면으로 보내는 편이 덜 혼란스럽다.
      const next: SessionUser = {
        id: res.user.id,
        email: res.user.email,
        name: res.user.name,
        role: toRole(res.user.user_type),
        franchiseId: res.user.franchise_id,
      }
      api.setToken(res.token)
      store(REFRESH_KEY, res.refresh_token)
      store(USER_KEY, JSON.stringify(next))
      setUser(next)
      return next
    } finally {
      setPending(false)
    }
  }, [])

  const value = useMemo<Session>(
    () => ({ user, role: user?.role ?? null, pending, login, logout }),
    [user, pending, login, logout],
  )

  return <SessionContext value={value}>{children}</SessionContext>
}
