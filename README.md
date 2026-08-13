# Alkira Assessment

## Technologies used

- **React 19** + **Vite** — app framework and dev/build tooling
- **JavaScript** 
- **React Router** — client-side routing and route guards
- **MUI (Material UI)** — component library
- **Tailwind CSS v4** — layout/spacing utility classes
- **react-hook-form** + **zod** — form state and schema-based validation
- **Vitest** + **React Testing Library** — testing

## Setup / install instructions

Requires Node.js (v20+) and npm.

```bash
npm install
```

## Local run instructions

```bash
npm run dev
```

Then open the URL Vite prints (typically `http://localhost:5173`).

Other scripts:

```bash
npm test           # run the test suite once
```

## Mock user credentials / roles

There is no real backend — login checks against a hardcoded list in
[`src/mocks/users.js`](src/mocks/users.js):

| Email | Password | Role | Behavior on Protected screen |
|---|---|---|---|
| `admin@gmail.com` | `password` | `read-write` | Edit actions enabled |
| `user@gmail.com` | `password` | `read-only` | Edit actions disabled |

## How to test the login/MFA flow

1. Go to `/login` and sign in with one of the mock credentials above.
   - Try an invalid email format or an empty field first to see field-level
     validation errors.
   - Try a wrong password to see the separate "Invalid email or password"
     alert (distinct from field validation errors).
2. On success you're taken to `/mfa`. A banner at the top shows a randomly
   generated 6-digit code (standing in for an SMS/email that would be sent
   by a real backend). Enter that code into the 6-box input.
   - Try an incorrect code first to see the inline error and retry.
   - "Resend code" generates a new code and updates the banner.
   - "Back to login" abandons the in-progress login and returns to `/login`.
3. On a correct code you're taken to `/protected`, showing a table of mock
   resources with per-row Edit actions:
   - Signed in as `user@gmail.com` → Edit buttons are disabled (read-only).
   - Signed in as `admin@gmail.com` → Edit buttons are enabled (read/write).
4. Route guards can also be exercised directly: try navigating straight to
   `/protected` or `/mfa` without logging in — you'll be redirected back to
   `/login`.
5. `/signup` is reachable from the Login screen's "Sign up" link. It's a
   real, validated form, but submitting it does not create a usable
   account — see [Design decisions](#key-design-decisions--assumptions).

Automated coverage (`npm test`) exercises the same paths: field validation
errors, the login-failure alert, the MFA verify/retry flow, and role-gated
rendering of the Edit actions on the Protected screen.

## Key design decisions & assumptions

- **Auth state lives in React Context** (`src/context/AuthContext.jsx`), not
  Redux/Zustand — the app is small enough that a `useReducer`-backed context
  is sufficient. It tracks an explicit `authStep`
  (`anonymous` → `awaiting-mfa` → `authenticated`) so a password alone never
  grants a role/identity — that only happens once MFA succeeds.
- **Session state is in-memory only** — nothing is written to
  localStorage/sessionStorage. A hard refresh at any point resets you to
  `/login`. See [Known limitations](#known-limitations).
- **Route guards** (`src/components/RouteGuard/`) read `authStep` and
  redirect based on it, independent of how a route was reached (direct URL,
  back button, refresh) — e.g. `/protected` and `/mfa` aren't reachable
  without going through the prior steps.
- **MFA code delivery is simulated** — since there's no backend to send a
  real SMS/email, a random 6-digit code is generated client-side and shown
  directly in an on-screen banner when you reach `/mfa`.
- **Sign Up is intentionally non-functional** — per the exercise spec
  ("full registration is not required"), the form validates realistically
  but submitting it does not create an account or touch the mock user list.
  It shows a confirmation message and links back to `/login`.
- **Edit actions demonstrate access control, not a real editor** — the
  Protected screen's Edit dialog is a lightweight placeholder to show the
  role gate working (enabled vs. disabled per role).
- **Tailwind + MUI together** — MUI provides all interactive components and
  its own CSS reset (`CssBaseline`). Tailwind is used only for layout/spacing
  utility classes around them, not to restyle MUI internals.

## Known limitations

- No session persistence — refreshing the page at any point logs you out
  back to `/login`.
- No lockout/rate-limiting on repeated incorrect MFA attempts.
- Sign Up doesn't create a real, usable account (by design).
- Automated test coverage is currently limited to the four page components
  (`LoginPage`, `MfaPage`, `ProtectedPage`, `SignupPage`).
