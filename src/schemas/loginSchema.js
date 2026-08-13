import { z } from 'zod';

// Login only needs format-level validation on email, and "is something typed"
// on password — strength rules belong on signup (new password), not login
// (existing password, whatever it happens to be).
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});
