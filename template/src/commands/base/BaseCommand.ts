import { ICommand } from '../../core/interfaces/ICommand.js';
import { CommandResult } from "../../core/types/CommandResult.js";
import { ILogger } from '../../core/interfaces/ILogger.js';
import { CommandError } from '../../core/errors/CommandError.js';
import { DIContainer } from '../../infrastructure/di/DIContainer.js';
import { CLIAppConfiguration } from '../../core/types/Configuration.js';

export abstract class BaseCommand implements ICommand {
  abstract readonly name: string;
  abstract readonly description: string;
  protected logger: ILogger;  
  protected config: CLIAppConfiguration;

  constructor(protected diContainer: DIContainer) {
    this.logger = this.diContainer.resolve<ILogger>('logger');    
    this.config = this.diContainer.resolve<CLIAppConfiguration>('config');
  }

  abstract configure(program: import('commander').Command): void;

  async execute(options: any): Promise<CommandResult> {
    try {
      this.logger.debug(`Executing command: ${this.name}`);
      const result = await this.executeCommand(options);
      this.logger.debug(`Command ${this.name} completed successfully`);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Command ${this.name} failed: ${message}`);
      throw new CommandError(`Command execution failed: ${message}`);
    }
  }

  protected abstract executeCommand(options: any): Promise<CommandResult>;
}