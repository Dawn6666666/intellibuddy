#!/usr/bin/env node

/**
 * Vercel 部署检查脚本
 * 检查所有必需的文件和配置是否正确
 */

const fs = require('fs');
const path = require('path');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath);
  if (exists) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description} - 文件不存在: ${filePath}`, 'red');
    return false;
  }
}

function checkDirectory(dirPath, description) {
  const exists = fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  if (exists) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description} - 目录不存在: ${dirPath}`, 'red');
    return false;
  }
}

function checkJsonFile(filePath, requiredFields, description) {
  if (!fs.existsSync(filePath)) {
    log(`❌ ${description} - 文件不存在: ${filePath}`, 'red');
    return false;
  }

  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const missing = requiredFields.filter(field => {
      const keys = field.split('.');
      let value = content;
      for (const key of keys) {
        if (value && typeof value === 'object') {
          value = value[key];
        } else {
          return true; // 字段不存在
        }
      }
      return value === undefined;
    });

    if (missing.length === 0) {
      log(`✅ ${description}`, 'green');
      return true;
    } else {
      log(`❌ ${description} - 缺少字段: ${missing.join(', ')}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ ${description} - JSON 解析错误: ${error.message}`, 'red');
    return false;
  }
}

function checkVercelJson() {
  const vercelPath = path.join(__dirname, 'vercel.json');
  if (!fs.existsSync(vercelPath)) {
    log('❌ vercel.json 不存在', 'red');
    return false;
  }

  try {
    const config = JSON.parse(fs.readFileSync(vercelPath, 'utf-8'));
    let allGood = true;

    // 检查关键配置
    if (config.outputDirectory !== 'frontend/dist') {
      log(`❌ outputDirectory 应该是 "frontend/dist"，当前是 "${config.outputDirectory}"`, 'red');
      allGood = false;
    } else {
      log('✅ outputDirectory 配置正确', 'green');
    }

    if (!config.rewrites || config.rewrites.length === 0) {
      log('❌ 缺少 rewrites 配置', 'red');
      allGood = false;
    } else {
      const apiRewrite = config.rewrites.find(r => r.source === '/api/:path*');
      if (apiRewrite && apiRewrite.destination === '/api/index') {
        log('✅ API rewrites 配置正确', 'green');
      } else {
        log('❌ API rewrites 配置错误', 'red');
        allGood = false;
      }
    }

    if (!config.functions || !config.functions['api/index.ts']) {
      log('⚠️  建议配置 functions 选项以优化 Serverless Function', 'yellow');
    } else {
      log('✅ Serverless Function 配置存在', 'green');
    }

    return allGood;
  } catch (error) {
    log(`❌ vercel.json 解析错误: ${error.message}`, 'red');
    return false;
  }
}

function checkApiIndex() {
  const apiIndexPath = path.join(__dirname, 'api', 'index.ts');
  if (!fs.existsSync(apiIndexPath)) {
    log('❌ api/index.ts 不存在', 'red');
    return false;
  }

  try {
    const content = fs.readFileSync(apiIndexPath, 'utf-8');
    
    // 检查关键代码
    const checks = [
      { pattern: /require.*backend.*dist.*index/, desc: '导入后端应用' },
      { pattern: /export\s+default/, desc: '默认导出' }
    ];

    let allGood = true;
    for (const check of checks) {
      if (check.pattern.test(content)) {
        log(`✅ api/index.ts ${check.desc} ✓`, 'green');
      } else {
        log(`❌ api/index.ts ${check.desc} ✗`, 'red');
        allGood = false;
      }
    }

    return allGood;
  } catch (error) {
    log(`❌ api/index.ts 读取错误: ${error.message}`, 'red');
    return false;
  }
}

function checkPackageJson() {
  const rootPackagePath = path.join(__dirname, 'package.json');
  if (!fs.existsSync(rootPackagePath)) {
    log('❌ package.json 不存在', 'red');
    return false;
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(rootPackagePath, 'utf-8'));
    let allGood = true;

    // 检查必需的脚本
    const requiredScripts = [
      'build',
      'build:frontend',
      'build:backend'
    ];

    for (const script of requiredScripts) {
      if (pkg.scripts && pkg.scripts[script]) {
        log(`✅ 脚本 "${script}" 存在`, 'green');
      } else {
        log(`❌ 缺少脚本 "${script}"`, 'red');
        allGood = false;
      }
    }

    return allGood;
  } catch (error) {
    log(`❌ package.json 解析错误: ${error.message}`, 'red');
    return false;
  }
}

function checkBuildOutputs() {
  log('\n📦 检查构建输出...', 'cyan');
  
  const frontendDist = path.join(__dirname, 'frontend', 'dist');
  const backendDist = path.join(__dirname, 'backend', 'dist');

  let frontendBuilt = false;
  let backendBuilt = false;

  if (fs.existsSync(frontendDist) && fs.existsSync(path.join(frontendDist, 'index.html'))) {
    log('✅ 前端已构建 (frontend/dist)', 'green');
    frontendBuilt = true;
  } else {
    log('⚠️  前端未构建，部署时会自动构建', 'yellow');
  }

  if (fs.existsSync(backendDist) && fs.existsSync(path.join(backendDist, 'index.js'))) {
    log('✅ 后端已构建 (backend/dist)', 'green');
    backendBuilt = true;
  } else {
    log('⚠️  后端未构建，部署时会自动构建', 'yellow');
  }

  return { frontendBuilt, backendBuilt };
}

