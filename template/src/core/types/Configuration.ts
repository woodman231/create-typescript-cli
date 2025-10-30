import { z } from 'zod';

// Zod schema for validation
export const CLIAppConfigurationSchema = z.object({
  logLevel: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  logFile: z.string().optional(),
  verbose: z.boolean().default(false),
});

// TypeScript type derived from schema
export type CLIAppConfiguration = z.infer<typeof CLIAppConfigurationSchema>;

// Default configuration
export const DEFAULT_CONFIGURATION: CLIAppConfiguration = {
  logLevel: 'info',
  verbose: false,
};