// backend/build.js
const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// 递归获取所有 .ts 文件
function getAllTypeScriptFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllTypeScriptFiles(filePath, fileList);
    } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

async function build() {
  try {
    const srcDir = path.join(__dirname, 'src');
    const entryPoints = getAllTypeScriptFiles(srcDir);
    
    console.log('🔨 Building backend with esbuild...');
    console.log(`📦 Found ${entryPoints.length} TypeScript files`);
    
    await esbuild.build({
      entryPoints,
      outdir: 'dist',
      platform: 'node',
      format: 'cjs',
      target: 'es2020',
      sourcemap: true,
      bundle: true,
      minify: false,
      external: [
        'express',
        'mongoose',
        'bcryptjs',
        'jsonwebtoken',
        'passport',
        'passport-github2',
        'passport-qq',
        'cors',
        'compression',
        'dotenv',
        'axios',
        'multer'
      ],
      // 保持原始目录结构
      outbase: 'src'
    });
    
    console.log('✅ Backend build completed successfully!');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();

