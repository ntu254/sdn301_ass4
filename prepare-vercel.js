#!/usr/bin/env node

/**
 * Script tự động chuẩn bị code cho Vercel Full-Stack Deployment
 * Run: node prepare-vercel.js
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFileExists(filePath) {
  return fs.existsSync(path.join(process.cwd(), filePath));
}

function createVercelJson() {
  const vercelJsonPath = path.join(process.cwd(), 'vercel.json');

  if (fs.existsSync(vercelJsonPath)) {
    log('⚠️  vercel.json already exists. Skipping...', 'yellow');
    return false;
  }

  const config = {
    version: 2,
    builds: [
      {
        src: "backend/src/server.js",
        use: "@vercel/node"
      },
      {
        src: "frontend/package.json",
        use: "@vercel/static-build",
        config: {
          distDir: "dist"
        }
      }
    ],
    routes: [
      {
        src: "/api/(.*)",
        dest: "backend/src/server.js"
      },
      {
        handle: "filesystem"
      },
      {
        src: "/(.*)",
        dest: "frontend/index.html"
      }
    ],
    env: {
      NODE_ENV: "production"
    }
  };

  fs.writeFileSync(vercelJsonPath, JSON.stringify(config, null, 2));
  log('✅ Created vercel.json', 'green');
  return true;
}

function updateBackendApp() {
  const appJsPath = path.join(process.cwd(), 'backend/src/app.js');

  if (!fs.existsSync(appJsPath)) {
    log('❌ backend/src/app.js not found!', 'red');
    return false;
  }

  let content = fs.readFileSync(appJsPath, 'utf8');

  // Check if already exported
  if (content.includes('module.exports = app')) {
    log('⚠️  app.js already exports app. Skipping...', 'yellow');
    return false;
  }

  // Add export at the end
  content += '\n\nmodule.exports = app;\n';

  fs.writeFileSync(appJsPath, content);
  log('✅ Updated backend/src/app.js to export app', 'green');
  return true;
}

function createServerlessHandler() {
  const serverJsPath = path.join(process.cwd(), 'backend/src/server.js');

  if (!fs.existsSync(serverJsPath)) {
    log('⚠️  backend/src/server.js not found, creating...', 'yellow');
  }

  const handlerCode = `require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

// MongoDB connection cache for serverless
let cachedConnection = null;

async function connectDB() {
  if (cachedConnection) {
    console.log("Using cached database connection");
    return cachedConnection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });

    cachedConnection = conn;
    console.log("New MongoDB connection established");
    return conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

// Vercel Serverless Handler
module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("Handler error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// Local development server
if (require.main === module) {
  const connectDBLocal = require("./config/db");
  const PORT = process.env.PORT || 5000;

  connectDBLocal()
    .then(() => {
      app.listen(PORT, () => {
        console.log(\`Local server running on http://localhost:\${PORT}\`);
      });
    })
    .catch((error) => {
      console.error("Failed to start server:", error);
      process.exit(1);
    });
}
`;

  // Backup original if exists
  if (fs.existsSync(serverJsPath)) {
    const backupPath = serverJsPath + '.backup';
    fs.copyFileSync(serverJsPath, backupPath);
    log('📦 Backed up original server.js to server.js.backup', 'cyan');
  }

  fs.writeFileSync(serverJsPath, handlerCode);
  log('✅ Created/Updated backend/src/server.js with Vercel handler', 'green');
  return true;
}

function createFrontendEnv() {
  const envProdPath = path.join(process.cwd(), 'frontend/.env.production');

  if (fs.existsSync(envProdPath)) {
    log('⚠️  frontend/.env.production already exists. Skipping...', 'yellow');
    return false;
  }

  const envContent = `# Vercel Full-Stack Deployment
VITE_API_URL=/api
`;

  fs.writeFileSync(envProdPath, envContent);
  log('✅ Created frontend/.env.production', 'green');
  return true;
}

function displayInstructions() {
  log('\n' + '='.repeat(60), 'blue');
  log('  📝 NEXT STEPS', 'cyan');
  log('='.repeat(60), 'blue');

  log('\n1. Setup MongoDB Atlas:', 'yellow');
  log('   - https://mongodb.com/cloud/atlas', 'reset');
  log('   - Create free cluster (M0)', 'reset');
  log('   - Get connection string', 'reset');

  log('\n2. Deploy to Vercel:', 'yellow');
  log('   - https://vercel.com', 'reset');
  log('   - Import GitHub repository', 'reset');
  log('   - Add Environment Variables:', 'reset');
  log('     MONGO_URI=mongodb+srv://...', 'cyan');
  log('     JWT_SECRET=your_secret_key', 'cyan');
  log('     JWT_EXPIRES_IN=7d', 'cyan');
  log('     NODE_ENV=production', 'cyan');

  log('\n3. Seed Database:', 'yellow');
  log('   cd backend', 'reset');
  log('   npm run seed', 'reset');

  log('\n4. Test:', 'yellow');
  log('   https://your-app.vercel.app', 'green');
  log('   https://your-app.vercel.app/api/health', 'green');

  log('\n' + '='.repeat(60), 'blue');
  log('  🎉 Ready to deploy!', 'green');
  log('='.repeat(60) + '\n', 'blue');
}

async function main() {
  log('\n' + '='.repeat(60), 'blue');
  log('  🚀 PREPARE FOR VERCEL FULL-STACK DEPLOYMENT', 'cyan');
  log('='.repeat(60) + '\n', 'blue');

  // Check project structure
  log('Checking project structure...', 'yellow');

  const requiredPaths = [
    'backend/src/app.js',
    'backend/src/config/db.js',
    'frontend/package.json'
  ];

  for (const filePath of requiredPaths) {
    if (checkFileExists(filePath)) {
      log(`  ✅ Found ${filePath}`, 'green');
    } else {
      log(`  ❌ Missing ${filePath}`, 'red');
      log('\n❌ Invalid project structure. Make sure you are in the Ass4 root folder.', 'red');
      process.exit(1);
    }
  }

  log('\n📝 Making changes...\n', 'yellow');

  // Make changes
  createVercelJson();
  updateBackendApp();
  createServerlessHandler();
  createFrontendEnv();

  // Display next steps
  displayInstructions();
}

main().catch((error) => {
  log(`\n❌ Error: ${error.message}`, 'red');
  process.exit(1);
});
