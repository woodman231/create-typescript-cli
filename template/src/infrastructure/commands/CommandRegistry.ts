import { Command } from 'commander';
import { ICommand } from '../../core/interfaces/ICommand.js';
import { ICommandRegistry } from '../../core/interfaces/ICommandRegistry.js';
import { CommandError } from '../../core/errors/CommandError.js';

export class CommandRegistry implements ICommandRegistry {
  private commands = new Map<string, ICommand>();

  register(command: ICommand): void {
    if (this.commands.has(command.name)) {
      throw new CommandError(`Command '${command.name}' is already registered`);
    }
    this.commands.set(command.name, command);
  }

  getCommand(name: string): ICommand | undefined {
    return this.commands.get(name);
  }

  getAllCommands(): ICommand[] {
    return Array.from(this.commands.values());
  }

  configureCommander(program: Command): void {
    this.commands.forEach(command => {
      command.configure(program);
    });
  }
}
