import { CLIAppConfiguration } from "../../core/types/Configuration.js";

export function shouldLog(level: string, config: CLIAppConfiguration): boolean {
    const levels: string[] = ['debug', 'info', 'warn', 'error', 'fatal'];
    const configLevelIndex = levels.indexOf(config.logLevel || 'info');
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= configLevelIndex;
}
