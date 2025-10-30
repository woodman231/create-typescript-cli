import { ILogger } from '../../core/interfaces/ILogger.js';

export class CompositeLogger implements ILogger {
  private loggers: ILogger[] = [];

  addLogger(logger: ILogger): void {
    this.loggers.push(logger);
  }

  debug(message: string): void {
    this.loggers.forEach(logger => logger.debug(message));
  }

  info(message: string): void {
    this.loggers.forEach(logger => logger.info(message));
  }

  warn(message: string): void {
    this.loggers.forEach(logger => logger.warn(message));
  }

  error(message: string): void {
    this.loggers.forEach(logger => logger.error(message));
  }
}