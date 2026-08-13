import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { getRouteForStep } from './getRouteForStep.js';

// Guards /mfa. Since the OTP code lives only in in-memory context state, a
// direct hit or hard refresh of /mfa always finds authStep === 'anonymous'
// and is sent back to /login to restart the flow — a deliberate simplicity
// trade-off documented in the README.
export function RequireAwaitingMfa() {
  const { authStep } = useAuth();
  if (authStep !== 'awaiting-mfa') {
    return <Navigate to={getRouteForStep(authStep)} replace />;
  }
  return <Outlet />;
}
