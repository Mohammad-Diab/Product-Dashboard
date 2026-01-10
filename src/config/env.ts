
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

export const env = {
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  
  API_BASE_URL: getEnvVar('NEXT_PUBLIC_API_BASE_URL', '/api'),
  
  AUTH_COOKIE_NAME: getEnvVar('AUTH_COOKIE_NAME', 'auth-token'),
  JWT_SECRET: getEnvVar('JWT_SECRET'),
  
} as const;

export type Env = typeof env;
