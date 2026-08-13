import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { getRouteForStep } from './getRouteForStep.js';

// Guards /login and /signup: a user who is mid-login or already authenticated
// should never see these forms again (e.g. via the back button).
export function RequireAnonymous() {
  const { authStep } = useAuth();
  if (authStep !== 'anonymous') {
    return <Navigate to={getRouteForStep(authStep)} replace />;
  }
  return <Outlet />;
}
