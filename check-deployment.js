#!/usr/bin/env node

/**
 * Health Check Script for Deployed Application
 * Run: node check-deployment.js <backend-url> <frontend-url>
 * Example: node check-deployment.js https://api.example.com https://app.example.com
 */

const https = require('https');
const http = require('http');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: data,
          headers: res.headers
        });
      });
    }).on('error', reject);
  });
}

async function checkBackend(backendUrl) {
  log('\n🔍 Checking Backend...', 'blue');

  try {
    // Health check
    log('  Testing /api/health endpoint...', 'yellow');
    const healthUrl = `${backendUrl}/api/health`;
    const health = await makeRequest(healthUrl);

    if (health.statusCode === 200) {
      log('  ✅ Health check passed', 'green');
    } else {
      log(`  ❌ Health check failed (Status: ${health.statusCode})`, 'red');
      return false;
    }

    // Check CORS headers
    log('  Checking CORS configuration...', 'yellow');
    if (health.headers['access-control-allow-origin']) {
      log(`  ✅ CORS enabled: ${health.headers['access-control-allow-origin']}`, 'green');
    } else {
      log('  ⚠️  CORS headers not found', 'yellow');
    }

    return true;
  } catch (error) {
    log(`  ❌ Backend check failed: ${error.message}`, 'red');
    return false;
  }
}

async function checkFrontend(frontendUrl) {
  log('\n🔍 Checking Frontend...', 'blue');

  try {
    log('  Testing frontend URL...', 'yellow');
    const response = await makeRequest(frontendUrl);

    if (response.statusCode === 200) {
      log('  ✅ Frontend is accessible', 'green');

      // Check if it's HTML
      if (response.headers['content-type']?.includes('text/html')) {
        log('  ✅ Content-Type is HTML', 'green');
      }

      // Basic React detection
      if (response.data.includes('root') || response.data.includes('React')) {
        log('  ✅ React app detected', 'green');
      }

      return true;
    } else {
      log(`  ❌ Frontend check failed (Status: ${response.statusCode})`, 'red');
      return false;
    }
  } catch (error) {
    log(`  ❌ Frontend check failed: ${error.message}`, 'red');
    return false;
  }
}

async function checkIntegration(backendUrl, frontendUrl) {
  log('\n🔍 Checking Integration...', 'blue');

  log('  Verifying CORS between frontend and backend...', 'yellow');
  log(`  Frontend: ${frontendUrl}`, 'yellow');
  log(`  Backend: ${backendUrl}`, 'yellow');

  log('  ℹ️  Make sure backend CORS allows frontend origin', 'blue');
  log('  ℹ️  Test actual login from browser for full verification', 'blue');
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    log('Usage: node check-deployment.js <backend-url> <frontend-url>', 'yellow');
    log('Example: node check-deployment.js https://api.example.com https://app.example.com', 'yellow');
    process.exit(1);
  }

  const [backendUrl, frontendUrl] = args;

  log('='.repeat(60), 'blue');
  log('  🚀 DEPLOYMENT HEALTH CHECK', 'blue');
  log('='.repeat(60), 'blue');

  const backendOk = await checkBackend(backendUrl);
  const frontendOk = await checkFrontend(frontendUrl);
  await checkIntegration(backendUrl, frontendUrl);

  log('\n' + '='.repeat(60), 'blue');
  log('  📊 SUMMARY', 'blue');
  log('='.repeat(60), 'blue');
  log(`  Backend:  ${backendOk ? '✅ OK' : '❌ FAILED'}`, backendOk ? 'green' : 'red');
  log(`  Frontend: ${frontendOk ? '✅ OK' : '❌ FAILED'}`, frontendOk ? 'green' : 'red');

  if (backendOk && frontendOk) {
    log('\n  🎉 All checks passed! Your app is live!', 'green');
    log('\n  Next steps:', 'blue');
    log('  1. Open browser and test login', 'yellow');
    log('  2. Test admin features (CRUD)', 'yellow');
    log('  3. Test user quiz taking', 'yellow');
  } else {
    log('\n  ⚠️  Some checks failed. Please review the errors above.', 'red');
  }

  log('\n' + '='.repeat(60) + '\n', 'blue');
}

main().catch((error) => {
  log(`\n❌ Error: ${error.message}`, 'red');
  process.exit(1);
});
