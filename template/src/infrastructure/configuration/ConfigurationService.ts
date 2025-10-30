import { IConfigurationService } from '../../core/interfaces/IConfigurationService.js';
import { 
  CLIAppConfiguration, 
  CLIAppConfigurationSchema, 
  DEFAULT_CONFIGURATION 
} from '../../core/types/Configuration.js';
import { ConfigurationError } from '../../core/errors/ConfigurationError.js';

export class ConfigurationService implements IConfigurationService {
  private config: CLIAppConfiguration = DEFAULT_CONFIGURATION;

  async load(cliArgs?: string[]): Promise<CLIAppConfiguration> {
    try {
      // Start with defaults
      let config = { ...DEFAULT_CONFIGURATION };

      // Load from environment variables
      config = this.loadFromEnvironment(config);

      // Load from CLI arguments (if provided)
      if (cliArgs) {
        config = this.loadFromCliArgs(config, cliArgs);
      }

      // Validate using Zod
      this.config = this.validate(config);
      
      return this.config;
    } catch (error) {
      throw new ConfigurationError(
        `Failed to load configuration: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  get(): CLIAppConfiguration {
    return { ...this.config };
  }

  validate(config: unknown): CLIAppConfiguration {
    try {
      return CLIAppConfigurationSchema.parse(config);
    } catch (error) {
      throw new ConfigurationError(
        `Configuration validation failed: ${error instanceof Error ? error.message : 'Invalid configuration'}`
      );
    }
  }

  private loadFromEnvironment(config: CLIAppConfiguration): CLIAppConfiguration {
    return {
      ...config,
      logLevel: (process.env['LOG_LEVEL'] as any) || config.logLevel,
      logFile: process.env['LOG_FILE'] || config.logFile,
      verbose: process.env['VERBOSE'] === 'true' || config.verbose,
    };
  }

  private loadFromCliArgs(config: CLIAppConfiguration, args: string[]): CLIAppConfiguration {
    // Parse basic CLI arguments manually (before Commander.js processes them)
    // This handles the case where we need config before Commander.js runs
    const result = { ...config };
    
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      
      if (arg === '--log-level' && i + 1 < args.length) {
        const level = args[i + 1];
        if (level && ['debug', 'info', 'warn', 'error'].includes(level)) {
          result.logLevel = level as any;
        }
        i++; // Skip next argument since we consumed it
      } else if (arg === '--log-file' && i + 1 < args.length) {
        result.logFile = args[i + 1];
        i++; // Skip next argument since we consumed it
      } else if (arg === '--verbose' || arg === '-v') {
        result.verbose = true;
      }
    }
    
    return result;
  }
}