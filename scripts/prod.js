#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

console.log('🚀 Starting Acquisition App in Production Mode');
console.log('===============================================\n');

// Check if .env.production exists
if (!existsSync('.env.production')) {
    console.error('❌ Error: .env.production file not found!');
    console.error(
        '   Please create .env.production with your production environment variables.'
    );
    process.exit(1);
}

// Check if Docker is running
const dockerCheck = spawnSync('docker', ['info'], {
    stdio: 'ignore',
    shell: true,
});

if (dockerCheck.status !== 0) {
    console.error('❌ Error: Docker is not running!');
    console.error('   Please start Docker Desktop and try again.');
    process.exit(1);
}

console.log('📦 Building and starting production container...');
console.log('   - Using Neon Cloud Database');
console.log('   - Running in optimized production mode\n');

// Start production containers
const compose = spawnSync(
    'docker',
    ['compose', '-f', 'docker-compose.prod.yml', 'up', '--build', '-d'],
    {
        stdio: 'inherit',
        shell: true,
    }
);

if (compose.status !== 0) {
    process.exit(compose.status);
}

console.log('\n⏳ Waiting for containers to start...');

// Wait 5 seconds
await new Promise((resolve) => setTimeout(resolve, 5000));

console.log('📜 Applying latest schema with Drizzle...');

// Run migrations
const migrate = spawnSync('npm', ['run', 'db:migrate'], {
    stdio: 'inherit',
    shell: true,
});

if (migrate.status !== 0) {
    console.error('❌ Database migration failed.');
    process.exit(migrate.status);
}

console.log('\n🎉 Production environment started successfully!\n');

console.log('Application: http://localhost:3000');
console.log('Logs: docker logs acquisition-app-prod\n');

console.log('Useful commands:');
console.log('  npm run prod:docker:logs');
console.log('  npm run prod:docker:down');