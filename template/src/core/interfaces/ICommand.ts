import { Command } from 'commander';
import { CommandResult } from "../types/CommandResult.js";
import { CLIAppConfiguration } from '../types/Configuration.js';

export interface ICommand {
  readonly name: string;
  readonly description: string;
  
  configure(program: Command): void;
  execute(options: any, config: CLIAppConfiguration): Promise<CommandResult>;
}