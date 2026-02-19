import { z } from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.url().nonempty(),
  EXPO_PUBLIC_GOOGLE_CLIENT_ID: z.string().nonempty(),
});

const _env = {
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_GOOGLE_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
};

const parsedEnv = envSchema.safeParse(_env);

if (!parsedEnv.success) {
  console.error('Environment variable validation failed:', parsedEnv.error.issues);
  throw new Error('There is an error with the environment variables.');
}

export const env = parsedEnv.data;

export type ENV = typeof env;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends ENV {}
  }
}
