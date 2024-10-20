// src/config/environment.ts

export interface Environment {
  API_URL: string;
  PROJECT_DOMAIN: string;
  // Add other environment variables as needed
}

async function getEnvValue(key: string, defaultValue: string = ''): Promise<string> {
  // Check if running in a browser environment
  if (typeof window !== 'undefined') {
    // In browser, use Vite's import.meta.env
    return (import.meta.env[key] as string) || defaultValue;
  }

  // Server-side logic
  if (typeof process !== 'undefined' && process.env) {
    // Check for secret file (Docker Swarm)
    const secretPath = process.env[`${key}_FILE`];
    if (secretPath) {
      try {
        const fs = await import('fs/promises');
        return (await fs.readFile(secretPath, 'utf8')).trim();
      } catch (error) {
        console.error(`Error reading secret from ${secretPath}:`, error);
      }
    }
    // If no secret file, return the environment variable
    return process.env[key] || defaultValue;
  }

  // Fallback for unexpected environments
  return defaultValue;
}

async function initializeEnv(): Promise<Environment> {
  return {
    API_URL: await getEnvValue('VITE_API_URL', 'https://api.example.com'),
    PROJECT_DOMAIN: await getEnvValue('VITE_PROJECT_DOMAIN', 'yourdomain.com'),
    // Add other environment variables here
  };
}

let env: Environment | null = null;

export async function getEnv(): Promise<Environment> {
  if (!env) {
    env = await initializeEnv();
  }
  return env;
}

export default getEnv;