# @woodman231/create-typescript-cli

A template generator for creating modern TypeScript CLI applications with best practices built-in.

## Usage

```bash
npm create @woodman231/typescript-cli my-new-app
```

Or with other package managers:

```bash
# With yarn
yarn create @woodman231/typescript-cli my-new-app

# With pnpm
pnpm create @woodman231/typescript-cli my-new-app

# With bun
bun create @woodman231/typescript-cli my-new-app
```

## What's Included

The generated project includes:

- ✅ **TypeScript** with strict configuration
- ✅ **ESLint** for code quality
- ✅ **Commander.js** for CLI argument parsing
- ✅ **Modern ES modules** support
- ✅ **Development scripts** (dev, build, lint)
- ✅ **Proper package.json** configuration for CLI apps
- ✅ **Git ready** with .gitignore
- ✅ **README** with documentation

## Project Structure

```
my-new-app/
├── src/
│   └── index.ts          # Main CLI entry point
├── package.json          # Package configuration
├── tsconfig.json         # TypeScript configuration
├── .eslintrc.json        # ESLint configuration
├── .gitignore           # Git ignore patterns
└── README.md            # Project documentation
```

## Interactive Setup

The generator will prompt you for:

- **Project name**: The name of your CLI application
- **Description**: A brief description of what your CLI does
- **Author**: Your name
- **Command name**: The CLI command users will type (defaults to project name)

## After Creation

1. Navigate to your project: `cd my-new-app`
2. Install dependencies: `npm install`
3. Start development: `npm run dev`
4. Edit `src/index.ts` to implement your CLI logic

## Development Scripts

- `npm run dev` - Run in development mode with hot reload
- `npm run build` - Build for production
- `npm run lint` - Check code quality
- `npm run lint:fix` - Fix linting issues
- `npm start` - Run the built version

## Example CLI

The generated CLI includes a complete example with:

- Command-line argument parsing
- Options and flags
- Help documentation
- Version command
- TypeScript types

## Contributing

Issues and pull requests are welcome! Visit the [repository](https://github.com/woodman231/create-typescript-cli) to contribute.

## License

MIT
