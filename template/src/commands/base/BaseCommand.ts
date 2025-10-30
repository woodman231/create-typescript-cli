import { ICommand } from '../../core/interfaces/ICommand.js';
import { CommandResult } from "../../core/types/CommandResult.js";
import { CLIAppConfiguration } from '../../core/types/Configuration.js';
import { ILogger } from '../../core/interfaces/ILogger.js';
import { CommandError } from '../../core/errors/CommandError.js';

export abstract class BaseCommand implements ICommand {
  abstract readonly name: string;
  abstract readonly description: string;

  constructor(protected logger: ILogger) {}

  abstract configure(program: import('commander').Command): void;
  
  async execute(options: any, config: CLIAppConfiguration): Promise<CommandResult> {
    try {
      this.logger.debug(`Executing command: ${this.name}`);
      const result = await this.executeCommand(options, config);
      this.logger.debug(`Command ${this.name} completed successfully`);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Command ${this.name} failed: ${message}`);
      throw new CommandError(`Command execution failed: ${message}`);
    }
  }

  protected abstract executeCommand(options: any, config: CLIAppConfiguration): Promise<CommandResult>;
}