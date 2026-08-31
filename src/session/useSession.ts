import { useContext } from 'react'
import { SessionContext } from './SessionContext'
import type { Session } from './SessionContext'

export function useSession(): Session {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within <SessionProvider>')
  return ctx
}
