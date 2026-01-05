import { readFileSync } from 'fs';
import { DIContainer } from '../infrastructure/di/DIContainer.js';
import { ConfigurationService } from '../infrastructure/configuration/ConfigurationService.js';
import { FileSystemService } from '../infrastructure/filesystem/FileSystemService.js';
import { ConsoleLogger } from '../infrastructure/logging/ConsoleLogger.js';
import { FileLogger } from '../infrastructure/logging/FileLogger.js';
import { CompositeLogger } from '../infrastructure/logging/CompositeLogger.js';
import { CommandRegistry } from '../infrastructure/commands/CommandRegistry.js';
import { EchoCommand } from '../commands/echo/EchoCommand.js';
import { CLIApplication } from './CLIApplication.js';

export class ApplicationBootstrapper {
  static async bootstrap(): Promise<CLIApplication> {
    const container = new DIContainer();

    // Register core services
    container.registerInstance('fileSystem', new FileSystemService());
    container.registerInstance('configurationService', new ConfigurationService());

    // Load configuration
    const configService = container.resolve<ConfigurationService>('configurationService');
    const config = await configService.load(process.argv);
    container.registerInstance('config', config);

    // Register logger based on configuration
    const compositeLogger = new CompositeLogger();
    compositeLogger.addLogger(new ConsoleLogger(config.logLevel));
    
    if (config.logFile) {
      const fileSystem = container.resolve<FileSystemService>('fileSystem');
      compositeLogger.addLogger(new FileLogger(config.logFile, fileSystem, config.logLevel));
    }
    
    container.registerInstance('logger', compositeLogger);

    // Register command registry and commands
    const commandRegistry = new CommandRegistry();    
    
    // Register all commands
    commandRegistry.register(new EchoCommand(container));
    
    container.registerInstance('commandRegistry', commandRegistry);    

    // Create and return CLI application
    return new CLIApplication(container);
  }

  static getPackageInfo(): { name: string; description: string; version: string } {
    try {
      const packageJson = JSON.parse(
        readFileSync(new URL('../../package.json', import.meta.url), 'utf8')
      );
      
      return {
        name: Object.keys(packageJson.bin || {})[0] || 'my-cli-app',
        description: packageJson.description || 'A CLI application',
        version: packageJson.version || '1.0.0'
      };
    } catch (error) {
      return {
        name: 'my-cli-app',
        description: 'A CLI application',
        version: '1.0.0'
      };
    }
  }
}