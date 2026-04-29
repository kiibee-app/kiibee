import { z } from 'zod';

export const smtpEnvSchema = z.object({
  SMTP_HOST: z.string().trim().min(1, 'SMTP_HOST is required'),
  SMTP_PORT: z.coerce
    .number()
    .int('SMTP_PORT must be an integer')
    .min(1, 'SMTP_PORT must be between 1 and 65535')
    .max(65535, 'SMTP_PORT must be between 1 and 65535'),
  SMTP_USER: z
    .string()
    .trim()
    .min(1, 'SMTP_USER is required')
    .refine((value) => !/[\r\n\t]/.test(value), {
      message: 'SMTP_USER contains invalid control characters',
    }),
  SMTP_PASS: z
    .string()
    .min(1, 'SMTP_PASS is required')
    .refine((value) => value.trim().length > 0, {
      message: 'SMTP_PASS is required',
    })
    .refine((value) => !/[\r\n]/.test(value), {
      message: 'SMTP_PASS contains invalid control characters',
    }),
});

export type SmtpConfig = z.infer<typeof smtpEnvSchema>;
