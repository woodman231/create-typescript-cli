# Extract Image Texts

A CLI application to extract text from images using OCR (Optical Character Recognition).

## Installation

### From npm (when published)
```bash
npm install -g extract-image-texts
```

### Development Installation
```bash
git clone <repository-url>
cd extract-image-texts
npm install
npm run build
```

## Usage

```bash
extract-image-texts <image-path> [options]
```

### Options

- `-o, --output <file>`: Output file for extracted text
- `-f, --format <format>`: Output format (txt, json) - default: txt
- `-V, --version`: Output the version number
- `-h, --help`: Display help for command

### Examples

```bash
# Extract text from an image and display in console
extract-image-texts image.png

# Extract text and save to a file
extract-image-texts image.png -o extracted-text.txt

# Extract text in JSON format
extract-image-texts image.png -f json -o extracted-text.json
```

## Development

### Scripts

- `npm run build`: Build the TypeScript project
- `npm run build:watch`: Build in watch mode
- `npm run dev`: Run the development version with tsx
- `npm start`: Run the built JavaScript version
- `npm run clean`: Clean the dist directory
- `npm run lint`: Run ESLint
- `npm run lint:fix`: Run ESLint with auto-fix

### Project Structure

```
├── src/
│   └── index.ts          # Main CLI entry point
├── dist/                 # Built JavaScript files
├── package.json          # Package configuration
├── tsconfig.json         # TypeScript configuration
├── .eslintrc.json        # ESLint configuration
└── README.md            # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run lint` to check code style
5. Run `npm run build` to ensure it builds correctly
6. Submit a pull request

## License

ISC
