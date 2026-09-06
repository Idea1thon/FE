import { createContext } from 'react'

/** `enterprise` = 기업용(본사, 백엔드의 HQ), `owner` = 사업자용(점주, OWNER). */
export type Role = 'enterprise' | 'owner'

export interface SessionUser {
  id: number
  email: string
  name: string
  role: Role
  franchiseId: number
}

export interface Session {
  /** 로그인한 사용자. 로그아웃 상태면 null. */
  user: SessionUser | null
  /** 기존 화면·가드가 쓰던 값. user?.role 과 같다. */
  role: Role | null
  /** 로그인 진행 중 여부. 버튼 중복 클릭을 막는 데 쓴다. */
  pending: boolean
  /** 실패 시 ApiError 를 던진다. 성공하면 확정된 사용자를 돌려준다. */
  login: (email: string, password: string) => Promise<SessionUser>
  logout: () => void
}

export const SessionContext = createContext<Session | null>(null)
