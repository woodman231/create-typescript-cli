# {{PROJECT_NAME}}

{{DESCRIPTION}}

A modern TypeScript CLI application built with a clean architecture following SOLID principles. This template provides dependency injection, comprehensive logging, Zod validation, and an extensible command system out of the box.

## 🚀 Quick Start

### From npm (when published)
```bash
npm install -g {{PROJECT_NAME}}
```

### Development Installation
```bash
git clone <repository-url>
cd {{PROJECT_NAME}}
npm install
npm run build
npm start echo -n "World"
```

## 📖 Usage

### Global Options
Available for all commands:
- `-l, --log-file <path>`: Specify a log file for output
- `--log-level <level>`: Set log level (debug, info, warn, error) - default: info
- `-v, --verbose`: Enable verbose output
- `-V, --version`: Output the version number
- `-h, --help`: Display help

### Built-in Commands

#### Echo Command
```bash
{{COMMAND_NAME}} echo [options]
```

Options:
- `-n, --name <name>`: Name to echo (required)
- `-u, --uppercase`: Convert output to uppercase  
- `-r, --repeat <count>`: Repeat the output multiple times (default: 1)

Examples:
```bash
# Simple echo
{{COMMAND_NAME}} echo -n "John Doe"

# With global options
{{COMMAND_NAME}} echo -n "John Doe" --log-level debug --verbose

# With transformations
{{COMMAND_NAME}} echo -n "John Doe" --uppercase --repeat 3

# With file logging
{{COMMAND_NAME}} echo -n "John Doe" --log-file output.log
```

## 🏗️ Architecture Overview

This CLI application follows a layered architecture with dependency injection:

```
src/
├── app/                          # Application layer
│   ├── ApplicationBootstrapper.ts # DI container setup
│   └── CLIApplication.ts          # Main CLI orchestrator
├── commands/                     # Command layer (features)
│   ├── base/                     # Shared command infrastructure
│   │   └── BaseCommand.ts
│   └── echo/                     # Echo command feature
│       ├── EchoCommand.ts
│       └── EchoOptions.ts
├── core/                         # Core domain
│   ├── interfaces/               # Core abstractions
│   │   ├── ICommand.ts
│   │   ├── ICommandRegistry.ts
│   │   ├── IConfigurationService.ts
│   │   ├── IFileSystemService.ts
│   │   └── ILogger.ts
│   ├── types/                    # Shared type definitions
│   │   ├── CommandResult.ts
│   │   ├── Configuration.ts
│   │   └── LogLevel.ts
│   └── errors/                   # Domain errors
│       ├── CLIError.ts
│       ├── CommandError.ts
│       └── ConfigurationError.ts
├── infrastructure/               # Infrastructure layer
│   ├── di/                      # Dependency injection
│   │   └── DIContainer.ts
│   ├── configuration/           # Configuration management
│   │   └── ConfigurationService.ts
│   ├── commands/                # Command infrastructure
│   │   └── CommandRegistry.ts
│   ├── logging/                 # Logging infrastructure
│   │   ├── ConsoleLogger.ts
│   │   ├── FileLogger.ts
│   │   └── CompositeLogger.ts
│   └── filesystem/              # File system abstraction
│       └── FileSystemService.ts
└── index.ts                     # Entry point
```

### Key Design Principles

- **Dependency Injection**: All services are injectable and testable
- **SOLID Principles**: Single responsibility, open/closed, dependency inversion
- **Configuration Management**: Unified config from defaults, environment, and CLI args
- **Validation**: Zod schemas for type-safe configuration and command options
- **Logging**: Configurable logging to console and/or files
- **Error Handling**: Structured error hierarchy with proper exit codes

## 🔧 Development Guide

### Adding a New Command

Let's create a complete example: a `file-info` command that displays information about a file.

#### 1. Create the Command Options Schema

Create `src/commands/file-info/FileInfoOptions.ts`:
```typescript
import { z } from 'zod';

export const FileInfoOptionsSchema = z.object({
  path: z.string().min(1, 'File path is required'),
  size: z.boolean().default(false),
  permissions: z.boolean().default(false),
  format: z.enum(['table', 'json']).default('table'),
});

export type FileInfoOptions = z.infer<typeof FileInfoOptionsSchema>;
```

#### 2. Create the Command Implementation

