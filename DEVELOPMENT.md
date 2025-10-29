# Development Setup

This document explains how to set up, test, and publish the `@woodman231/create-typescript-cli` package.

## Local Development

1. **Clone and setup**:
   ```bash
   git clone https://github.com/woodman231/create-typescript-cli.git
   cd create-typescript-cli
   npm install
   ```

2. **Test locally**:
   ```bash
   # Test the generator in a temporary directory
   mkdir test-output
   cd test-output
   node ../index.js
   ```

3. **Test the generated project**:
   ```bash
   cd your-test-project
   npm install
   npm run dev
   ```

## Publishing Process

### First Time Setup

1. **Create NPM account** (if you don't have one):
   ```bash
   npm adduser
   ```

2. **Login to NPM**:
   ```bash
   npm login
   ```

3. **Create NPM token** for GitHub Actions:
   - Go to https://www.npmjs.com/settings/tokens
   - Create a new "Automation" token
   - Add it as `NPM_TOKEN` secret in your GitHub repository

### Publishing Steps

1. **Update version** in `package.json`:
   ```bash
   npm version patch  # or minor, major
   ```

2. **Push changes and tags**:
   ```bash
   git push origin main --tags
   ```

3. **Create GitHub Release**:
   - Go to your repository on GitHub
   - Click "Releases" → "Create a new release"
   - Choose the tag you just created
   - GitHub Actions will automatically publish to NPM

### Manual Publishing (if needed)

```bash
npm publish --access public
```

## Directory Structure

```
create-typescript-cli/
├── .github/
│   └── workflows/
│       ├── publish.yml      # Auto-publish on release
│       └── release.yml      # Create release on tag
├── template/                # Template files for generated projects
│   ├── src/
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── .eslintrc.json
│   ├── .gitignore
│   └── README.md
├── index.js                 # Main generator script
├── package.json             # Package configuration
├── README.md               # User documentation
├── DEVELOPMENT.md          # This file
└── LICENSE                 # MIT License
```

## Testing Checklist

Before publishing, ensure:

- [ ] Generator runs without errors
- [ ] Generated project installs dependencies successfully
- [ ] Generated project builds (`npm run build`)
- [ ] Generated project runs (`npm start`)
- [ ] CLI help works (`npm start -- --help`)
- [ ] All template placeholders are replaced
- [ ] README is updated with correct information
