import { Navigate, Outlet } from 'react-router-dom'
import { useSession } from '../session/useSession'
import type { Role } from '../session/SessionContext'

interface RequireRoleProps {
  role: Role
}

/**
 * Route guard: authenticated users can only enter their own role flow.
 */
function RequireRole({ role }: RequireRoleProps) {
  const { role: current } = useSession()

  if (current === null) return <Navigate to="/login" replace />
  if (current !== null && current !== role) {
    return <Navigate to={current === 'enterprise' ? '/enterprise' : '/owner'} replace />
  }
  return <Outlet />
}

export default RequireRole
