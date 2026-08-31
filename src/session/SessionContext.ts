import { createContext } from 'react'

/** `enterprise` = 기업용(관리자) 로그인, `owner` = 사업자용 로그인. */
export type Role = 'enterprise' | 'owner'

export interface Session {
  role: Role | null
  login: (role: Role) => void
  logout: () => void
}

export const SessionContext = createContext<Session | null>(null)
