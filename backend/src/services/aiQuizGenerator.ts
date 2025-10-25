// backend/src/services/aiQuizGenerator.ts
import { getChatCompletion, ChatMessage } from './ai';
import WrongQuestion from '../models/WrongQuestion';
import UserProgress from '../models/UserProgress';
import KnowledgePoint from '../models/KnowledgePoint';
import { Types } from 'mongoose';

/**
 * AI智能出题系统
 * 基于用户薄弱点，AI自动生成个性化练习题
 */

export interface QuizGenerationRequest {
  subject: string;
  weakPoints: string[]; // 薄弱知识点标题
  difficulty: number; // 1-5
  count: number; // 生成题目数量
  questionTypes?: ('single' | 'multiple' | 'boolean' | 'short_answer')[]; // 题型
}

export interface GeneratedQuestion {
  type: 'single' | 'multiple' | 'boolean' | 'short_answer';
  question: string;
  options?: string[]; // 选择题选项
  correctAnswer: number | number[] | string;
  explanation: string;
  difficulty: number;
  keywords: string[]; // 关键知识点
}

export interface QuizGenerationResponse {
  questions: GeneratedQuestion[];
  totalGenerated: number;
  subject: string;
  difficulty: number;
  generatedAt: Date;
}

/**
 * 生成个性化练习题
 */
export async function generatePersonalizedQuiz(
  userId: Types.ObjectId,
  request: QuizGenerationRequest
): Promise<QuizGenerationResponse> {
  // 默认题型：单选、多选、判断
  const questionTypes = request.questionTypes || ['single', 'multiple', 'boolean'];

  // 1. 分析用户的薄弱点
  const weaknessAnalysis = await analyzeUserWeaknesses(userId, request.subject);

  // 2. 构建AI提示词
  const prompt = buildQuizGenerationPrompt(request, weaknessAnalysis);

  // 3. 调用AI生成题目
  const aiResponse = await getChatCompletion(
    [
      {
        role: 'system',
        content:
          '你是一位专业的教育测评专家，擅长根据学生的薄弱点设计个性化练习题。生成的题目应该精准、有针对性，难度适中。',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    { maxTokens: 4000 }
  );

  // 4. 解析AI响应
  const questions = parseAIQuizResponse(aiResponse, request.difficulty);

  return {
    questions,
    totalGenerated: questions.length,
    subject: request.subject,
    difficulty: request.difficulty,
    generatedAt: new Date(),
  };
}

/**
 * 分析用户薄弱点
 */
async function analyzeUserWeaknesses(userId: Types.ObjectId, subject: string) {
  // 获取该学科的错题
  const wrongQuestions = await WrongQuestion.find({
    userId,
    subject,
    mastered: false,
  })
    .select('pointTitle question')
    .limit(20)
    .lean();

  // 按知识点分组
  const pointFrequency: Map<string, number> = new Map();
  for (const wq of wrongQuestions) {
    const count = pointFrequency.get(wq.pointTitle) || 0;
    pointFrequency.set(wq.pointTitle, count + 1);
  }

  // 找出最薄弱的3个知识点
  const weakestPoints = Array.from(pointFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([point]) => point);

  // 获取学科内完成度较低的知识点
  const allSubjectPoints = await KnowledgePoint.find({ subject })
    .select('id title')
    .lean();

  const userProgress = await UserProgress.find({
    userId,
    pointId: { $in: allSubjectPoints.map(p => p.id) },
  }).lean();

  const lowScorePoints = userProgress
    .filter(p => p.bestScore && p.bestScore < 70)
    .sort((a, b) => (a.bestScore || 100) - (b.bestScore || 100))
    .slice(0, 3)
    .map(p => {
      const point = allSubjectPoints.find(pt => pt.id === p.pointId);
      return point?.title || '';
    })
    .filter(Boolean);

  return {
    errorPronePoints: weakestPoints,
    lowScorePoints,
    totalErrors: wrongQuestions.length,
  };
}

/**
 * 构建AI出题提示词
 */
function buildQuizGenerationPrompt(
  request: QuizGenerationRequest,
  weakness: {
    errorPronePoints: string[];
    lowScorePoints: string[];
    totalErrors: number;
  }
): string {
  const weakPointsList = [...new Set([...request.weakPoints, ...weakness.errorPronePoints])];

  return `请为以下学习需求生成 ${request.count} 道练习题：

**学科**: ${request.subject}
**难度**: ${request.difficulty}/5
**重点考察知识点**:
${weakPointsList.map((point, idx) => `${idx + 1}. ${point}`).join('\n')}

**用户薄弱环节**:
- 最容易出错的知识点: ${weakness.errorPronePoints.join('、') || '无'}
- 得分较低的知识点: ${weakness.lowScorePoints.join('、') || '无'}
- 累计错题数: ${weakness.totalErrors} 道

**要求**:
1. 题型分布：单选题、多选题、判断题均可
2. 每道题都要紧密围绕上述薄弱知识点设计
3. 难度等级为 ${request.difficulty} 级（1=基础，5=困难）
4. 每道题必须包含详细的解析说明

**输出格式** (严格按照以下JSON格式):
\`\`\`json
{
  "questions": [
    {
      "type": "single",
      "question": "题目内容",
      "options": ["选项A", "选项B", "选项C", "选项D"],
      "correctAnswer": 0,
      "explanation": "详细解析",
      "keywords": ["关键词1", "关键词2"]
    },
    {
      "type": "multiple",
      "question": "多选题内容",
      "options": ["选项A", "选项B", "选项C", "选项D"],
      "correctAnswer": [0, 2],
      "explanation": "详细解析",
      "keywords": ["关键词1", "关键词2"]
    },
    {
      "type": "boolean",
      "question": "判断题内容",
      "options": ["正确", "错误"],
      "correctAnswer": 0,
      "explanation": "详细解析",
      "keywords": ["关键词1"]
    }
  ]
}
\`\`\`

请确保题目质量高、有针对性，能够帮助学生强化薄弱环节。`;
}

/**
 * 解析AI响应
 */
function parseAIQuizResponse(aiResponse: string, difficulty: number): GeneratedQuestion[] {
  try {
    // 提取JSON部分
    const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/) || aiResponse.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      throw new Error('无法从AI响应中提取JSON');
    }

    const jsonStr = jsonMatch[1] || jsonMatch[0];
    const parsed = JSON.parse(jsonStr);

    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error('AI响应格式不正确');
    }

    return parsed.questions.map((q: any) => ({
      type: q.type || 'single',
      question: q.question,
      options: q.options || [],
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty,
      keywords: q.keywords || [],
    }));
  } catch (error) {
    console.error('解析AI出题响应失败:', error);
    // 返回空数组，由上层处理
    return [];
  }
}

