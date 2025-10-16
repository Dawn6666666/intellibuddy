/**
 * 智学伴 (IntelliBuddy) - 部署前检查脚本
 * 
 * 运行此脚本以检查项目是否准备好部署到 Vercel
 * 
 * 使用方法：
 *   node check-deployment.js
 */

const fs = require('fs');
const path = require('path');

// ANSI 颜色代码
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
};

// 打印带颜色的消息
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logSection(title) {
  log(`\n${'='.repeat(60)}`, 'bold');
  log(`  ${title}`, 'bold');
  log(`${'='.repeat(60)}`, 'bold');
}

// 检查结果统计
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
};

// 检查文件是否存在
function checkFileExists(filePath, description) {
  if (fs.existsSync(filePath)) {
    logSuccess(`${description}: ${filePath}`);
    results.passed++;
    return true;
  } else {
    logError(`${description} 不存在: ${filePath}`);
    results.failed++;
    return false;
  }
}

// 检查 package.json
function checkPackageJson() {
  logSection('检查 Package 配置');
  
  // 检查根目录 package.json
  if (checkFileExists('package.json', '根目录 package.json')) {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    
    // 检查 packageManager
    if (pkg.packageManager && pkg.packageManager.includes('pnpm')) {
      logSuccess(`包管理器配置正确: ${pkg.packageManager}`);
      results.passed++;
    } else {
      logError('package.json 中缺少 packageManager 字段或未设置为 pnpm');
      results.failed++;
    }
    
    // 检查构建脚本
    if (pkg.scripts && pkg.scripts.build) {
      logSuccess(`构建脚本已配置: ${pkg.scripts.build}`);
      results.passed++;
    } else {
      logError('package.json 中缺少 build 脚本');
      results.failed++;
    }
  }
  
  // 检查前端 package.json
  checkFileExists('frontend/package.json', '前端 package.json');
  
  // 检查后端 package.json
  checkFileExists('backend/package.json', '后端 package.json');
}

// 检查 Vercel 配置
function checkVercelConfig() {
  logSection('检查 Vercel 配置');
  
  if (checkFileExists('vercel.json', 'Vercel 配置文件')) {
    const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf-8'));
    
    // 检查构建配置
    if (vercelConfig.buildCommand) {
      logSuccess(`构建命令已配置: ${vercelConfig.buildCommand}`);
      results.passed++;
    } else {
      logWarning('vercel.json 中未明确指定 buildCommand');
      results.warnings++;
    }
    
    // 检查输出目录
    if (vercelConfig.outputDirectory) {
      logSuccess(`输出目录已配置: ${vercelConfig.outputDirectory}`);
      results.passed++;
    } else {
      logWarning('vercel.json 中未明确指定 outputDirectory');
      results.warnings++;
    }
    
    // 检查路由配置
    if (vercelConfig.routes && vercelConfig.routes.length > 0) {
      logSuccess(`路由配置已设置 (${vercelConfig.routes.length} 条规则)`);
      results.passed++;
      
      // 检查 API 路由
      const apiRoute = vercelConfig.routes.find(r => r.src && r.src.includes('/api/'));
      if (apiRoute) {
        logSuccess('API 路由已配置');
        results.passed++;
      } else {
        logError('缺少 API 路由配置');
        results.failed++;
      }
    } else {
      logError('vercel.json 中缺少路由配置');
      results.failed++;
    }
    
    // 检查函数配置
    if (vercelConfig.functions) {
      logSuccess('Serverless 函数配置已设置');
      results.passed++;
    } else {
      logWarning('未配置 Serverless 函数设置');
      results.warnings++;
    }
  }
}

// 检查项目结构
function checkProjectStructure() {
  logSection('检查项目结构');
  
  checkFileExists('frontend/src/main.ts', '前端入口文件');
  checkFileExists('frontend/vite.config.ts', 'Vite 配置');
  checkFileExists('backend/src/index.ts', '后端入口文件');
  checkFileExists('backend/tsconfig.json', '后端 TypeScript 配置');
  checkFileExists('pnpm-workspace.yaml', 'pnpm workspace 配置');
}

// 检查环境变量文档
function checkEnvDocumentation() {
  logSection('检查环境变量文档');
  
  if (checkFileExists('backend/env.example', '环境变量示例文件')) {
    const envExample = fs.readFileSync('backend/env.example', 'utf-8');
    
    // 检查必需的环境变量
    const requiredVars = [
      'NODE_ENV',
      'MONGO_URI',
      'JWT_SECRET',
      'FRONTEND_URL',
      'BACKEND_URL',
    ];
    
    let allFound = true;
    requiredVars.forEach(varName => {
      if (envExample.includes(varName)) {
        logSuccess(`环境变量已文档化: ${varName}`);
        results.passed++;
      } else {
        logError(`环境变量未文档化: ${varName}`);
        results.failed++;
        allFound = false;
      }
    });
    
    // 检查 AI 配置
    if (envExample.includes('KIMI_API_KEY') || 
        envExample.includes('QIANWEN_API_KEY') ||
        envExample.includes('ERNIE_API_KEY')) {
      logSuccess('AI 模型配置已文档化');
      results.passed++;
    } else {
      logError('缺少 AI 模型配置文档');
      results.failed++;
    }
  }
}

