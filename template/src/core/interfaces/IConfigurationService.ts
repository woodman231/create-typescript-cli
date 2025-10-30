import { CLIAppConfiguration } from '../types/Configuration.js';

export interface IConfigurationService {
  load(cliArgs?: string[]): Promise<CLIAppConfiguration>;
  get(): CLIAppConfiguration;
  validate(config: unknown): CLIAppConfiguration;
}