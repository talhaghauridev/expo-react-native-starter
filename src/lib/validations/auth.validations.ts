import * as z from 'zod';

export const emailSchema = z
  .email('Please enter a valid email address')
  .nonempty({ message: 'Email is required' });

export const passwordSchema = z
  .string()
  .trim()
  .nonempty({ error: 'Password is required' })
  .min(8, { error: 'Password must be at least 8 characters long' })
  .max(100, { error: 'Password must be at most 100 characters long' });

const loginValidationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginFormValues = z.infer<typeof loginValidationSchema>;

const registerValidationSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty({ error: 'Name is required' })
    .min(2, { error: 'Name must be at least 2 characters long' })
    .max(100, { error: 'Name must be at most 100 characters long' }),
  email: emailSchema,
  password: passwordSchema,
});

export type RegisterFormValues = z.infer<typeof registerValidationSchema>;

const forgotPasswordValidationSchema = z.object({
  email: emailSchema,
});

const resetPasswordValidationSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordValidationSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordValidationSchema>;

export {
  loginValidationSchema,
  registerValidationSchema,
  forgotPasswordValidationSchema,
  resetPasswordValidationSchema,
};
