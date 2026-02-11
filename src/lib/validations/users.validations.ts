import * as z from 'zod';
import { emailSchema, passwordSchema } from './auth.validations';

const updateProfileValidationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: emailSchema,
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileValidationSchema>;

const changePasswordValidationSchema = z
  .object({
    currentPassword: z
      .string()
      .nonempty({ message: 'Password is required' })
      .min(8, { message: 'Password must be at least 8 characters long' })
      .max(64, { message: 'Password must not exceed 64 characters' }),
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordValidationSchema>;

export { updateProfileValidationSchema, changePasswordValidationSchema };
