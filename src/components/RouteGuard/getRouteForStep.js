// Single source of truth for "where does someone at this authStep belong".
// Used by all three route guards so redirects are always consistent —
// e.g. going back to /login while already authenticated forwards to
// /protected instead of showing the login form again.
export function getRouteForStep(authStep) {
  switch (authStep) {
    case 'awaiting-mfa':
      return '/mfa';
    case 'authenticated':
      return '/protected';
    case 'anonymous':
    default:
      return '/login';
  }
}
