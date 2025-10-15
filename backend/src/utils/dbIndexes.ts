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
  console.log('[DB Indexes] 开始创建数据库索引...');

  try {
    // User 索引
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ username: 1 });
    await User.collection.createIndex({ 'githubId': 1 }, { sparse: true });
    await User.collection.createIndex({ 'qqId': 1 }, { sparse: true });
    console.log('[DB Indexes] ✓ User 索引创建完成');

    // KnowledgePoint 索引
    await KnowledgePoint.collection.createIndex({ subject: 1 });
    await KnowledgePoint.collection.createIndex({ title: 1 });
    await KnowledgePoint.collection.createIndex({ subject: 1, title: 1 });
    console.log('[DB Indexes] ✓ KnowledgePoint 索引创建完成');

    // UserProgress 索引
    await UserProgress.collection.createIndex({ userId: 1, pointId: 1 }, { unique: true });
    await UserProgress.collection.createIndex({ userId: 1, status: 1 });
    await UserProgress.collection.createIndex({ userId: 1 });
    await UserProgress.collection.createIndex({ pointId: 1 });
    console.log('[DB Indexes] ✓ UserProgress 索引创建完成');

    // WrongQuestion 索引
    await WrongQuestion.collection.createIndex({ userId: 1, pointId: 1 });
    await WrongQuestion.collection.createIndex({ userId: 1, mastered: 1 });
    await WrongQuestion.collection.createIndex({ userId: 1, subject: 1 });
    await WrongQuestion.collection.createIndex({ userId: 1, createdAt: -1 });
    console.log('[DB Indexes] ✓ WrongQuestion 索引创建完成');

    // StudySession 索引
    await StudySession.collection.createIndex({ userId: 1, startTime: -1 });
    await StudySession.collection.createIndex({ userId: 1, pointId: 1 });
    await StudySession.collection.createIndex({ userId: 1, subject: 1 });
    await StudySession.collection.createIndex({ startTime: -1 });
    console.log('[DB Indexes] ✓ StudySession 索引创建完成');

    // Assessment 索引
    await Assessment.collection.createIndex({ userId: 1, createdAt: -1 });
    await Assessment.collection.createIndex({ userId: 1 });
    console.log('[DB Indexes] ✓ Assessment 索引创建完成');

    console.log('[DB Indexes] ✅ 所有数据库索引创建完成！');
    return true;
  } catch (error: any) {
    console.error('[DB Indexes] ❌ 创建索引时发生错误:', error.message);
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
if (require.main === module) {
  require('dotenv').config();
  
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

