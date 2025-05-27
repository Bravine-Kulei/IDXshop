#!/usr/bin/env node

/**
 * M-Pesa Frontend Test Runner
 * Script to run M-Pesa frontend tests with proper configuration
 * 
 * @author G20Shop Development Team
 * @version 1.0.0
 * @since 2024-01-15
 */

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
} as const;

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message: string) {
  log('\n' + '='.repeat(60), 'cyan');
  log(`🧪 ${message}`, 'bright');
  log('='.repeat(60), 'cyan');
}

function logSuccess(message: string) {
  log(`✅ ${message}`, 'green');
}

function logError(message: string) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message: string) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message: string) {
  log(`ℹ️  ${message}`, 'blue');
}

async function runCommand(command: string, args: string[], options: any = {}): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function checkPrerequisites() {
  logHeader('Checking Prerequisites');
  
  // Check if Vitest is installed
  try {
    await runCommand('npx', ['vitest', '--version'], { stdio: 'pipe' });
    logSuccess('Vitest is installed');
  } catch (error) {
    logError('Vitest is not installed. Please run: npm install --save-dev vitest');
    process.exit(1);
  }
  
  // Check if test files exist
  const testFiles = [
    'tests/mpesa/mpesa-service.test.ts',
    'tests/mpesa/mpesa-context.test.tsx',
    'tests/mpesa/mpesa-components.test.tsx'
  ];
  
  for (const testFile of testFiles) {
    if (fs.existsSync(path.join(__dirname, '../../', testFile))) {
      logSuccess(`Found ${testFile}`);
    } else {
      logWarning(`Test file not found: ${testFile}`);
    }
  }
  
  // Check if M-Pesa feature files exist
  const featureFiles = [
    'src/features/mpesa/services/mpesa.service.ts',
    'src/features/mpesa/contexts/MpesaContext.tsx',
    'src/features/mpesa/components/RefundButton.tsx'
  ];
  
  for (const featureFile of featureFiles) {
    if (fs.existsSync(path.join(__dirname, '../../', featureFile))) {
      logSuccess(`Found ${featureFile}`);
    } else {
      logWarning(`Feature file not found: ${featureFile}`);
    }
  }
}

async function runMpesaTests() {
  logHeader('Running M-Pesa Frontend Tests');
  
  const vitestConfig = path.join(__dirname, 'vitest.config.ts');
  
  try {
    await runCommand('npx', [
      'vitest',
      'run',
      '--config', vitestConfig,
      '--coverage',
      '--reporter=verbose',
      '--reporter=json',
      '--reporter=html'
    ]);
    
    logSuccess('All M-Pesa frontend tests passed!');
    return true;
  } catch (error) {
    logError('Some M-Pesa frontend tests failed');
    return false;
  }
}

async function runWatchMode() {
  logHeader('Running M-Pesa Frontend Tests in Watch Mode');
  
  const vitestConfig = path.join(__dirname, 'vitest.config.ts');
  
  try {
    await runCommand('npx', [
      'vitest',
      '--config', vitestConfig,
      '--coverage',
      '--reporter=verbose'
    ]);
  } catch (error) {
    logError('Watch mode interrupted');
  }
}

async function generateTestReport() {
  logHeader('Generating Test Report');
  
  const coverageDir = path.join(__dirname, '../../coverage/mpesa');
  const testResultsDir = path.join(__dirname, '../../test-results/mpesa');
  
  if (fs.existsSync(coverageDir)) {
    logSuccess('Coverage report generated');
    logInfo(`Coverage report available at: ${coverageDir}/index.html`);
  } else {
    logWarning('Coverage report not found');
  }
  
  if (fs.existsSync(testResultsDir)) {
    logSuccess('Test results generated');
    logInfo(`Test results available at: ${testResultsDir}/index.html`);
  } else {
    logWarning('Test results not found');
  }
}

async function main() {
  const startTime = Date.now();
  const args = process.argv.slice(2);
  const watchMode = args.includes('--watch') || args.includes('-w');
  
  log('\n🚀 Starting M-Pesa Frontend Test Suite', 'bright');
  log(`📅 ${new Date().toLocaleString()}`, 'cyan');
  
  if (watchMode) {
    log('👀 Running in watch mode', 'yellow');
  }
  
  try {
    // Check prerequisites
    await checkPrerequisites();
    
    if (watchMode) {
      // Run in watch mode
      await runWatchMode();
    } else {
      // Run tests once
      const testsPassed = await runMpesaTests();
      
      // Generate report
      await generateTestReport();
      
      // Summary
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      
      logHeader('Test Summary');
      log(`⏱️  Duration: ${duration} seconds`, 'cyan');
      
      if (testsPassed) {
        logSuccess('M-Pesa Frontend Tests: PASSED');
        log('\n🎉 All tests completed successfully!', 'green');
        process.exit(0);
      } else {
        logError('M-Pesa Frontend Tests: FAILED');
        log('\n💥 Some tests failed. Please check the output above.', 'red');
        process.exit(1);
      }
    }
    
  } catch (error) {
    logError(`Test execution failed: ${(error as Error).message}`);
    process.exit(1);
  }
}

// Handle process signals
process.on('SIGINT', () => {
  log('\n\n⚠️  Test execution interrupted by user', 'yellow');
  process.exit(1);
});

process.on('SIGTERM', () => {
  log('\n\n⚠️  Test execution terminated', 'yellow');
  process.exit(1);
});

// Run the test suite
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    logError(`Unexpected error: ${error.message}`);
    process.exit(1);
  });
}
