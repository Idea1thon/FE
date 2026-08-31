import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { SessionContext } from './SessionContext'
import type { Role, Session } from './SessionContext'

const STORAGE_KEY = 'geumbowon.role'

function readStoredRole(): Role | null {
  try {
    const value = sessionStorage.getItem(STORAGE_KEY)
    return value === 'enterprise' || value === 'owner' ? value : null
  } catch {
    return null
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(readStoredRole)

  const login = useCallback((next: Role) => {
    setRole(next)
    try {
      sessionStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* storage unavailable — session stays in memory only */
    }
  }, [])

  const logout = useCallback(() => {
    setRole(null)
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  const value = useMemo<Session>(() => ({ role, login, logout }), [role, login, logout])

  return <SessionContext value={value}>{children}</SessionContext>
}
