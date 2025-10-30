import { z } from 'zod';

export const EchoOptionsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  uppercase: z.boolean().default(false),
  repeat: z.number().int().min(1).max(100).default(1),
});

export type EchoOptions = z.infer<typeof EchoOptionsSchema>;