function checkVercelIgnore() {
  const vercelIgnorePath = path.join(__dirname, '.vercelignore');
  
  if (!fs.existsSync(vercelIgnorePath)) {
    log('✅ .vercelignore 不存在（将上传所有文件）', 'green');
    return true;
  }

  try {
    const content = fs.readFileSync(vercelIgnorePath, 'utf-8');
    const lines = content.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
    
    // 检查是否错误地忽略了源代码
    const dangerousPatterns = [
      { pattern: 'backend/src/', desc: '后端源代码' },
      { pattern: 'frontend/src/', desc: '前端源代码' },
      { pattern: 'backend/package.json', desc: '后端依赖配置' },
      { pattern: 'frontend/package.json', desc: '前端依赖配置' },
      { pattern: 'tsconfig.json', desc: 'TypeScript 配置' },
      { pattern: 'vite.config.ts', desc: 'Vite 配置' }
    ];

    let hasIssues = false;
    for (const { pattern, desc } of dangerousPatterns) {
      if (lines.some(line => line === pattern || line === pattern.replace(/\/$/, ''))) {
        log(`❌ .vercelignore 错误地忽略了 ${desc}: ${pattern}`, 'red');
        log(`   这会导致构建失败！请从 .vercelignore 中移除此行`, 'red');
        hasIssues = true;
      }
    }

    if (!hasIssues) {
      log('✅ .vercelignore 配置正确', 'green');
    }

    return !hasIssues;
  } catch (error) {
    log(`⚠️  .vercelignore 读取错误: ${error.message}`, 'yellow');
    return true;
  }
}

function checkEnvironmentVariables() {
  log('\n🔐 环境变量提醒...', 'cyan');
  
  const requiredVars = [
    { name: 'MONGO_URI', desc: 'MongoDB 连接字符串' },
    { name: 'JWT_SECRET', desc: 'JWT 密钥' },
    { name: 'KIMI_API_KEY', desc: 'AI API 密钥' },
    { name: 'FRONTEND_URL', desc: '前端 URL' },
    { name: 'BACKEND_URL', desc: '后端 URL' },
    { name: 'NODE_ENV', desc: '环境 (production)' },
    { name: 'TRUST_PROXY', desc: '代理设置 (true)' }
  ];

  log('\n⚠️  请确保在 Vercel 中配置以下环境变量:', 'yellow');
  requiredVars.forEach(v => {
    log(`   • ${v.name} - ${v.desc}`, 'yellow');
  });

  log('\n💡 生成 JWT_SECRET 的命令:', 'cyan');
  log('   node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"', 'blue');

  return true;
}

function main() {
  log('\n🚀 Vercel 部署配置检查\n', 'cyan');
  log('═'.repeat(60), 'cyan');

  let allChecks = true;

  // 1. 检查核心配置文件
  log('\n📋 检查核心配置文件...', 'cyan');
  allChecks = checkVercelJson() && allChecks;
  allChecks = checkApiIndex() && allChecks;
  allChecks = checkPackageJson() && allChecks;
  allChecks = checkVercelIgnore() && allChecks;

  // 2. 检查项目结构
  log('\n📁 检查项目结构...', 'cyan');
  allChecks = checkDirectory('frontend', '前端目录') && allChecks;
  allChecks = checkDirectory('backend', '后端目录') && allChecks;
  allChecks = checkDirectory('api', 'API 目录') && allChecks;
  allChecks = checkFile('frontend/package.json', '前端 package.json') && allChecks;
  allChecks = checkFile('backend/package.json', '后端 package.json') && allChecks;

  // 3. 检查前端配置
  log('\n🎨 检查前端配置...', 'cyan');
  allChecks = checkFile('frontend/vite.config.ts', 'Vite 配置') && allChecks;
  allChecks = checkFile('frontend/tsconfig.json', 'TypeScript 配置') && allChecks;
  allChecks = checkFile('frontend/index.html', 'HTML 入口') && allChecks;

  // 4. 检查后端配置
  log('\n⚙️  检查后端配置...', 'cyan');
  allChecks = checkFile('backend/tsconfig.json', 'TypeScript 配置') && allChecks;
  allChecks = checkFile('backend/src/index.ts', '后端入口文件') && allChecks;
  allChecks = checkFile('backend/env.example', '环境变量示例') && allChecks;

  // 5. 检查构建输出
  checkBuildOutputs();

  // 6. 环境变量提醒
  checkEnvironmentVariables();

  // 总结
  log('\n═'.repeat(60), 'cyan');
  if (allChecks) {
    log('\n✅ 所有检查通过！可以部署到 Vercel', 'green');
    log('\n📝 下一步:', 'cyan');
    log('   1. git add .', 'blue');
    log('   2. git commit -m "准备部署到 Vercel"', 'blue');
    log('   3. git push origin main', 'blue');
    log('   4. 在 Vercel 导入项目并配置环境变量', 'blue');
    log('\n📖 详细步骤: ./VERCEL_DEPLOYMENT_FIXED.md\n', 'cyan');
  } else {
    log('\n❌ 部分检查失败，请修复上述问题后再部署\n', 'red');
    process.exit(1);
  }
}

main();

