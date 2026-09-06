import { Navigate, Outlet } from 'react-router-dom'
import { useSession } from '../session/useSession'
import type { Role } from '../session/SessionContext'

interface RequireRoleProps {
  role: Role
}

/**
 * Route guard: logged-out visitors are allowed through so every page stays
 * reachable without signing in. A logged-in user visiting the other role's
 * flow is redirected to their own home.
 */
function RequireRole({ role }: RequireRoleProps) {
  const { role: current } = useSession()

  if (current !== null && current !== role) {
    return <Navigate to={current === 'enterprise' ? '/enterprise' : '/owner'} replace />
  }
  return <Outlet />
}

export default RequireRole
