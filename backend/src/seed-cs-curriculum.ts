// backend/src/seed-cs-curriculum.ts
// 导入计算机科学课程体系数据（12门课程）
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import KnowledgePoint from './models/KnowledgePoint';
import type { IKnowledgePoint } from './models/KnowledgePoint';

dotenv.config();

async function seedCSCurriculum() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('请在 .env 文件中设置 MONGODB_URI 或 MONGO_URI');
    }

    await mongoose.connect(mongoUri);
    console.log('数据库连接成功');

    // 读取 knowledge-points-data.json 文件
    const dataPath = path.join(__dirname, '../../knowledge-points-data.json');
    console.log(`正在读取数据文件: ${dataPath}`);
    
    const jsonData = fs.readFileSync(dataPath, 'utf-8');
    const knowledgePointsData: Partial<IKnowledgePoint>[] = JSON.parse(jsonData);

    // 删除所有旧数据
    console.log('正在清空知识库，准备载入计算机科学课程体系...');
    const deleteResult = await KnowledgePoint.deleteMany({});
    console.log(`已删除 ${deleteResult.deletedCount} 条旧数据\n`);

    // 插入新数据
    console.log(`正在插入计算机科学课程数据...共 ${knowledgePointsData.length} 个知识点`);
    await KnowledgePoint.insertMany(knowledgePointsData);

    console.log('\n✅ 计算机科学课程数据填充成功！');
    console.log(`共插入 ${knowledgePointsData.length} 个知识点\n`);

    // 显示课程列表
    console.log('课程列表:');
    knowledgePointsData.forEach((kp, index) => {
      const prereqStr = kp.prerequisites && kp.prerequisites.length > 0 
        ? ` (前置: ${kp.prerequisites.join(', ')})` 
        : '';
      const difficultyStars = '⭐'.repeat(kp.difficulty || 1);
      console.log(`${index + 1}. ${kp.title} (${kp.subject}) ${difficultyStars} - ${kp.contentSnippet?.substring(0, 50)}...${prereqStr}`);
    });

    console.log('\n💡 提示:');
    console.log('  - 基础知识点数据已导入');
    console.log('  - 如需填充笔记内容，请运行: npm run fill:content');
    console.log('  - 如需清除并重新填充，请运行: npm run fill:content:clear');

  } catch (error) {
    console.error('❌ 数据填充失败:', error);
    if (error instanceof Error) {
      console.error('错误详情:', error.message);
    }
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n数据库连接已关闭。');
  }
}

if (require.main === module) {
  seedCSCurriculum();
}

export { seedCSCurriculum };

