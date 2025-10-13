// 数据转换脚本 - 将旧格式的 seed 数据转换为新模型格式
import fs from 'fs';
import path from 'path';

interface OldKnowledgePoint {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  prerequisites: string[];
  learningPath: string;
  estimatedHours: number;
  resources: Array<{
    type: string;
    title: string;
    url: string;
  }>;
  tags: string[];
  subtopics: Array<{
    title: string;
    content: string;
    order: number;
  }>;
}

interface NewKnowledgePoint {
  id: string;
  title: string;
  description: string;
  subject: string;
  category: string;
  difficulty: number;
  prerequisites: string[];
  learningPath: string;
  estimatedHours: number;
  contentSnippet: string;
  resources: Array<{
    type: string;
    title: string;
    url: string;
  }>;
  tags: string[];
  subtopics: Array<{
    title: string;
    content: string;
    order: number;
  }>;
  status: string;
  graphPosition?: {
    x: number;
    y: number;
  };
}

// 难度映射：字符串 -> 数字
const difficultyMap: Record<string, number> = {
  'beginner': 1,
  'intermediate': 3,
  'advanced': 5,
  'basic': 1,
  'medium': 3,
  'hard': 5
};

// 学科映射：根据 category 推断学科
function inferSubject(category: string, title: string): string {
  const catLower = category.toLowerCase();
  const titleLower = title.toLowerCase();
  
  if (catLower.includes('数学') || catLower.includes('math') || titleLower.includes('math')) {
    return '数学';
  }
  if (catLower.includes('编程') || catLower.includes('程序') || titleLower.includes('cs') || titleLower.includes('prog')) {
    return '计算机科学';
  }
  if (catLower.includes('算法') || catLower.includes('数据结构') || catLower.includes('algorithm') || catLower.includes('data structure')) {
    return '计算机科学';
  }
  if (catLower.includes('系统') || catLower.includes('操作') || catLower.includes('网络') || catLower.includes('system') || catLower.includes('network')) {
    return '计算机科学';
  }
  if (catLower.includes('数据库') || catLower.includes('database')) {
    return '计算机科学';
  }
  if (catLower.includes('离散') || catLower.includes('discrete')) {
    return '数学';
  }
  if (catLower.includes('概率') || catLower.includes('统计') || catLower.includes('probability') || catLower.includes('statistics')) {
    return '数学';
  }
  if (catLower.includes('线性代数') || catLower.includes('linear algebra')) {
    return '数学';
  }
  
  return '计算机科学'; // 默认
}

// 生成 contentSnippet
function generateContentSnippet(subtopics: Array<{ title: string; content: string; order: number }>): string {
  if (subtopics.length === 0) return '';
  
  // 取前3个 subtopic 的标题
  const snippets = subtopics
    .sort((a, b) => a.order - b.order)
    .slice(0, 3)
    .map(st => st.title);
  
  return snippets.join('、');
}

// 转换函数
function convertKnowledgePoint(old: OldKnowledgePoint, index: number, yearNum: number): NewKnowledgePoint {
  const subject = inferSubject(old.category, old.title);
  const difficulty = difficultyMap[old.difficulty.toLowerCase()] || 3;
  const contentSnippet = generateContentSnippet(old.subtopics);
  
  // 根据学年和索引计算图形位置
  const x = (index % 5) * 250; // 每行5个
  const y = yearNum * 200 + Math.floor(index / 5) * 150;
  
  return {
    id: old.id,
    title: old.title,
    description: old.description,
    subject,
    category: old.category,
    difficulty,
    prerequisites: old.prerequisites,
    learningPath: old.learningPath,
    estimatedHours: old.estimatedHours,
    contentSnippet,
    resources: old.resources,
    tags: old.tags,
    subtopics: old.subtopics,
    status: 'not_started',
    graphPosition: {
      x,
      y
    }
  };
}

// 处理单个文件
async function convertFile(inputFile: string, outputFile: string, yearNum: number) {
  console.log(`正在转换 ${inputFile}...`);
  
  // 读取原文件
  const content = fs.readFileSync(inputFile, 'utf-8');
  
  // 提取数组部分（使用正则表达式）
  const arrayMatch = content.match(/const\s+\w+KnowledgePoints\s*=\s*(\[[\s\S]*?\]);/);
  if (!arrayMatch) {
    console.error(`无法在 ${inputFile} 中找到数据数组`);
    return;
  }
  
  // 使用 eval 解析数据（仅用于脚本转换）
  let oldData: OldKnowledgePoint[];
  try {
    oldData = eval(arrayMatch[1]);
  } catch (error) {
    console.error(`解析 ${inputFile} 失败:`, error);
    return;
  }
  
  // 转换数据
  const newData = oldData.map((item, index) => convertKnowledgePoint(item, index, yearNum));
  
  // 生成新文件内容
  const newContent = `import mongoose from 'mongoose';
import dotenv from 'dotenv';
import KnowledgePoint from './models/KnowledgePoint';

dotenv.config();

const year${yearNum}KnowledgePoints = ${JSON.stringify(newData, null, 2)};

async function seedYear${yearNum}() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('请在 .env 文件中设置 MONGODB_URI');
    }

    await mongoose.connect(mongoUri);
    console.log('数据库连接成功');

    console.log('正在删除第${yearNum}学年旧数据...');
    await KnowledgePoint.deleteMany({
      id: { $regex: /^(cs|math|data)${yearNum === 1 ? '10' : yearNum === 2 ? '20' : yearNum === 3 ? '30' : '40'}/ }
    });

    console.log('正在插入第${yearNum}学年新数据...');
    await KnowledgePoint.insertMany(year${yearNum}KnowledgePoints);

    console.log(\`第${yearNum}学年数据填充成功！共 \${year${yearNum}KnowledgePoints.length} 个知识点\`);
  } catch (error) {
    console.error('数据填充失败:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('数据库连接已关闭。');
  }
}

if (require.main === module) {
  seedYear${yearNum}();
}

export { year${yearNum}KnowledgePoints, seedYear${yearNum} };
`;
  
  // 写入新文件
  fs.writeFileSync(outputFile, newContent, 'utf-8');
  console.log(`✓ ${outputFile} 转换完成，共 ${newData.length} 个知识点`);
}

// 主函数
async function main() {
  const backendSrc = path.join(__dirname);
  
  const files = [
    { input: 'seed-year1.ts', output: 'seed-year1-new.ts', year: 1 },
    { input: 'seed-year2.ts', output: 'seed-year2-new.ts', year: 2 },
    { input: 'seed-year3.ts', output: 'seed-year3-new.ts', year: 3 },
    { input: 'seed-year4.ts', output: 'seed-year4-new.ts', year: 4 }
  ];
  
  for (const file of files) {
    const inputPath = path.join(backendSrc, file.input);
    const outputPath = path.join(backendSrc, file.output);
    
    if (fs.existsSync(inputPath)) {
      await convertFile(inputPath, outputPath, file.year);
    } else {
      console.warn(`⚠ 文件不存在: ${inputPath}`);
    }
  }
  
  console.log('\n所有文件转换完成！');
  console.log('请检查 seed-year*-new.ts 文件，确认无误后：');
  console.log('1. 删除旧的 seed-year*.ts 文件');
  console.log('2. 将 seed-year*-new.ts 重命名为 seed-year*.ts');
}

main();

