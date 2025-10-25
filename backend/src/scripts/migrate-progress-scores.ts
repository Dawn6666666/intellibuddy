// backend/src/scripts/migrate-progress-scores.ts
// 数据迁移脚本：确保所有进度记录的 bestScore 字段存在
import mongoose from 'mongoose';
import UserProgress from '../models/UserProgress';
import dotenv from 'dotenv';

dotenv.config();

async function migrateProgressScores() {
  try {
    console.log('🔄 开始迁移进度数据...');
    
    // 连接数据库
    await mongoose.connect(process.env.MONGO_URI || '');
    console.log('✅ 数据库连接成功');

    // 查找所有进度记录
    const allProgress = await UserProgress.find({});
    console.log(`📊 找到 ${allProgress.length} 条进度记录`);

    let updatedCount = 0;
    let errorCount = 0;

    for (const progress of allProgress) {
      try {
        // 确保 bestScore 字段存在
        if (progress.bestScore === undefined || progress.bestScore === null) {
          progress.bestScore = 0;
          await progress.save();
          updatedCount++;
        }
        
        // 如果状态是 completed 但没有 completedAt，设置为 updatedAt 或当前时间
        if (progress.status === 'completed' && !progress.completedAt) {
          progress.completedAt = progress.updatedAt || new Date();
          await progress.save();
          updatedCount++;
        }
      } catch (error) {
        console.error(`❌ 更新进度记录 ${progress._id} 失败:`, error);
        errorCount++;
      }
    }

    console.log(`✅ 迁移完成！`);
    console.log(`   - 更新记录数: ${updatedCount}`);
    console.log(`   - 错误记录数: ${errorCount}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ 迁移失败:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

migrateProgressScores();