// 检查构建输出
function checkBuildOutput() {
  logSection('检查构建配置');
  
  // 检查是否有 .gitignore
  if (checkFileExists('.gitignore', 'Git ignore 文件')) {
    const gitignore = fs.readFileSync('.gitignore', 'utf-8');
    
    if (gitignore.includes('dist')) {
      logSuccess('.gitignore 包含 dist 目录');
      results.passed++;
    } else {
      logWarning('.gitignore 可能缺少 dist 目录');
      results.warnings++;
    }
    
    if (gitignore.includes('node_modules')) {
      logSuccess('.gitignore 包含 node_modules');
      results.passed++;
    } else {
      logError('.gitignore 缺少 node_modules');
      results.failed++;
    }
    
    if (gitignore.includes('.env')) {
      logSuccess('.gitignore 包含 .env 文件');
      results.passed++;
    } else {
      logError('.gitignore 缺少 .env 文件（安全风险）');
      results.failed++;
    }
  }
}

// 检查依赖
function checkDependencies() {
  logSection('检查依赖项');
  
  // 检查 pnpm-lock.yaml
  if (checkFileExists('pnpm-lock.yaml', 'pnpm 锁文件')) {
    logInfo('建议在部署前运行 pnpm install 确保依赖最新');
  }
  
  // 检查前端依赖
  if (fs.existsSync('frontend/package.json')) {
    const pkg = JSON.parse(fs.readFileSync('frontend/package.json', 'utf-8'));
    
    if (pkg.dependencies && pkg.dependencies.vue) {
      logSuccess('前端 Vue 依赖已配置');
      results.passed++;
    }
    
    if (pkg.devDependencies && pkg.devDependencies.vite) {
      logSuccess('前端 Vite 构建工具已配置');
      results.passed++;
    }
  }
  
  // 检查后端依赖
  if (fs.existsSync('backend/package.json')) {
    const pkg = JSON.parse(fs.readFileSync('backend/package.json', 'utf-8'));
    
    if (pkg.dependencies && pkg.dependencies.express) {
      logSuccess('后端 Express 依赖已配置');
      results.passed++;
    }
    
    if (pkg.dependencies && pkg.dependencies.mongoose) {
      logSuccess('后端 MongoDB 驱动已配置');
      results.passed++;
    }
  }
}

// 检查部署文档
function checkDocumentation() {
  logSection('检查部署文档');
  
  checkFileExists('VERCEL_DEPLOYMENT_GUIDE.md', 'Vercel 部署指南');
  checkFileExists('README.md', 'README 文件');
}

// 生成部署清单
function generateDeploymentChecklist() {
  logSection('部署前清单');
  
  console.log('\n📋 在 Vercel 部署前，请确保：\n');
  
  const checklist = [
    '代码已推送到 Git 仓库（GitHub/GitLab/Bitbucket）',
    '已创建 MongoDB Atlas 数据库并获取连接字符串',
    '已生成 JWT Secret（使用 crypto.randomBytes）',
    '已获取至少一个 AI 模型的 API Key',
    '已准备好在 Vercel 中配置环境变量',
    '已阅读 VERCEL_DEPLOYMENT_GUIDE.md',
  ];
  
  checklist.forEach((item, index) => {
    logInfo(`${index + 1}. ${item}`);
  });
  
  console.log('\n💡 环境变量配置提示：');
  logInfo('  必需: MONGO_URI, JWT_SECRET, NODE_ENV=production');
  logInfo('  必需: FRONTEND_URL, BACKEND_URL, TRUST_PROXY=true');
  logInfo('  必需: KIMI_API_KEY (或其他 AI 模型 Key)');
  logInfo('  可选: GitHub/QQ OAuth 配置');
}

// 主函数
function main() {
  console.clear();
  log('\n🚀 智学伴 (IntelliBuddy) - 部署前检查\n', 'bold');
  log('正在检查项目配置...\n', 'blue');
  
  try {
    checkProjectStructure();
    checkPackageJson();
    checkVercelConfig();
    checkEnvDocumentation();
    checkBuildOutput();
    checkDependencies();
    checkDocumentation();
    
    // 显示结果摘要
    logSection('检查结果摘要');
    
    console.log('');
    logSuccess(`通过: ${results.passed} 项`);
    
    if (results.warnings > 0) {
      logWarning(`警告: ${results.warnings} 项`);
    }
    
    if (results.failed > 0) {
      logError(`失败: ${results.failed} 项`);
    }
    
    console.log('');
    
    // 判断是否可以部署
    if (results.failed === 0) {
      log('━'.repeat(60), 'green');
      logSuccess('恭喜！项目配置检查通过，可以部署到 Vercel！');
      log('━'.repeat(60), 'green');
      
      generateDeploymentChecklist();
      
      console.log('\n📖 下一步：');
      logInfo('  1. 阅读 VERCEL_DEPLOYMENT_GUIDE.md');
      logInfo('  2. 访问 https://vercel.com 创建项目');
      logInfo('  3. 配置环境变量');
      logInfo('  4. 开始部署！\n');
    } else {
      log('━'.repeat(60), 'red');
      logError('发现配置问题，请修复后再部署！');
      log('━'.repeat(60), 'red');
      
      console.log('\n💡 建议：');
      logInfo('  1. 检查上述失败的项目');
      logInfo('  2. 参考 VERCEL_DEPLOYMENT_GUIDE.md');
      logInfo('  3. 修复问题后重新运行此脚本\n');
      
      process.exit(1);
    }
    
  } catch (error) {
    console.error('\n');
    logError(`检查过程出错: ${error.message}`);
    process.exit(1);
  }
}

// 运行主函数
main();

