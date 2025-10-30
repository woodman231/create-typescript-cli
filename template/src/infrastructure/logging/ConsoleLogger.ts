import { ILogger } from '../../core/interfaces/ILogger.js';
import { LogLevel, LOG_LEVEL_HIERARCHY } from '../../core/types/LogLevel.js';

export class ConsoleLogger implements ILogger {
    constructor(private logLevel: LogLevel = 'info') { }

    debug(message: string): void {
        if (this.shouldLog('debug')) {
            console.log(`[DEBUG] ${message}`);
        }
    }

    info(message: string): void {
        if (this.shouldLog('info')) {
            console.log(`[INFO] ${message}`);
        }
    }

    warn(message: string): void {
        if (this.shouldLog('warn')) {
            console.warn(`[WARN] ${message}`);
        }
    }

    error(message: string): void {
        if (this.shouldLog('error')) {
            console.error(`[ERROR] ${message}`);
        }
    }    

    private shouldLog(level: LogLevel): boolean {
        return LOG_LEVEL_HIERARCHY[level] >= LOG_LEVEL_HIERARCHY[this.logLevel];
    }
}