Create `src/commands/file-info/FileInfoCommand.ts`:
```typescript
import { Command } from 'commander';
import { BaseCommand } from '../base/BaseCommand.js';
import { CommandResult } from '../../core/types/CommandResult.js';
import { CLIAppConfiguration } from '../../core/types/Configuration.js';
import { FileInfoOptions, FileInfoOptionsSchema } from './FileInfoOptions.js';
import { ILogger } from '../../core/interfaces/ILogger.js';
import { IFileSystemService } from '../../core/interfaces/IFileSystemService.js';
import { statSync } from 'fs';

export class FileInfoCommand extends BaseCommand {
  readonly name = 'file-info';
  readonly description = 'Display information about a file';

  constructor(
    logger: ILogger,
    private config: CLIAppConfiguration,
    private fileSystem: IFileSystemService
  ) {
    super(logger);
  }

  configure(program: Command): void {
    program
      .command(this.name)
      .description(this.description)
      .requiredOption('-p, --path <path>', 'path to the file')
      .option('-s, --size', 'show file size', false)
      .option('--permissions', 'show file permissions', false)
      .option('-f, --format <format>', 'output format (table, json)', 'table')
      .action(async (rawOptions) => {
        try {
          const options = FileInfoOptionsSchema.parse({
            path: rawOptions.path,
            size: rawOptions.size,
            permissions: rawOptions.permissions,
            format: rawOptions.format,
          });

          const result = await this.executeCommand(options, this.config);
          
          if (!result.success) {
            process.exit(1);
          }
        } catch (error) {
          this.logger.error(`Command failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
          process.exit(1);
        }
      });
  }

  protected async executeCommand(options: FileInfoOptions, config: CLIAppConfiguration): Promise<CommandResult> {
    try {
      if (!this.fileSystem.exists(options.path)) {
        this.logger.error(`File not found: ${options.path}`);
        return { success: false, message: 'File not found' };
      }

      const stats = statSync(options.path);
      
      // Use global verbose setting from configuration
      const isVerbose = config.verbose;
      
      if (options.format === 'json') {
        // JSON output format
        const fileInfo = {
          path: options.path,
          size: stats.size,
          permissions: stats.mode.toString(8),
          type: stats.isFile() ? 'file' : stats.isDirectory() ? 'directory' : 'other',
          ...(isVerbose && {
            created: stats.birthtime.toISOString(),
            modified: stats.mtime.toISOString(),
            accessed: stats.atime.toISOString(),
          })
        };
        this.logger.info(JSON.stringify(fileInfo, null, 2));
      } else {
        // Table output format (default)
        this.logger.info(`File: ${options.path}`);
        
        if (options.size || isVerbose) {
          this.logger.info(`Size: ${stats.size} bytes`);
        }
        
        if (options.permissions || isVerbose) {
          this.logger.info(`Permissions: ${stats.mode.toString(8)}`);
        }
        
        if (isVerbose) {
          this.logger.info(`Type: ${stats.isFile() ? 'File' : stats.isDirectory() ? 'Directory' : 'Other'}`);
          this.logger.info(`Created: ${stats.birthtime.toISOString()}`);
          this.logger.info(`Modified: ${stats.mtime.toISOString()}`);
          this.logger.info(`Accessed: ${stats.atime.toISOString()}`);
        }
      }

      return {
        success: true,
        message: `File info displayed for ${options.path}`,
        data: { path: options.path, stats }
      };
    } catch (error) {
      const message = `Failed to get file info: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(message);
      return { success: false, message };
    }
  }
}
```

#### 3. Register the Command

Update `src/app/ApplicationBootstrapper.ts` to register your new command:
```typescript
// Add import at the top
import { FileInfoCommand } from '../commands/file-info/FileInfoCommand.js';

// In the bootstrap method, add after the echo command registration:
const fileSystem = container.resolve<FileSystemService>('fileSystem');
commandRegistry.register(new FileInfoCommand(logger, config, fileSystem));
```

#### 4. Test Your New Command

```bash
npm run build

# Basic usage
node dist/index.js file-info -p package.json

# With command-specific options
node dist/index.js file-info -p package.json --size --permissions

# With global verbose option (shows detailed info)
node dist/index.js file-info -p package.json --verbose

# With JSON format output
node dist/index.js file-info -p package.json --format json

# Combining global and command options
node dist/index.js file-info -p package.json --verbose --log-level debug --format json
```

### Removing the Echo Command

To safely remove the echo command:

#### 1. Remove Command Files
```bash
rm -rf src/commands/echo/
```

#### 2. Remove Registration
In `src/app/ApplicationBootstrapper.ts`, remove:
```typescript
// Remove this import
import { EchoCommand } from '../commands/echo/EchoCommand.js';

// Remove this registration line
commandRegistry.register(new EchoCommand(logger, config));
```

#### 3. Clean Up Tests (when you add them)
Remove any test files related to the echo command.

#### 4. Update Documentation
Remove echo command references from README.md.

### Working with Global Configuration

Commands automatically receive the global configuration through dependency injection. Here's how to access and use global options:

```typescript
protected async executeCommand(options: YourOptions, config: CLIAppConfiguration): Promise<CommandResult> {
  // Access global configuration values
  const isVerbose = config.verbose;           // --verbose flag
  const logLevel = config.logLevel;           // --log-level option
  const logFile = config.logFile;             // --log-file option
  
  // Use global settings to modify behavior
  if (isVerbose) {
    this.logger.debug('Verbose mode enabled - showing detailed output');
    // Show extra information
  }
  
  if (logLevel === 'debug') {
    this.logger.debug(`Processing with options: ${JSON.stringify(options)}`);
  }
  
  // Your command logic here
}
```

**Key Points:**
- **Don't redefine global options** in your command schemas
- **Use the injected config** to access global settings
- **Global options are parsed before** your command runs
- **Combine global and command-specific options** for rich functionality

### Command Option Design Guidelines

When designing command options, follow these principles:

1. **Command-specific options**: Features unique to this command
   ```typescript
   // ✅ Good - specific to file-info command
   --format <format>    // Output format for this command
   --permissions        // Show file permissions
   ```

2. **Avoid global option conflicts**: Don't redefine existing global options
   ```typescript
   // ❌ Bad - conflicts with global --verbose
   --verbose           // Already exists globally
   
   // ✅ Good - use global config instead
   config.verbose      // Access global setting
   ```

3. **Use descriptive names**: Make options self-documenting
   ```typescript
   // ❌ Bad - unclear what this does
   --show-all
   
   // ✅ Good - clear and specific
   --include-hidden-files
   ```

### Testing Strategy

#### Unit Testing
For unit tests, create mocks for dependencies:
```typescript
// Example test setup
const mockLogger = new MockLogger();
const mockFileSystem = new MockFileSystemService();
const mockConfig = { logLevel: 'info', verbose: false };

const command = new FileInfoCommand(mockLogger, mockConfig, mockFileSystem);
```

#### Integration Testing
Test the full command flow:
```typescript
// Test command registration and execution
const container = await ApplicationBootstrapper.bootstrap();
const app = new CLIApplication(container);
await app.run(['node', 'cli', 'file-info', '-p', 'test.txt']);
```

## 📜 Scripts

- `npm run build`: Build the TypeScript project
- `npm run build:watch`: Build in watch mode for development
- `npm run dev`: Run development version with tsx (no build needed)
- `npm start`: Run the built version from dist/
- `npm run clean`: Clean the dist directory
- `npm run lint`: Run ESLint
- `npm run lint:fix`: Run ESLint with auto-fix

## 🛠️ Local Development Tips

### Testing Your CLI Locally with npm link

When developing your CLI, you can test it as if it were installed globally without actually publishing it:

#### 1. Link Your Package Globally
```bash
# From your project directory
npm link
```

This creates a global symlink to your project, making the command available system-wide.

#### 2. Use Your Command Anywhere
```bash
# Now you can run your CLI from any directory
{{COMMAND_NAME}} echo -n "Testing"
```

#### 3. Develop with Watch Mode
For the best development experience, keep the build process running in watch mode:

```bash
# Terminal 1: Keep TypeScript compiling automatically
npm run build:watch
```

```bash
# Terminal 2: Test your changes immediately
{{COMMAND_NAME}} echo -n "Testing new features"
```

Any changes you make to the TypeScript source will be automatically compiled, and since your package is linked, the global command will use the latest build immediately.

#### 4. Unlink When Done
When you're finished developing or want to test a fresh install:

```bash
# Remove the global symlink
npm unlink -g {{COMMAND_NAME}}

# Or equivalently
npm unlink
```

#### 5. Test Fresh Installation
After unlinking, you can test the installation process:

```bash
# Build the package
npm run build

# Install globally (after publishing to npm)
npm install -g {{PROJECT_NAME}}

# Or install from the local directory
npm install -g .
```

### Development Workflow Summary

**Recommended workflow for active development:**
1. `npm link` - Create global link once
2. `npm run build:watch` - Keep running in one terminal
3. Make changes to TypeScript files
4. Test with `{{COMMAND_NAME}}` - Changes apply automatically
5. `npm unlink -g {{COMMAND_NAME}}` - Clean up when finished

**For testing installation:**
1. `npm unlink -g {{COMMAND_NAME}}` - Remove dev link if present
2. `npm run build` - Build the project
3. `npm install -g .` - Install from local directory
4. Test the installed version
5. `npm uninstall -g {{COMMAND_NAME}}` - Uninstall when done

## 🔧 Configuration

### Environment Variables
- `LOG_LEVEL`: Set default log level (debug, info, warn, error)
- `LOG_FILE`: Set default log file path
- `VERBOSE`: Set verbose mode (true/false)

### Configuration Priority
1. CLI arguments (highest priority)
2. Environment variables
3. Default values (lowest priority)

## 🧪 Best Practices

### Command Development
1. Always use Zod for option validation
2. Inject dependencies through constructor
3. Use the logger for all output
4. Return structured CommandResult objects
5. Handle errors gracefully with proper messages

### Error Handling
```typescript
try {
  // Command logic
  return { success: true, data: result };
} catch (error) {
  this.logger.error(`Operation failed: ${error.message}`);
  return { success: false, message: error.message };
}
```

### Logging Best Practices
```typescript
this.logger.debug('Detailed diagnostic information');
this.logger.info('General information for users');
this.logger.warn('Warning messages');
this.logger.error('Error messages');
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-command`)
3. Follow the architecture patterns shown above
4. Add tests for new functionality
5. Run `npm run lint` and `npm run build`
6. Submit a pull request

## 📄 License

{{LICENSE || 'ISC'}}
