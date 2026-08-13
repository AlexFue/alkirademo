import { createContext, useContext, useReducer, useCallback } from 'react';
import { findUser } from '../mocks/users.js';

/**
 * Auth/session state — the only piece of global mutable state in the app.
 * Deliberately kept in memory only (no localStorage/sessionStorage): a hard
 * refresh at any point resets to 'anonymous'.".
 *
 * authStep progresses strictly: 'anonymous' -> 'awaiting-mfa' -> 'authenticated'.
 * `user` (and therefore role) is only populated once MFA succeeds — a
 * password alone never grants identity/role in this app.
 */
const AuthContext = createContext(null);

const initialState = {
  user: null,
  authStep: 'anonymous',
  pendingUser: null,
  pendingOtp: null,
};

function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        authStep: 'awaiting-mfa',
        pendingUser: action.payload.user,
        pendingOtp: action.payload.otp,
      };
    case 'RESEND_OTP':
      return { ...state, pendingOtp: action.payload.otp };
    case 'VERIFY_OTP_SUCCESS':
      return {
        ...state,
        authStep: 'authenticated',
        user: state.pendingUser,
        pendingUser: null,
        pendingOtp: null,
      };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  // Use useReducer to manage authentication state transitions
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = useCallback((email, password) => {
    const match = findUser(email, password);
    if (!match) {
      return { success: false, error: 'Invalid email or password.' };
    }
    const otp = generateOtpCode();
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user: match, otp } });
    return { success: true, otp };
  }, []);

  const resendOtp = useCallback(() => {
    const otp = generateOtpCode();
    dispatch({ type: 'RESEND_OTP', payload: { otp } });
    return otp;
  }, []);

  const verifyOtp = useCallback(
    (code) => {
      // Only allow OTP verification if the user is in the 'awaiting-mfa' step
      if (state.authStep !== 'awaiting-mfa') {
        return { success: false, error: 'No login in progress. Please sign in again.' };
      }
      if (code === state.pendingOtp) {
        dispatch({ type: 'VERIFY_OTP_SUCCESS' });
        return { success: true };
      }
      return { success: false, error: 'Incorrect code. Please try again.' };
    },
    [state.authStep, state.pendingOtp],
  );

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  const value = {
    user: state.user,
    authStep: state.authStep,
    pendingUser: state.pendingUser,
    pendingOtp: state.pendingOtp,
    login,
    verifyOtp,
    resendOtp,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
