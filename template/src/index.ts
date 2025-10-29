#!/usr/bin/env node

import { Command } from 'commander';

interface CliOptions {
  output?: string;
  format: string;
}

const program = new Command();

program
  .name('extract-image-texts')
  .description('A CLI application to extract text from images')
  .version('1.0.0');

program
  .argument('<image>', 'path to the image file')
  .option('-o, --output <file>', 'output file for extracted text')
  .option('-f, --format <format>', 'output format (txt, json)', 'txt')
  .action((image: string, options: CliOptions) => {
    console.log(`Processing image: ${image}`);
    console.log(`Output format: ${options.format}`);
    if (options.output) {
      console.log(`Output file: ${options.output}`);
    }
    // TODO: Implement image text extraction logic
  });

program.parse();