import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { getRouteForStep } from './getRouteForStep.js';

// Guards /protected: only reachable once login + MFA have both succeeded.
export function RequireAuthenticated() {
  const { authStep } = useAuth();
  if (authStep !== 'authenticated') {
    return <Navigate to={getRouteForStep(authStep)} replace />;
  }
  return <Outlet />;
}
