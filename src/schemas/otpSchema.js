import { z } from 'zod';

export const otpSchema = z.object({
  code: z
    .string()
    .length(6, 'Enter all 6 digits')
    .regex(/^\d{6}$/, 'Digits only'),
});
