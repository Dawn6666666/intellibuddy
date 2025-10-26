#!/usr/bin/env node

/**
 * MongoDB 连接测试工具
 * 用于快速诊断 MongoDB 连接问题
 */

const dotenv = require('dotenv');
const mongoose = require('mongoose');
const dns = require('dns').promises;

// 加载环境变量
dotenv.config();

console.log('🔍 MongoDB 连接诊断工具\n');
console.log('=' .repeat(60));

// 1. 检查环境变量
console.log('\n📋 步骤 1: 检查环境变量配置');
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    console.error('❌ 未找到 MONGO_URI 环境变量');
    console.error('💡 请在 backend/.env 文件中配置 MONGO_URI');
    process.exit(1);
}

console.log('✓ MONGO_URI 已配置');

// 解析连接字符串
try {
    const uriPattern = /mongodb(?:\+srv)?:\/\/([^:]+):([^@]+)@([^/]+)\/(.+)/;
    const match = mongoUri.match(uriPattern);
    
    if (match) {
        console.log('  - 协议:', mongoUri.startsWith('mongodb+srv') ? 'SRV (推荐)' : '标准格式');
        console.log('  - 主机:', match[3]);
        console.log('  - 数据库:', match[4].split('?')[0]);
        console.log('  - 用户名:', match[1]);
        console.log('  - 密码:', '*'.repeat(8) + ' (已隐藏)');
    }
} catch (err) {
    console.warn('⚠️  无法解析连接字符串格式');
}

// 2. DNS 解析测试
console.log('\n📋 步骤 2: DNS 解析测试');
(async () => {
    try {
        // 提取主机名
        const hostMatch = mongoUri.match(/@([^/]+)\//);
        if (!hostMatch) {
            console.error('❌ 无法从连接字符串中提取主机名');
            return;
        }
        
        const hostname = hostMatch[1].split(':')[0];
        console.log(`  正在解析: ${hostname}`);
        
        // 如果是 SRV 格式
        if (mongoUri.startsWith('mongodb+srv')) {
            const srvHostname = `_mongodb._tcp.${hostname}`;
            console.log(`  SRV 查询: ${srvHostname}`);
            
            try {
                const srvRecords = await dns.resolveSrv(srvHostname);
                console.log(`✓ SRV 解析成功，找到 ${srvRecords.length} 个节点:`);
                srvRecords.forEach((record, i) => {
                    console.log(`    ${i + 1}. ${record.name}:${record.port} (priority: ${record.priority})`);
                });
            } catch (err) {
                console.error('❌ SRV 解析失败:', err.code || err.message);
                console.error('💡 建议: 尝试使用标准 MongoDB URI 格式（非 SRV）');
                
                // 尝试直接解析主机名
                console.log('\n  尝试标准 DNS 解析...');
                try {
                    const addresses = await dns.resolve4(hostname);
                    console.log(`✓ A 记录解析成功: ${addresses.join(', ')}`);
                } catch (err2) {
                    console.error('❌ A 记录解析也失败:', err2.code || err2.message);
                }
            }
        } else {
            // 标准格式
            const addresses = await dns.resolve4(hostname);
            console.log(`✓ DNS 解析成功: ${addresses.join(', ')}`);
        }
    } catch (err) {
        console.error('❌ DNS 解析错误:', err.message);
        console.error('💡 可能的原因:');
        console.error('   - 网络连接问题');
        console.error('   - DNS 服务器无法访问');
        console.error('   - 需要使用 VPN 或代理');
    }
    
    // 3. MongoDB 连接测试
    console.log('\n📋 步骤 3: MongoDB 连接测试');
    console.log('  正在尝试连接...');
    
    const options = {
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000,
        family: 4,
    };
    
    try {
        await mongoose.connect(mongoUri, options);
        console.log('✓ MongoDB 连接成功！');
        
        // 测试数据库操作
        console.log('\n📋 步骤 4: 数据库操作测试');
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`✓ 数据库可访问，共 ${collections.length} 个集合`);
        
        if (collections.length > 0) {
            console.log('  现有集合:');
            collections.slice(0, 5).forEach(col => {
                console.log(`    - ${col.name}`);
            });
            if (collections.length > 5) {
                console.log(`    ... 还有 ${collections.length - 5} 个集合`);
            }
        } else {
            console.log('  ℹ️  数据库为空（这是正常的，如果是新数据库）');
        }
        
        console.log('\n' + '='.repeat(60));
        console.log('✅ 所有测试通过！MongoDB 连接正常');
        console.log('='.repeat(60));
        
    } catch (err) {
        console.error('❌ MongoDB 连接失败:', err.message);
        console.error('\n💡 建议的解决方案:');
        console.error('1. 检查 MongoDB Atlas IP 白名单配置');
        console.error('2. 确认数据库用户名和密码正确');
        console.error('3. 检查网络连接和防火墙设置');
        console.error('4. 尝试使用不同的 DNS 服务器（8.8.8.8 或 1.1.1.1）');
        console.error('5. 如果在中国大陆，可能需要使用代理');
        console.error('\n详细信息请查看: backend/MONGODB_CONNECTION_FIX.md');
        
        console.log('\n' + '='.repeat(60));
        console.log('❌ 测试失败');
        console.log('='.repeat(60));
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
})().catch(err => {
    console.error('❌ 意外错误:', err);
    process.exit(1);
});

