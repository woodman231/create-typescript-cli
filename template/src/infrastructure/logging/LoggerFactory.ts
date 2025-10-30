import { IFileSystemService } from "../../core/interfaces/IFileSystemService.js";
import { ILogger } from "../../core/interfaces/ILogger.js";
import { CLIAppConfiguration } from "../../core/types/Configuration.js";
import { ConsoleLogger } from "./ConsoleLogger.js";
import { FileLogger } from "./FileLogger.js";

export class LoggerFactory {
    static createLogger(type: 'console' | 'file', config: CLIAppConfiguration, fileSystemService?: IFileSystemService): ILogger {
        switch (type) {
            case 'console':
                return new ConsoleLogger(config.logLevel);
            case 'file':
                if (!config.logFile || !fileSystemService) {
                    throw new Error('File logger requires logFile path and fileSystemService');
                }
                return new FileLogger(config.logFile, fileSystemService, config.logLevel);
            default:
                throw new Error(`Unknown logger type: ${type}`);
        }
    }
}
