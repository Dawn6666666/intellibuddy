#!/usr/bin/env node

/**
 * 测试已部署的 API
 * 使用方法: node test-deployed-api.js <YOUR_APP_URL>
 * 示例: node test-deployed-api.js https://intellibuddy.vercel.app
 */

const https = require('https');
const http = require('http');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const startTime = Date.now();

    protocol.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const duration = Date.now() - startTime;
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          duration
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function testEndpoint(name, url, expectedStatus = 200, validateBody = null) {
  try {
    log(`\n🧪 测试: ${name}`, 'cyan');
    log(`   URL: ${url}`, 'blue');

    const result = await makeRequest(url);
    
    // 检查状态码
    if (result.statusCode === expectedStatus) {
      log(`   ✅ 状态码: ${result.statusCode} (${result.duration}ms)`, 'green');
    } else {
      log(`   ❌ 状态码: ${result.statusCode} (预期: ${expectedStatus})`, 'red');
      return false;
    }

    // 解析响应体
    let bodyData;
    try {
      bodyData = JSON.parse(result.body);
    } catch (e) {
      if (result.body.includes('<!DOCTYPE html>')) {
        log('   ⚠️  返回了 HTML（可能是前端页面）', 'yellow');
        return false;
      } else {
        log(`   ❌ JSON 解析失败: ${e.message}`, 'red');
        log(`   响应: ${result.body.substring(0, 200)}`, 'red');
        return false;
      }
    }

    // 自定义验证
    if (validateBody) {
      const validationResult = validateBody(bodyData);
      if (validationResult === true) {
        log('   ✅ 响应验证通过', 'green');
      } else {
        log(`   ❌ 响应验证失败: ${validationResult}`, 'red');
        return false;
      }
    }

    // 显示响应样例
    const preview = JSON.stringify(bodyData).substring(0, 100);
    log(`   📝 响应预览: ${preview}...`, 'blue');

    return true;
  } catch (error) {
    log(`   ❌ 请求失败: ${error.message}`, 'red');
    return false;
  }
}

async function main() {
  const baseUrl = process.argv[2];

  if (!baseUrl) {
    log('❌ 请提供应用 URL', 'red');
    log('\n使用方法:', 'yellow');
    log('  node test-deployed-api.js <YOUR_APP_URL>', 'blue');
    log('\n示例:', 'yellow');
    log('  node test-deployed-api.js https://intellibuddy.vercel.app', 'blue');
    process.exit(1);
  }

  log('\n🚀 IntelliBuddy API 测试', 'cyan');
  log('═'.repeat(60), 'cyan');
  log(`\n📍 目标: ${baseUrl}`, 'cyan');

  const tests = [
    {
      name: '前端首页',
      url: baseUrl,
      expectedStatus: 200,
      validate: null // HTML 页面，不验证 JSON
    },
    {
      name: '后端健康检查',
      url: `${baseUrl}/api/`,
      expectedStatus: 200,
      validate: (body) => {
        if (body.status !== 'ok') {
          return '状态不是 "ok"';
        }
        return true;
      }
    },
    {
      name: '获取知识点列表',
      url: `${baseUrl}/api/knowledge-points`,
      expectedStatus: 200,
      validate: (body) => {
        if (!Array.isArray(body)) {
          return '响应不是数组';
        }
        if (body.length === 0) {
          return '知识点列表为空（可能数据库未初始化）';
        }
        return true;
      }
    },
    {
      name: '获取题目列表',
      url: `${baseUrl}/api/questions?limit=5`,
      expectedStatus: 200,
      validate: (body) => {
        if (!body.questions || !Array.isArray(body.questions)) {
          return '缺少 questions 字段或不是数组';
        }
        return true;
      }
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await testEndpoint(
      test.name,
      test.url,
      test.expectedStatus,
      test.validate
    );

    if (result) {
      passed++;
    } else {
      failed++;
    }

    // 避免请求过快
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // 总结
  log('\n═'.repeat(60), 'cyan');
  log('\n📊 测试结果:', 'cyan');
  log(`   ✅ 通过: ${passed}`, passed > 0 ? 'green' : 'reset');
  log(`   ❌ 失败: ${failed}`, failed > 0 ? 'red' : 'reset');
  log(`   📈 总计: ${passed + failed}`, 'blue');

  if (failed === 0) {
    log('\n🎉 所有测试通过！应用运行正常', 'green');
    log('\n💡 下一步:', 'cyan');
    log('   1. 测试用户注册/登录功能', 'blue');
    log('   2. 测试 AI 对话功能', 'blue');
    log('   3. 测试题目练习功能', 'blue');
    log('   4. 测试错题本功能', 'blue');
  } else {
    log('\n⚠️  部分测试失败，请检查:', 'yellow');
    log('   1. 环境变量是否正确配置', 'blue');
    log('   2. MongoDB 连接是否正常', 'blue');
    log('   3. Vercel Functions 日志中的错误', 'blue');
    log('\n🔍 查看 Vercel 日志:', 'cyan');
    log(`   https://vercel.com/dashboard → 选择项目 → Functions`, 'blue');
  }

  log('');
  process.exit(failed > 0 ? 1 : 0);
}

main();

