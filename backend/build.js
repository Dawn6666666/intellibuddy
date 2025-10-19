// backend/build.js
const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

async function build() {
  try {
    console.log('🔨 Building backend with esbuild...');
    
    // 只打包主入口文件 index.ts
    await esbuild.build({
      entryPoints: ['src/index.ts'],
      outfile: 'api/index.js',
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
      ]
    });
    
    console.log('✅ Backend build completed successfully!');
    console.log('📁 Output: dist/index.js');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();

