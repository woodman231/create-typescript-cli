import { Command } from 'commander';
import { DIContainer } from '../infrastructure/di/DIContainer.js';
import { ICommandRegistry } from '../core/interfaces/ICommandRegistry.js';
import { ILogger } from '../core/interfaces/ILogger.js';
import { ApplicationBootstrapper } from './ApplicationBootstrapper.js';
import { CLIError } from '../core/errors/CLIError.js';

export class CLIApplication {
  private program = new Command();

  constructor(private container: DIContainer) {
    this.setupProgram();
  }

  private setupProgram(): void {
    const packageInfo = ApplicationBootstrapper.getPackageInfo();

    this.program
      .name(packageInfo.name)
      .description(packageInfo.description)
      .version(packageInfo.version)
      .option('-l, --log-file <path>', 'specify a log file')
      .option('-v, --verbose', 'enable verbose output', false)
      .option('--log-level <level>', 'set log level (debug, info, warn, error)', 'info');

    // Register all commands
    const commandRegistry = this.container.resolve<ICommandRegistry>('commandRegistry');
    commandRegistry.configureCommander(this.program);
  }

  async run(argv?: string[]): Promise<void> {
    const logger = this.container.resolve<ILogger>('logger');
    
    try {
      await this.program.parseAsync(argv || process.argv);
    } catch (error) {
      if (error instanceof CLIError) {
        logger.error(error.message);
        process.exit(error.exitCode);
      } else {
        logger.error(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
      }
    }
  }
}