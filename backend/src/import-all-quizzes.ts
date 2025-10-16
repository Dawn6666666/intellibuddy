/**
 * 批量导入所有题库文件到数据库
 * 使用方法: npx ts-node src/import-all-quizzes.ts
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
 * 递归获取目录下的所有 JSON 文件
 */
function getAllJsonFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // 递归遍历子目录
      getAllJsonFiles(filePath, fileList);
    } else if (file.endsWith('.json') && !file.includes('template') && !file.includes('quiz-template')) {
      // 添加 JSON 文件（排除模板文件）
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * 验证题目数据格式
 */
function validateQuizData(data: any, fileName: string): data is QuizDataFromJSON[] {
  if (!Array.isArray(data)) {
    throw new Error(`${fileName}: JSON 数据必须是数组格式`);
  }

  for (const item of data) {
    if (!item.pointId || typeof item.pointId !== 'string') {
      throw new Error(`${fileName}: 缺少 pointId 或格式错误: ${JSON.stringify(item)}`);
    }

    if (!Array.isArray(item.quiz)) {
      throw new Error(`${fileName} - ${item.pointId}: quiz 必须是数组`);
    }

    for (const q of item.quiz) {
      if (!q.question || !q.type || !Array.isArray(q.options) || q.correctAnswer === undefined || !q.explanation) {
        throw new Error(`${fileName} - ${item.pointId}: 题目格式不完整`);
      }

      if (!['single', 'multiple', 'boolean'].includes(q.type)) {
        throw new Error(`${fileName} - ${item.pointId}: 题目类型必须是 single、multiple 或 boolean`);
      }

      // 验证正确答案格式
      if (q.type === 'multiple') {
        if (!Array.isArray(q.correctAnswer)) {
          throw new Error(`${fileName} - ${item.pointId}: 多选题的 correctAnswer 必须是数组`);
        }
      } else {
        if (typeof q.correctAnswer !== 'number') {
          throw new Error(`${fileName} - ${item.pointId}: 单选题和判断题的 correctAnswer 必须是数字`);
        }
      }
    }
  }

  return true;
}

/**
 * 导入单个 JSON 文件
 */
async function importSingleFile(filePath: string): Promise<{
  success: number;
  notFound: number;
  failed: number;
  totalQuestions: number;
}> {
  const fileName = path.basename(filePath);
  console.log(`\n📖 正在处理: ${fileName}`);

  try {
    // 读取 JSON 文件
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(fileContent);

    // 查找包含题库数据的字段
    let quizData: QuizDataFromJSON[] = [];

    if (typeof jsonData === 'object' && !Array.isArray(jsonData)) {
      // 尝试找到包含题库的字段
      const possibleKeys = Object.keys(jsonData).filter(key => 
        Array.isArray(jsonData[key]) && 
        jsonData[key].length > 0 && 
        jsonData[key][0].quiz
      );

      if (possibleKeys.length > 0) {
        quizData = jsonData[possibleKeys[0]];
      } else {
        console.warn(`⚠️  ${fileName}: 未找到有效的题库数据，跳过`);
        return { success: 0, notFound: 0, failed: 0, totalQuestions: 0 };
      }
    } else if (Array.isArray(jsonData)) {
      quizData = jsonData;
    }

    // 验证数据格式
    validateQuizData(quizData, fileName);

    let successCount = 0;
    let failCount = 0;
    let notFoundCount = 0;
    let totalQuestions = 0;

    // 导入数据
    for (const item of quizData) {
      try {
        const result = await KnowledgePoint.findOneAndUpdate(
          { id: item.pointId },
          { $set: { quiz: item.quiz } },
          { new: true }
        );

        if (result) {
          console.log(`  ✓ ${item.pointId}: ${item.quiz.length} 题`);
          successCount++;
          totalQuestions += item.quiz.length;
        } else {
          console.warn(`  ⚠️  ${item.pointId}: 知识点不存在`);
          notFoundCount++;
        }
      } catch (error: any) {
        console.error(`  ❌ ${item.pointId}: ${error.message}`);
        failCount++;
      }
    }

    console.log(`✅ ${fileName} 完成: ${successCount} 个知识点, ${totalQuestions} 道题`);
    return { success: successCount, notFound: notFoundCount, failed: failCount, totalQuestions };

  } catch (error: any) {
    console.error(`❌ ${fileName} 处理失败:`, error.message);
    return { success: 0, notFound: 0, failed: 0, totalQuestions: 0 };
  }
}

/**
 * 批量导入所有题库
 */
async function importAllQuizzes() {
  console.log('🚀 开始批量导入所有题库...\n');

  try {
    // 连接数据库
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/intellibuddy';
    await mongoose.connect(mongoUri);
    console.log('✅ 已连接到 MongoDB\n');

    // 获取题库目录下的所有 JSON 文件
    const quizTemplatesDir = path.resolve(__dirname, '../quiz-templates');
    const jsonFiles = getAllJsonFiles(quizTemplatesDir);

    console.log(`📚 找到 ${jsonFiles.length} 个题库文件:\n`);
    jsonFiles.forEach((file, index) => {
      const relativePath = path.relative(quizTemplatesDir, file);
      console.log(`  ${index + 1}. ${relativePath}`);
    });

    // 统计信息
    let totalSuccess = 0;
    let totalNotFound = 0;
    let totalFailed = 0;
    let totalQuestions = 0;
    let processedFiles = 0;

    console.log('\n' + '='.repeat(60));
    console.log('开始导入...');
    console.log('='.repeat(60));

    // 逐个导入文件
    for (const filePath of jsonFiles) {
      const result = await importSingleFile(filePath);
      totalSuccess += result.success;
      totalNotFound += result.notFound;
      totalFailed += result.failed;
      totalQuestions += result.totalQuestions;
      if (result.success > 0 || result.notFound > 0 || result.failed > 0) {
        processedFiles++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ 所有题库导入完成！');
    console.log('='.repeat(60));
    console.log(`📊 总体统计:`);
    console.log(`   ✓ 处理文件: ${processedFiles} / ${jsonFiles.length} 个`);
    console.log(`   ✓ 成功导入: ${totalSuccess} 个知识点`);
    console.log(`   ✓ 题目总数: ${totalQuestions} 道题`);
    if (totalNotFound > 0) {
      console.log(`   ⚠️  未找到知识点: ${totalNotFound} 个`);
    }
    if (totalFailed > 0) {
      console.log(`   ❌ 导入失败: ${totalFailed} 个`);
    }

    // 显示数据库统计
    const pointsWithQuiz = await KnowledgePoint.find({ 
      'quiz.0': { $exists: true } 
    }).select('id title quiz');

    const totalQuestionsInDB = pointsWithQuiz.reduce((sum, point) => sum + point.quiz.length, 0);

    console.log(`\n📚 数据库统计:`);
    console.log(`   知识点数: ${pointsWithQuiz.length} 个`);
    console.log(`   题目总数: ${totalQuestionsInDB} 道`);

    // 按学科统计
    const subjectStats: Record<string, { points: number; questions: number }> = {};
    for (const point of pointsWithQuiz) {
      const subject = point.id.split('_')[0]; // 从 pointId 提取学科前缀
      if (!subjectStats[subject]) {
        subjectStats[subject] = { points: 0, questions: 0 };
      }
      subjectStats[subject].points++;
      subjectStats[subject].questions += point.quiz.length;
    }

    console.log(`\n📊 学科分布:`);
    Object.entries(subjectStats)
      .sort((a, b) => b[1].questions - a[1].questions)
      .forEach(([subject, stats]) => {
        console.log(`   ${subject}: ${stats.points} 个知识点, ${stats.questions} 道题`);
      });

  } catch (error: any) {
    console.error('\n❌ 批量导入失败:', error.message);
    if (error.stack) {
      console.error('详细错误:', error.stack);
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 已断开数据库连接');
  }
}

// 命令行执行
if (require.main === module) {
  importAllQuizzes();
}

export { importAllQuizzes };