/**
 * 快速生成练习题（针对特定知识点）
 */
export async function generateQuickQuiz(
  pointId: string,
  count: number = 5
): Promise<GeneratedQuestion[]> {
  const point = await KnowledgePoint.findOne({ id: pointId })
    .select('title subject difficulty')
    .lean();

  if (!point) {
    throw new Error('知识点不存在');
  }

  const prompt = `请为以下知识点生成 ${count} 道练习题：

**知识点**: ${point.title}
**学科**: ${point.subject}
**难度**: ${point.difficulty}/5

**要求**:
1. 题型多样化（单选、多选、判断）
2. 紧扣知识点核心概念
3. 包含详细解析

**输出格式** (JSON):
\`\`\`json
{
  "questions": [
    {
      "type": "single",
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "...",
      "keywords": ["..."]
    }
  ]
}
\`\`\``;

  const aiResponse = await getChatCompletion(
    [
      {
        role: 'system',
        content: '你是一位专业的题库设计专家。',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    { maxTokens: 3000 }
  );

  return parseAIQuizResponse(aiResponse, point.difficulty);
}

/**
 * 生成错题强化练习
 * 基于用户的错题，生成类似题目
 */
export async function generateSimilarQuestions(
  userId: Types.ObjectId,
  wrongQuestionId: Types.ObjectId,
  count: number = 3
): Promise<GeneratedQuestion[]> {
  const wrongQuestion = await WrongQuestion.findById(wrongQuestionId).lean();
  if (!wrongQuestion) {
    throw new Error('错题不存在');
  }

  const prompt = `用户在以下题目上出错了，请生成 ${count} 道类似的练习题帮助巩固：

**原题目**: ${wrongQuestion.question}
**知识点**: ${wrongQuestion.pointTitle}
**学科**: ${wrongQuestion.subject}

**要求**:
1. 题目类型与原题相同（${wrongQuestion.type}）
2. 考察相同的知识点和概念
3. 难度相当或略低
4. 避免与原题完全相同

**输出格式** (JSON):
\`\`\`json
{
  "questions": [...]
}
\`\`\``;

  const aiResponse = await getChatCompletion(
    [
      {
        role: 'system',
        content: '你是一位擅长举一反三的教育专家。',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    { maxTokens: 2500 }
  );

  return parseAIQuizResponse(aiResponse, wrongQuestion.difficulty || 3);
}

