// backend/src/utils/dbIndexes.ts
/**
 * 数据库索引优化脚本
 * 运行此脚本以确保所有必要的数据库索引已创建
 */

import mongoose from 'mongoose';
import User from '../models/User';
import KnowledgePoint from '../models/KnowledgePoint';
import UserProgress from '../models/UserProgress';
import WrongQuestion from '../models/WrongQuestion';
import StudySession from '../models/StudySession';
import Assessment from '../models/Assessment';

/**
 * 创建所有必要的数据库索引
 */
export async function createDatabaseIndexes() {
  console.log('[DB Indexes] 开始同步数据库索引...');

  const models = [
    { name: 'User', model: User },
    { name: 'KnowledgePoint', model: KnowledgePoint },
    { name: 'UserProgress', model: UserProgress },
    { name: 'WrongQuestion', model: WrongQuestion },
    { name: 'StudySession', model: StudySession },
    { name: 'Assessment', model: Assessment },
  ];

  let successCount = 0;

  for (const { name, model } of models) {
    try {
      // 为每个模型设置30秒超时
      await Promise.race([
        model.syncIndexes(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('索引同步超时')), 30000)
        )
      ]);
      console.log(`[DB Indexes] ✓ ${name} 索引同步完成`);
      successCount++;
    } catch (error: any) {
      console.warn(`[DB Indexes] ⚠️  ${name} 索引同步失败:`, error.message);
      // 继续处理其他模型，不中断整个流程
    }
  }

  if (successCount === models.length) {
    console.log('[DB Indexes] ✅ 所有数据库索引同步完成！');
    return true;
  } else if (successCount > 0) {
    console.log(`[DB Indexes] ⚠️  部分索引同步完成 (${successCount}/${models.length})`);
    return true;
  } else {
    console.warn('[DB Indexes] ⚠️  索引同步失败，但不影响应用运行');
    return false;
  }
}

/**
 * 获取所有集合的索引信息
 */
export async function listDatabaseIndexes() {
  console.log('[DB Indexes] 获取数据库索引信息...\n');

  const collections = [
    { name: 'User', model: User },
    { name: 'KnowledgePoint', model: KnowledgePoint },
    { name: 'UserProgress', model: UserProgress },
    { name: 'WrongQuestion', model: WrongQuestion },
    { name: 'StudySession', model: StudySession },
    { name: 'Assessment', model: Assessment },
  ];

  for (const { name, model } of collections) {
    try {
      const indexes = await model.collection.getIndexes();
      console.log(`\n${name} 索引:`);
      Object.entries(indexes).forEach(([indexName, indexSpec]) => {
        console.log(`  - ${indexName}:`, JSON.stringify(indexSpec));
      });
    } catch (error: any) {
      console.error(`  ❌ 获取 ${name} 索引失败:`, error.message);
    }
  }
}

// 如果直接运行此脚本
if (typeof require !== 'undefined' && require.main === module) {
  // 动态导入 dotenv 以避免 ESM 下的 require 规则告警
  import('dotenv').then(dotenv => dotenv.config());
  
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('错误: MONGO_URI 未在 .env 文件中定义');
    process.exit(1);
  }

  mongoose
    .connect(mongoUri)
    .then(async () => {
      console.log('✓ 已连接到 MongoDB');
      
      await createDatabaseIndexes();
      await listDatabaseIndexes();
      
      await mongoose.connection.close();
      console.log('\n✓ 数据库连接已关闭');
      process.exit(0);
    })
    .catch(err => {
      console.error('无法连接到 MongoDB:', err);
      process.exit(1);
    });
}

