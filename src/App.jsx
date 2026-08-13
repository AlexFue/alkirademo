import { Routes, Route, Navigate } from 'react-router-dom';
import { RequireAnonymous } from './components/RouteGuard/RequireAnonymous.jsx';
import { RequireAwaitingMfa } from './components/RouteGuard/RequireAwaitingMfa.jsx';
import { RequireAuthenticated } from './components/RouteGuard/RequireAuthenticated.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import MfaPage from './pages/MfaPage.jsx';
import ProtectedPage from './pages/ProtectedPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<RequireAnonymous />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      <Route element={<RequireAwaitingMfa />}>
        <Route path="/mfa" element={<MfaPage />} />
      </Route>

      <Route element={<RequireAuthenticated />}>
        <Route path="/protected" element={<ProtectedPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
