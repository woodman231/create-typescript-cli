#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import prompts from 'prompts';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('🚀 Creating a new TypeScript CLI application...\n');

  // Get folder name from command line argument
  const args = process.argv.slice(2);
  const folderName = args[0];

  if (!folderName) {
    console.error('❌ Please provide a folder name');
    console.log('Usage: npm create @woodman231/typescript-cli <folder-name>');
    process.exit(1);
  }

  const targetDir = path.resolve(process.cwd(), folderName);

  if (fs.existsSync(targetDir)) {
    console.error(`❌ Directory ${folderName} already exists`);
    process.exit(1);
  }

  const response = await prompts([
    {
      type: 'text',
      name: 'projectName',
      message: 'What is your project name?',
      initial: folderName,
      validate: value => value.length > 0 ? true : 'Project name is required'
    },
    {
      type: 'text',
      name: 'description',
      message: 'Project description:',
      initial: 'A TypeScript CLI application'
    },
    {
      type: 'text',
      name: 'author',
      message: 'Author name:',
      initial: ''
    },
    {
      type: 'text',
      name: 'commandName',
      message: 'CLI command name:',
      initial: prev => prev.replace(/[^a-z0-9-]/gi, '-').toLowerCase(),
      validate: value => /^[a-z0-9-]+$/.test(value) ? true : 'Command name must contain only lowercase letters, numbers, and hyphens'
    }
  ]);

  if (!response.projectName) {
    console.log('❌ Project creation cancelled');
    process.exit(0);
  }

  if (fs.existsSync(targetDir)) {
    console.error(`❌ Directory ${folderName} already exists`);
    process.exit(1);
  }

  console.log(`📁 Creating project in ${targetDir}...\n`);

  // Copy template files
  const templateDir = path.join(__dirname, 'template');
  await fs.copy(templateDir, targetDir);

  // Update package.json with user inputs
  const packageJsonPath = path.join(targetDir, 'package.json');
  let packageJsonContent = await fs.readFile(packageJsonPath, 'utf8');
  
  packageJsonContent = packageJsonContent
    .replace(/{{PROJECT_NAME}}/g, response.projectName)
    .replace(/{{DESCRIPTION}}/g, response.description)
    .replace(/{{AUTHOR}}/g, response.author)
    .replace(/{{COMMAND_NAME}}/g, response.commandName);

  await fs.writeFile(packageJsonPath, packageJsonContent);

  // Update CLI program name in index.ts
  const indexPath = path.join(targetDir, 'src', 'index.ts');
  let indexContent = await fs.readFile(indexPath, 'utf8');
  indexContent = indexContent.replace(
    '.name(\'my-cli-app\')',
    `.name('${response.commandName}')`
  );
  indexContent = indexContent.replace(
    '.description(\'A simple CLI application that echoes your name\')',
    `.description('${response.description}')`
  );
  await fs.writeFile(indexPath, indexContent);

  // Update README
  const readmePath = path.join(targetDir, 'README.md');
  let readmeContent = await fs.readFile(readmePath, 'utf8');
  readmeContent = readmeContent.replace(/My CLI App/g, response.projectName);
  readmeContent = readmeContent.replace(/my-cli-app/g, response.commandName);
  readmeContent = readmeContent.replace(
    'A simple CLI application that echoes your name with optional transformations.',
    response.description
  );
  await fs.writeFile(readmePath, readmeContent);

  console.log('✅ Project created successfully!\n');
  console.log('Next steps:');
  console.log(`  cd ${folderName}`);
  console.log('  npm install');
  console.log('  npm run dev');
  console.log('\nHappy coding! 🎉');
}

main().catch(console.error);
