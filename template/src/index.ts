#!/usr/bin/env node

import { ApplicationBootstrapper } from './app/ApplicationBootstrapper.js';

async function main() {
  try {
    const app = await ApplicationBootstrapper.bootstrap();
    await app.run();
  } catch (error) {
    console.error('Failed to start application:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});