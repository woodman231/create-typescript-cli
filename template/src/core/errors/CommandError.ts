import { CLIError } from './CLIError.js';

export class CommandError extends CLIError {
  constructor(message: string, code?: string) {
    super(message, code, 1);
    this.name = 'CommandError';
  }
}