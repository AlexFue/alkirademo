// Mock users
export const MOCK_USERS = [
  {
    email: 'admin@gmail.com',
    password: 'password',
    role: 'read-write',
  },
  {
    email: 'user@gmail.com',
    password: 'password',
    role: 'read-only',
  },
];

/**
 * Looks up a user by email + password (case-insensitive email match).
 * Returns the mock user record (without the password) or null.
 */
export function findUser(email, password) {
  const match = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );
  if (!match) return null;
  const { password: _password, ...publicUser } = match;
  return publicUser;
}
