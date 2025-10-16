/**
 * 从 JSON 文件导入题库数据
 * 使用方法: npx ts-node src/import-quiz-from-json.ts <json文件路径>
 */

import mongoose from 'mongoose';
import KnowledgePoint from './models/KnowledgePoint';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

interface QuizItem {
  question: string;
  type: 'single' | 'multiple' | 'boolean';
  options: string[];
  correctAnswer: number | number[];
  explanation: string;
}

interface QuizDataFromJSON {
  pointId: string;
  pointTitle?: string;
  quiz: QuizItem[];
}

/**
 * 验证题目数据格式
 */
function validateQuizData(data: any): data is QuizDataFromJSON[] {
  if (!Array.isArray(data)) {
    throw new Error('JSON 数据必须是数组格式');
  }

  for (const item of data) {
    if (!item.pointId || typeof item.pointId !== 'string') {
      throw new Error(`缺少 pointId 或格式错误: ${JSON.stringify(item)}`);
    }

    if (!Array.isArray(item.quiz)) {
      throw new Error(`${item.pointId}: quiz 必须是数组`);
    }

    for (const q of item.quiz) {
      if (!q.question || !q.type || !Array.isArray(q.options) || q.correctAnswer === undefined || !q.explanation) {
        throw new Error(`${item.pointId}: 题目格式不完整 - ${JSON.stringify(q)}`);
      }

      if (!['single', 'multiple', 'boolean'].includes(q.type)) {
        throw new Error(`${item.pointId}: 题目类型必须是 single、multiple 或 boolean`);
      }

      // 验证正确答案格式
      if (q.type === 'multiple') {
        if (!Array.isArray(q.correctAnswer)) {
          throw new Error(`${item.pointId}: 多选题的 correctAnswer 必须是数组`);
        }
      } else {
        if (typeof q.correctAnswer !== 'number') {
          throw new Error(`${item.pointId}: 单选题和判断题的 correctAnswer 必须是数字`);
        }
      }
    }
  }

  return true;
}

/**
 * 从 JSON 文件导入题库
 */
async function importQuizFromJSON(jsonFilePath: string) {
  try {
    console.log(`📖 正在读取 JSON 文件: ${jsonFilePath}`);

    // 读取 JSON 文件
    const absolutePath = path.isAbsolute(jsonFilePath) 
      ? jsonFilePath 
      : path.resolve(process.cwd(), jsonFilePath);

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`文件不存在: ${absolutePath}`);
    }

    const fileContent = fs.readFileSync(absolutePath, 'utf-8');
    const jsonData = JSON.parse(fileContent);

    // 查找包含题库数据的字段
    let quizData: QuizDataFromJSON[] = [];

    // 如果 JSON 是对象，尝试找到包含题库的字段
    if (typeof jsonData === 'object' && !Array.isArray(jsonData)) {
      const possibleKeys = Object.keys(jsonData).filter(key => 
        key.includes('题库') || key.includes('quiz') || key.includes('data')
      );

      if (possibleKeys.length === 0) {
        throw new Error('未找到题库数据字段。请确保 JSON 包含题库数组。');
      }

      console.log(`📚 找到以下题库字段: ${possibleKeys.join(', ')}`);
      console.log('请选择要导入的字段（输入序号）:');
      possibleKeys.forEach((key, index) => {
        const data = jsonData[key];
        const count = Array.isArray(data) ? data.length : 0;
        console.log(`  ${index + 1}. ${key} (${count} 项)`);
      });

      // 简化版：自动选择第一个包含数据的字段
      for (const key of possibleKeys) {
        const data = jsonData[key];
        if (Array.isArray(data) && data.length > 0 && data[0].quiz && data[0].quiz.length > 0) {
          quizData = data;
          console.log(`✅ 自动选择: ${key}`);
          break;
        }
      }

      if (quizData.length === 0) {
        throw new Error('未找到有效的题库数据');
      }
    } else if (Array.isArray(jsonData)) {
      quizData = jsonData;
    }

    // 验证数据格式
    validateQuizData(quizData);
    console.log(`✅ 数据格式验证通过`);

    // 统计信息
    const totalPoints = quizData.length;
    const totalQuestions = quizData.reduce((sum, item) => sum + item.quiz.length, 0);
    console.log(`📊 准备导入 ${totalPoints} 个知识点的 ${totalQuestions} 道题目`);

    // 连接数据库
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/intellibuddy';
    await mongoose.connect(mongoUri);
    console.log('✅ 已连接到 MongoDB\n');

    let successCount = 0;
    let failCount = 0;
    let notFoundCount = 0;

    // 导入数据
    for (const item of quizData) {
      try {
        const result = await KnowledgePoint.findOneAndUpdate(
          { id: item.pointId },
          { $set: { quiz: item.quiz } },
          { new: true }
        );

        if (result) {
          console.log(`✓ ${item.pointId}: ${item.pointTitle || result.title} - ${item.quiz.length} 题`);
          successCount++;
        } else {
          console.warn(`⚠️  ${item.pointId}: 知识点不存在`);
          notFoundCount++;
        }
      } catch (error: any) {
        console.error(`❌ ${item.pointId}: 导入失败 -`, error.message);
        failCount++;
      }
    }

    console.log('\n✅ 题库导入完成！');
    console.log(`   ✓ 成功: ${successCount} 个知识点`);
    if (notFoundCount > 0) {
      console.log(`   ⚠️  未找到: ${notFoundCount} 个知识点`);
    }
    if (failCount > 0) {
      console.log(`   ❌ 失败: ${failCount} 个知识点`);
    }

    // 显示统计
    const pointsWithQuiz = await KnowledgePoint.find({ 
      'quiz.0': { $exists: true } 
    }).select('id title quiz');

    console.log(`\n📚 数据库中共有 ${pointsWithQuiz.length} 个知识点包含测验题`);

  } catch (error: any) {
    console.error('\n❌ 导入失败:', error.message);
    if (error.stack) {
      console.error('详细错误:', error.stack);
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 已断开数据库连接');
  }
}

// 命令行执行
if (require.main === module) {
  const jsonFilePath = process.argv[2];

  if (!jsonFilePath) {
    console.error('❌ 请提供 JSON 文件路径');
    console.log('\n使用方法:');
    console.log('  npx ts-node src/import-quiz-from-json.ts <json文件路径>');
    console.log('\n示例:');
    console.log('  npx ts-node src/import-quiz-from-json.ts ../quiz-templates/my-quiz.json');
    console.log('  npx ts-node src/import-quiz-from-json.ts ./data/quiz-data.json');
    process.exit(1);
  }

  importQuizFromJSON(jsonFilePath);
}

export { importQuizFromJSON };

