import { validateAppEnv } from 'src/validators/appEnvSchema';

export const env = validateAppEnv(process.env as Record<string, unknown>);
