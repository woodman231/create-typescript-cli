import { Command } from 'commander';
import { ICommand } from "./ICommand.js";

export interface ICommandRegistry {
  register(command: ICommand): void;
  getCommand(name: string): ICommand | undefined;
  getAllCommands(): ICommand[];
  configureCommander(program: Command): void;
}
