#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import prompts from 'prompts';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('🚀 Creating a new TypeScript CLI application...\n');

  const response = await prompts([
    {
      type: 'text',
      name: 'projectName',
      message: 'What is your project name?',
      initial: 'my-cli-app',
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

  const targetDir = path.resolve(process.cwd(), response.projectName);

  if (fs.existsSync(targetDir)) {
    console.error(`❌ Directory ${response.projectName} already exists`);
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
    '.name(\'extract-image-texts\')',
    `.name('${response.commandName}')`
  );
  indexContent = indexContent.replace(
    '.description(\'A CLI application to extract text from images\')',
    `.description('${response.description}')`
  );
  await fs.writeFile(indexPath, indexContent);

  // Update README
  const readmePath = path.join(targetDir, 'README.md');
  let readmeContent = await fs.readFile(readmePath, 'utf8');
  readmeContent = readmeContent.replace(/Extract Image Texts/g, response.projectName);
  readmeContent = readmeContent.replace(/extract-image-texts/g, response.commandName);
  readmeContent = readmeContent.replace(
    'A CLI application to extract text from images using OCR (Optical Character Recognition).',
    response.description
  );
  await fs.writeFile(readmePath, readmeContent);

  console.log('✅ Project created successfully!\n');
  console.log('Next steps:');
  console.log(`  cd ${response.projectName}`);
  console.log('  npm install');
  console.log('  npm run dev');
  console.log('\nHappy coding! 🎉');
}

main().catch(console.error);
