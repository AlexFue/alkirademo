import { forwardRef, useImperativeHandle } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Test-only helper: exposes the real AuthContext value via a ref so tests
 * can drive authStep through the real login()/verifyOtp() API (not a mocked
 * context value) before asserting on what a guard/page renders as a result.
 */
export const AuthDriver = forwardRef(function AuthDriver(_props, ref) {
  const auth = useAuth();
  useImperativeHandle(ref, () => auth, [auth]);
  return null;
});
