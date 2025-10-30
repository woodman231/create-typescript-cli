import { ILogger } from '../../core/interfaces/ILogger.js';
import { IFileSystemService } from '../../core/interfaces/IFileSystemService.js';
import { LogLevel, LOG_LEVEL_HIERARCHY } from '../../core/types/LogLevel.js';

export class FileLogger implements ILogger {
  constructor(
    private filePath: string,
    private fileSystem: IFileSystemService,
    private logLevel: LogLevel = 'info'
  ) {}

  debug(message: string): void {
    if (this.shouldLog('debug')) {
      this.writeLog('DEBUG', message);
    }
  }

  info(message: string): void {
    if (this.shouldLog('info')) {
      this.writeLog('INFO', message);
    }
  }

  warn(message: string): void {
    if (this.shouldLog('warn')) {
      this.writeLog('WARN', message);
    }
  }

  error(message: string): void {
    if (this.shouldLog('error')) {
      this.writeLog('ERROR', message);
    }
  }

  private writeLog(level: string, message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}\n`;
    
    try {
      let existingContent = '';
      if (this.fileSystem.exists(this.filePath)) {
        existingContent = this.fileSystem.readFile(this.filePath) as string;
      }
      this.fileSystem.writeFile(this.filePath, existingContent + logEntry);
    } catch (error) {
      console.error(`Failed to write to log file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_HIERARCHY[level] >= LOG_LEVEL_HIERARCHY[this.logLevel];
  }
}