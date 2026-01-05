import { Command } from 'commander';
import { BaseCommand } from '../base/BaseCommand.js';
import { CommandResult } from "../../core/types/CommandResult.js";
import { EchoOptions, EchoOptionsSchema } from './EchoOptions.js';
import { DIContainer } from '../../infrastructure/di/DIContainer.js';

export class EchoCommand extends BaseCommand {
  readonly name = 'echo';
  readonly description = 'Echo your name with optional transformations';

  constructor(diContainer: DIContainer) {
    super(diContainer);
  }

  configure(program: Command): void {
    program
      .command(this.name)
      .description(this.description)
      .requiredOption('-n, --name <name>', 'name to echo')
      .option('-u, --uppercase', 'convert output to uppercase', false)
      .option('-r, --repeat <count>', 'repeat the output multiple times', '1')
      .action(async (rawOptions) => {
        try {
          // Parse and validate options
          const options = EchoOptionsSchema.parse({
            name: rawOptions.name,
            uppercase: rawOptions.uppercase,
            repeat: parseInt(rawOptions.repeat, 10),
          });

          // Use the injected configuration instead of manually parsing
          const result = await this.executeCommand(options);
          
          if (!result.success) {
            process.exit(1);
          }
        } catch (error) {
          this.logger.error(`Command failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
          process.exit(1);
        }
      });
  }

  protected async executeCommand(options: EchoOptions): Promise<CommandResult> {
    // Debug: Show current configuration
    this.logger.debug(`Current log level: ${this.config.logLevel}`);
    this.logger.debug(`Verbose mode: ${this.config.verbose}`);
    this.logger.debug(`Log file: ${this.config.logFile || 'none'}`);
    
    let output = `Hello, ${options.name}!`;

    if (options.uppercase) {
      output = output.toUpperCase();
    }

    for (let i = 0; i < options.repeat; i++) {
      this.logger.info(output);
    }

    return {
      success: true,
      message: `Echoed "${options.name}" ${options.repeat} time(s)`,
      data: { output, options }
    };
  }
}