#!/usr/bin/env node

/**
 * Vercel 部署前置检查脚本
 * 检查项目配置是否满足 Vercel 部署要求
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 开始检查 Vercel 部署配置...\n');

let hasErrors = false;
let hasWarnings = false;

// 检查项
const checks = {
  files: [
    { path: 'vercel.json', required: true, name: 'Vercel 配置文件' },
    { path: '.nvmrc', required: true, name: 'Node 版本配置' },
    { path: 'package.json', required: true, name: '根 package.json' },
    { path: 'backend/package.json', required: true, name: '后端 package.json' },
    { path: 'frontend/package.json', required: true, name: '前端 package.json' },
    { path: 'api/index.ts', required: true, name: 'API 入口文件' },
    { path: 'backend/src/index.ts', required: true, name: '后端入口文件' },
  ]
};

// 1. 检查必需文件
console.log('📁 检查必需文件...');
checks.files.forEach(file => {
  const exists = fs.existsSync(file.path);
  if (exists) {
    console.log(`  ✅ ${file.name}: ${file.path}`);
  } else if (file.required) {
    console.log(`  ❌ ${file.name}: ${file.path} (缺失)`);
    hasErrors = true;
  } else {
    console.log(`  ⚠️  ${file.name}: ${file.path} (可选，未找到)`);
    hasWarnings = true;
  }
});

console.log('');

// 2. 检查 package.json 配置
console.log('📦 检查 package.json 配置...');
try {
  const rootPkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // 检查 packageManager
  if (rootPkg.packageManager && rootPkg.packageManager.includes('pnpm')) {
    console.log(`  ✅ packageManager: ${rootPkg.packageManager}`);
  } else {
    console.log(`  ⚠️  packageManager 未配置或不是 pnpm`);
    hasWarnings = true;
  }
  
  // 检查 engines
  if (rootPkg.engines && rootPkg.engines.node) {
    console.log(`  ✅ Node 版本要求: ${rootPkg.engines.node}`);
  } else {
    console.log(`  ⚠️  未指定 Node 版本要求`);
    hasWarnings = true;
  }
  
  // 检查 vercel-build 脚本
  if (rootPkg.scripts && rootPkg.scripts['vercel-build']) {
    console.log(`  ✅ vercel-build 脚本: ${rootPkg.scripts['vercel-build']}`);
  } else {
    console.log(`  ❌ 缺少 vercel-build 脚本`);
    hasErrors = true;
  }
} catch (error) {
  console.log(`  ❌ 读取 package.json 失败: ${error.message}`);
  hasErrors = true;
}

console.log('');

// 3. 检查 vercel.json 配置
console.log('⚙️  检查 vercel.json 配置...');
try {
  const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  
  // 检查基本配置
  const requiredFields = [
    'outputDirectory',
    'rewrites',
    'functions'
  ];
  
  requiredFields.forEach(field => {
    if (vercelConfig[field]) {
      console.log(`  ✅ ${field}: 已配置`);
    } else {
      console.log(`  ⚠️  ${field}: 未配置`);
      hasWarnings = true;
    }
  });
  
  // 检查 API 路由重写
  if (vercelConfig.rewrites && Array.isArray(vercelConfig.rewrites)) {
    const hasApiRewrite = vercelConfig.rewrites.some(r => 
      r.source && r.source.includes('/api')
    );
    if (hasApiRewrite) {
      console.log(`  ✅ API 路由重写: 已配置`);
    } else {
      console.log(`  ⚠️  API 路由重写: 未找到 /api 相关配置`);
      hasWarnings = true;
    }
  }
  
  // 检查 Function 配置
  if (vercelConfig.functions && vercelConfig.functions['api/index.ts']) {
    const fnConfig = vercelConfig.functions['api/index.ts'];
    console.log(`  ✅ Serverless Function: 内存=${fnConfig.memory}MB, 超时=${fnConfig.maxDuration}s`);
  } else {
    console.log(`  ⚠️  未配置 api/index.ts Function`);
    hasWarnings = true;
  }
} catch (error) {
  console.log(`  ❌ 读取 vercel.json 失败: ${error.message}`);
  hasErrors = true;
}

console.log('');

// 4. 检查后端导出
console.log('🔧 检查后端配置...');
try {
  const backendIndex = fs.readFileSync('backend/src/index.ts', 'utf8');
  
  // 检查是否正确导出 app
  if (backendIndex.includes('export default app')) {
    console.log(`  ✅ Express app 导出: 正确`);
  } else {
    console.log(`  ❌ Express app 未正确导出（需要 'export default app'）`);
    hasErrors = true;
  }
  
  // 检查是否有生产环境判断
  if (backendIndex.includes('NODE_ENV') && backendIndex.includes('production')) {
    console.log(`  ✅ 生产环境判断: 已配置`);
  } else {
    console.log(`  ⚠️  建议添加生产环境判断，避免在 Vercel 上启动 listen()`);
    hasWarnings = true;
  }
  
  // 检查 TRUST_PROXY
  if (backendIndex.includes('TRUST_PROXY') || backendIndex.includes('trust proxy')) {
    console.log(`  ✅ TRUST_PROXY 配置: 已添加`);
  } else {
    console.log(`  ⚠️  建议配置 app.set('trust proxy', 1)`);
    hasWarnings = true;
  }
} catch (error) {
  console.log(`  ❌ 读取后端入口文件失败: ${error.message}`);
  hasErrors = true;
}

console.log('');

// 5. 检查 API 入口文件
console.log('🔌 检查 API 入口文件...');
try {
  const apiIndex = fs.readFileSync('api/index.ts', 'utf8');
  
  if (apiIndex.includes('export default')) {
    console.log(`  ✅ API 入口导出: 正确`);
  } else {
    console.log(`  ❌ API 入口未正确导出`);
    hasErrors = true;
  }
  
  if (apiIndex.includes('../backend/dist')) {
    console.log(`  ✅ 引用编译后的后端代码: 正确`);
  } else {
    console.log(`  ⚠️  建议引用编译后的代码 (../backend/dist)`);
    hasWarnings = true;
  }
} catch (error) {
  console.log(`  ❌ 读取 API 入口文件失败: ${error.message}`);
  hasErrors = true;
}

console.log('');

// 6. 检查 .gitignore
console.log('🚫 检查 .gitignore...');
try {
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  const shouldIgnore = ['.env', 'node_modules', 'dist', '.vercel'];
  
  shouldIgnore.forEach(item => {
    if (gitignore.includes(item)) {
      console.log(`  ✅ 忽略 ${item}`);
    } else {
      console.log(`  ⚠️  建议添加 ${item} 到 .gitignore`);
      hasWarnings = true;
    }
  });
} catch (error) {
  console.log(`  ⚠️  未找到 .gitignore 文件`);
  hasWarnings = true;
}

console.log('');

// 7. 检查构建产物目录
console.log('🏗️  检查构建配置...');
const distDirs = [
  'frontend/dist',
  'backend/dist'
];

distDirs.forEach(dir => {
  // 这些目录应该在构建时创建，不需要预先存在
  console.log(`  ℹ️  ${dir} (将在构建时创建)`);
});

console.log('');

// 8. 环境变量提醒
console.log('🔐 环境变量配置提醒...');
console.log(`  ℹ️  请确保在 Vercel Dashboard 中配置以下必需环境变量：`);
console.log(`     - NODE_ENV=production`);
console.log(`     - MONGO_URI`);
console.log(`     - JWT_SECRET`);
console.log(`     - FRONTEND_URL`);
console.log(`     - BACKEND_URL`);
console.log(`     - TRUST_PROXY=true`);
console.log(`     - ALLOWED_ORIGINS`);
console.log(`     - KIMI_API_KEY (或其他 AI 模型)`);
console.log(`  ℹ️  详见 VERCEL_ENV_TEMPLATE.txt 文件`);

console.log('');

// 总结
console.log('=' .repeat(60));
if (hasErrors) {
  console.log('❌ 检查失败：发现 ' + (hasWarnings ? '错误和警告' : '错误'));
  console.log('请修复上述错误后再部署到 Vercel');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  检查完成：发现一些警告');
  console.log('建议修复警告项，但可以继续部署');
  process.exit(0);
} else {
  console.log('✅ 检查通过：配置完整，可以部署到 Vercel！');
  console.log('');
  console.log('🚀 下一步：');
  console.log('   1. 确保已安装 Vercel CLI: pnpm add -g vercel');
  console.log('   2. 登录 Vercel: vercel login');
  console.log('   3. 部署到生产环境: vercel --prod');
  console.log('   4. 在 Vercel Dashboard 配置环境变量');
  console.log('');
  console.log('📖 详细部署指南请查看: VERCEL_DEPLOYMENT_CONFIG.md');
  process.exit(0);
}

