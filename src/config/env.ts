
function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];

  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${key} is not defined`);
  }

  return value;
}

// Client-safe environment variables (accessible everywhere)
export const env = {
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  API_BASE_URL: getEnvVar('NEXT_PUBLIC_API_BASE_URL', '/api'),
  AUTH_COOKIE_NAME: getEnvVar('AUTH_COOKIE_NAME', 'auth-token'),
} as const;
// Server-only environment variables (only accessible in server components and API routes)
export const serverEnv = {
  JWT_SECRET: typeof window === 'undefined' ? getEnvVar('JWT_SECRET') : '',
  API_BASE_URL:
    typeof window === 'undefined' ? getEnvVar('SERVER_API_BASE_URL', "http://localhost:3000/api") : '',
} as const;

export type Env = typeof env;
export type ServerEnv = typeof serverEnv;
