#!/usr/bin/env node

import { existsSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

console.log('🚀 Starting Acquisition App in Development Mode');
console.log('================================================\n');

// Check .env.development
if (!existsSync('.env.development')) {
  console.error('❌ Error: .env.development file not found!');
  process.exit(1);
}

// Check Docker
const dockerCheck = spawnSync('docker', ['info'], {
  stdio: 'ignore',
  shell: true,
});

if (dockerCheck.status !== 0) {
  console.error('❌ Docker Desktop is not running.');
  process.exit(1);
}

// Create .neon_local directory if needed
if (!existsSync('.neon_local')) {
  mkdirSync('.neon_local');
}

console.log('📦 Building development environment...\n');

// Start Docker Compose
const compose = spawnSync(
  'docker',
  ['compose', '-f', 'docker-compose.dev.yml', 'up', '--build'],
  {
    stdio: 'inherit',
    shell: true,
  }
);

process.exit(compose.status ?? 0);
