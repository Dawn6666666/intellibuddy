import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import KnowledgePoint from './models/KnowledgePoint';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

interface SubjectStats {
  count: number;
  avgDifficulty: number;
  totalEstimatedTime: number;
  knowledgePoints: Array<{
    id: string;
    title: string;
    difficulty: number;
    estimatedTime: number;
    prerequisites: string[];
    quizCount: number;
    hasContent: boolean;
    hasContentFiles: boolean;
  }>;
}

async function queryKnowledgeStructure() {
  try {
    console.log('🔌 连接到数据库...');
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/intellibuddy';
    
    if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
      console.log('⚠️  未找到 MONGODB_URI 或 MONGO_URI 环境变量');
      console.log('📝 尝试连接到本地数据库: mongodb://localhost:27017/intellibuddy');
      console.log('💡 提示: 请确保 MongoDB 服务已启动，或在 .env 文件中配置远程数据库连接\n');
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ 数据库连接成功\n');

    // 查询所有知识点
    const knowledgePoints = await KnowledgePoint.find({}).lean();
    
    console.log('📚 知识库结构总览');
    console.log('='.repeat(80));
    console.log(`总知识点数量: ${knowledgePoints.length}\n`);

    if (knowledgePoints.length === 0) {
      console.log('⚠️  数据库中没有知识点数据');
      return;
    }

    // 按学科分类统计
    const subjectMap = new Map<string, SubjectStats>();
    
    for (const kp of knowledgePoints) {
      const subject = kp.subject || '未分类';
      
      if (!subjectMap.has(subject)) {
        subjectMap.set(subject, {
          count: 0,
          avgDifficulty: 0,
          totalEstimatedTime: 0,
          knowledgePoints: []
        });
      }
      
      const stats = subjectMap.get(subject)!;
      stats.count++;
      stats.avgDifficulty += kp.difficulty || 3;
      stats.totalEstimatedTime += kp.estimatedTime || 0;
      stats.knowledgePoints.push({
        id: kp.id,
        title: kp.title,
        difficulty: kp.difficulty || 3,
        estimatedTime: kp.estimatedTime || 0,
        prerequisites: kp.prerequisites || [],
        quizCount: (kp.quiz || []).length,
        hasContent: !!kp.content,
        hasContentFiles: !!(kp.contentFiles && kp.contentFiles.length > 0)
      });
    }

    // 显示各学科详细信息
    for (const [subject, stats] of subjectMap) {
      console.log(`\n📖 学科: ${subject}`);
      console.log('-'.repeat(80));
      console.log(`  知识点数量: ${stats.count}`);
      console.log(`  平均难度: ${(stats.avgDifficulty / stats.count).toFixed(1)}`);
      console.log(`  总预计学习时长: ${stats.totalEstimatedTime} 分钟 (${(stats.totalEstimatedTime / 60).toFixed(1)} 小时)`);
      
      // 按难度排序显示知识点
      const sortedKPs = stats.knowledgePoints.sort((a, b) => a.difficulty - b.difficulty);
      
      console.log(`\n  知识点列表:`);
      sortedKPs.forEach((kp, index) => {
        const difficultyStr = '★'.repeat(kp.difficulty) + '☆'.repeat(5 - kp.difficulty);
        const contentStatus = kp.hasContentFiles ? '📄多文件' : (kp.hasContent ? '📝单文件' : '⚠️无内容');
        const quizStatus = kp.quizCount > 0 ? `📝${kp.quizCount}题` : '无题';
        const prerequisitesInfo = kp.prerequisites.length > 0 ? `前置${kp.prerequisites.length}个` : '无前置';
        
        console.log(`    ${index + 1}. [${kp.id}] ${kp.title}`);
        console.log(`       难度: ${difficultyStr} (${kp.difficulty}/5) | 时长: ${kp.estimatedTime}分钟 | ${contentStatus} | ${quizStatus} | ${prerequisitesInfo}`);
      });
    }

    // 显示难度分布
    console.log('\n\n📊 难度分布');
    console.log('='.repeat(80));
    
    const difficultyCount = [0, 0, 0, 0, 0];
    knowledgePoints.forEach(kp => {
      const diff = (kp.difficulty || 3) - 1;
      if (diff >= 0 && diff < 5) {
        difficultyCount[diff]++;
      }
    });
    
    difficultyCount.forEach((count, index) => {
      const stars = '★'.repeat(index + 1) + '☆'.repeat(4 - index);
      const percentage = knowledgePoints.length > 0 ? ((count / knowledgePoints.length) * 100).toFixed(1) : '0';
      const bar = '█'.repeat(Math.floor(count / 2));
      console.log(`  ${stars} (${index + 1}/5): ${count} 个 (${percentage}%) ${bar}`);
    });

    // 显示前置知识依赖分析
    console.log('\n\n🔗 知识依赖关系');
    console.log('='.repeat(80));
    
    const noPrerequisites = knowledgePoints.filter(kp => !kp.prerequisites || kp.prerequisites.length === 0);
    const hasPrerequisites = knowledgePoints.filter(kp => kp.prerequisites && kp.prerequisites.length > 0);
    
    console.log(`  独立知识点（无前置）: ${noPrerequisites.length} 个`);
    console.log(`  依赖知识点（有前置）: ${hasPrerequisites.length} 个`);
    
    if (hasPrerequisites.length > 0) {
      const avgPrerequisites = hasPrerequisites.reduce((sum, kp) => sum + kp.prerequisites.length, 0) / hasPrerequisites.length;
      console.log(`  平均前置知识数: ${avgPrerequisites.toFixed(1)}`);
      
      // 找出前置最多的知识点
      const maxPrerequisites = hasPrerequisites.reduce((max, kp) => 
        kp.prerequisites.length > max.prerequisites.length ? kp : max
      );
      console.log(`  前置最多: [${maxPrerequisites.id}] ${maxPrerequisites.title} (${maxPrerequisites.prerequisites.length}个前置)`);
    }

    // 显示内容完整度
    console.log('\n\n📄 内容完整度');
    console.log('='.repeat(80));
    
    const hasContentFiles = knowledgePoints.filter(kp => kp.contentFiles && kp.contentFiles.length > 0);
    const hasSingleContent = knowledgePoints.filter(kp => kp.content && (!kp.contentFiles || kp.contentFiles.length === 0));
    const noContent = knowledgePoints.filter(kp => !kp.content && (!kp.contentFiles || kp.contentFiles.length === 0));
    
    console.log(`  多文件内容: ${hasContentFiles.length} 个 (${((hasContentFiles.length / knowledgePoints.length) * 100).toFixed(1)}%)`);
    console.log(`  单文件内容: ${hasSingleContent.length} 个 (${((hasSingleContent.length / knowledgePoints.length) * 100).toFixed(1)}%)`);
    console.log(`  无内容: ${noContent.length} 个 (${((noContent.length / knowledgePoints.length) * 100).toFixed(1)}%)`);
    
    if (hasContentFiles.length > 0) {
      const totalFiles = hasContentFiles.reduce((sum, kp) => sum + (kp.contentFiles?.length || 0), 0);
      console.log(`  总内容文件数: ${totalFiles}`);
      console.log(`  平均每知识点文件数: ${(totalFiles / hasContentFiles.length).toFixed(1)}`);
    }

    // 显示测验题分析
    console.log('\n\n📝 测验题统计');
    console.log('='.repeat(80));
    
    const totalQuizzes = knowledgePoints.reduce((sum, kp) => sum + (kp.quiz?.length || 0), 0);
    const withQuiz = knowledgePoints.filter(kp => kp.quiz && kp.quiz.length > 0);
    const withoutQuiz = knowledgePoints.filter(kp => !kp.quiz || kp.quiz.length === 0);
    
    console.log(`  总测验题数: ${totalQuizzes}`);
    console.log(`  有测验的知识点: ${withQuiz.length} 个 (${((withQuiz.length / knowledgePoints.length) * 100).toFixed(1)}%)`);
    console.log(`  无测验的知识点: ${withoutQuiz.length} 个 (${((withoutQuiz.length / knowledgePoints.length) * 100).toFixed(1)}%)`);
    
    if (withQuiz.length > 0) {
      console.log(`  平均每知识点题数: ${(totalQuizzes / withQuiz.length).toFixed(1)}`);
      
      // 测验题类型统计
      const quizTypes = new Map<string, number>();
      knowledgePoints.forEach(kp => {
        if (kp.quiz) {
          kp.quiz.forEach(q => {
            const type = q.type || 'unknown';
            quizTypes.set(type, (quizTypes.get(type) || 0) + 1);
          });
        }
      });
      
      console.log(`\n  题型分布:`);
      const typeNames: Record<string, string> = {
        'single': '单选题',
        'multiple': '多选题',
        'boolean': '判断题'
      };
      
      for (const [type, count] of quizTypes) {
        const typeName = typeNames[type] || type;
        console.log(`    ${typeName}: ${count} 道 (${((count / totalQuizzes) * 100).toFixed(1)}%)`);
      }
    }

    // 显示学习时长统计
    console.log('\n\n⏱️  学习时长统计');
    console.log('='.repeat(80));
    
    const totalMinutes = knowledgePoints.reduce((sum, kp) => sum + (kp.estimatedTime || 0), 0);
    const avgMinutes = knowledgePoints.length > 0 ? totalMinutes / knowledgePoints.length : 0;
    
    console.log(`  总预计学习时长: ${totalMinutes} 分钟 (${(totalMinutes / 60).toFixed(1)} 小时)`);
    console.log(`  平均每知识点: ${avgMinutes.toFixed(0)} 分钟`);
    
    const timeRanges = [
      { label: '< 30分钟', min: 0, max: 30 },
      { label: '30-60分钟', min: 30, max: 60 },
      { label: '60-120分钟', min: 60, max: 120 },
      { label: '> 120分钟', min: 120, max: Infinity }
    ];
    
    console.log(`\n  时长分布:`);
    timeRanges.forEach(range => {
      const count = knowledgePoints.filter(kp => {
        const time = kp.estimatedTime || 0;
        return time >= range.min && time < range.max;
      }).length;
      const percentage = knowledgePoints.length > 0 ? ((count / knowledgePoints.length) * 100).toFixed(1) : '0';
      console.log(`    ${range.label}: ${count} 个 (${percentage}%)`);
    });

    // 显示学习路径建议
    console.log('\n\n🎯 学习路径分析');
    console.log('='.repeat(80));
    
    // 找出入门知识点（无前置且难度低）
    const entryPoints = knowledgePoints
      .filter(kp => (!kp.prerequisites || kp.prerequisites.length === 0) && (kp.difficulty || 3) <= 2)
      .sort((a, b) => (a.difficulty || 3) - (b.difficulty || 3));
    
    if (entryPoints.length > 0) {
      console.log(`\n  推荐入门知识点 (${entryPoints.length}个):`);
      entryPoints.slice(0, 5).forEach((kp, index) => {
        console.log(`    ${index + 1}. [${kp.id}] ${kp.title} (难度 ${kp.difficulty}/5, ${kp.estimatedTime}分钟)`);
      });
      if (entryPoints.length > 5) {
        console.log(`    ... 还有 ${entryPoints.length - 5} 个入门知识点`);
      }
    }
    
    // 找出高级知识点（前置多且难度高）
    const advancedPoints = knowledgePoints
      .filter(kp => kp.prerequisites && kp.prerequisites.length >= 2 && (kp.difficulty || 3) >= 4)
      .sort((a, b) => {
        const scoreA = (a.difficulty || 3) + a.prerequisites.length;
        const scoreB = (b.difficulty || 3) + b.prerequisites.length;
        return scoreB - scoreA;
      });
    
    if (advancedPoints.length > 0) {
      console.log(`\n  高级知识点 (${advancedPoints.length}个):`);
      advancedPoints.slice(0, 5).forEach((kp, index) => {
        console.log(`    ${index + 1}. [${kp.id}] ${kp.title} (难度 ${kp.difficulty}/5, ${kp.prerequisites.length}个前置)`);
      });
      if (advancedPoints.length > 5) {
        console.log(`    ... 还有 ${advancedPoints.length - 5} 个高级知识点`);
      }
    }

    // 总体统计摘要
    console.log('\n\n📈 总体统计摘要');
    console.log('='.repeat(80));
    console.log(`  学科数量: ${subjectMap.size}`);
    console.log(`  知识点总数: ${knowledgePoints.length}`);
    console.log(`  内容完整率: ${(((hasContentFiles.length + hasSingleContent.length) / knowledgePoints.length) * 100).toFixed(1)}%`);
    console.log(`  测验覆盖率: ${((withQuiz.length / knowledgePoints.length) * 100).toFixed(1)}%`);
    console.log(`  平均难度: ${(knowledgePoints.reduce((sum, kp) => sum + (kp.difficulty || 3), 0) / knowledgePoints.length).toFixed(1)}/5`);
    console.log(`  总学习时长: ${(totalMinutes / 60).toFixed(1)} 小时`);

    console.log('\n' + '='.repeat(80));
    console.log('✅ 查询完成\n');

  } catch (error) {
    console.error('❌ 查询失败:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 数据库连接已关闭');
  }
}

// 运行查询
if (require.main === module) {
  queryKnowledgeStructure()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
}

export { queryKnowledgeStructure };
