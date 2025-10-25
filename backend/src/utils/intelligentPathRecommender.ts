// backend/src/utils/intelligentPathRecommender.ts
// AI增强版学习路径推荐系统
import KnowledgePoint from '../models/KnowledgePoint';
import Assessment from '../models/Assessment';
import UserProgress from '../models/UserProgress';
import StudySession from '../models/StudySession';
import WrongQuestion from '../models/WrongQuestion';
import {Types} from 'mongoose';

interface IntelligentRecommendation {
    pointId: string;
    priority: number;
    reason: string;
    predictedSuccessRate: number;  // 预测成功率 (0-100)
    estimatedTime: number;          // 预估学习时长(分钟)
    difficulty: number;             // 难度(1-5)
    urgency: number;                // 紧急程度(0-100)
}

/**
 * AI增强版路径推荐
 * 考虑多维度因素：学习历史、错题率、时间分布、学习状态等
 */
export async function generateIntelligentPath(
    userId: Types.ObjectId
): Promise<IntelligentRecommendation[]> {
    // 1. 获取用户全方位数据
    const [assessment, allPoints, userProgress, studySessions, wrongQuestions] = await Promise.all([
        Assessment.findOne({userId}),
        KnowledgePoint.find({}).select('id title subject difficulty prerequisites estimatedTime').lean(),
        UserProgress.find({userId}).lean(),
        StudySession.find({userId}).sort({startTime: -1}).limit(100).lean(),
        WrongQuestion.find({userId}).lean()
    ]);

    // 2. 计算用户学习能力指标
    const learningMetrics = calculateLearningMetrics(userProgress, studySessions, wrongQuestions);

    // 3. 过滤已完成的知识点
    const completedPointIds = new Set(
        userProgress.filter(p => p.status === 'completed').map(p => p.pointId)
    );
    const uncompletedPoints = allPoints.filter(p => !completedPointIds.has(p.id));

    // 4. 为每个知识点计算智能推荐分数
    const recommendations: IntelligentRecommendation[] = uncompletedPoints.map(point => {
        return calculateIntelligentPriority(
            point,
            assessment,
            learningMetrics,
            completedPointIds,
            userProgress,
            wrongQuestions,
            allPoints
        );
    });

    // 5. 拓扑排序 + 多维度排序
    const sortedRecommendations = intelligentSort(recommendations, allPoints);

    // 6. 只返回前50个推荐
    return sortedRecommendations.slice(0, 50);
}

/**
 * 计算用户学习能力指标
 */
function calculateLearningMetrics(
    userProgress: any[],
    studySessions: any[],
    wrongQuestions: any[]
) {
    const totalCompleted = userProgress.filter(p => p.status === 'completed').length;
    const totalTime = studySessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const avgTimePerPoint = totalCompleted > 0 ? totalTime / totalCompleted : 0;

    // 计算平均测验成绩
    const scoresAvg = userProgress
        .filter(p => p.score !== undefined)
        .reduce((sum, p, _, arr) => sum + p.score! / arr.length, 0);

    // 计算错题率
    const totalQuestions = userProgress.filter(p => p.score !== undefined).length * 10; // 假设每个测验10题
    const errorRate = totalQuestions > 0 ? (wrongQuestions.length / totalQuestions) * 100 : 50;

    // 计算学习速度 (知识点/小时)
    const learningSpeed = totalTime > 0 ? (totalCompleted / (totalTime / 3600)) : 1;

    // 获取最近学习时间
    const lastStudyTime = studySessions.length > 0 ? studySessions[0].startTime : null;
    const daysSinceLastStudy = lastStudyTime 
        ? Math.floor((Date.now() - new Date(lastStudyTime).getTime()) / (1000 * 60 * 60 * 24))
        : 999;

    return {
        totalCompleted,
        avgTimePerPoint,
        scoresAvg,
        errorRate,
        learningSpeed,
        daysSinceLastStudy
    };
}

/**
 * 计算单个知识点的智能推荐优先级
 */
function calculateIntelligentPriority(
    point: any,
    assessment: any,
    learningMetrics: any,
    completedPointIds: Set<string>,
    userProgress: any[],
    wrongQuestions: any[],
    allPoints: any[]
): IntelligentRecommendation {
    let priority = 50;
    let reason = '推荐学习';
    let predictedSuccessRate = 70; // 默认70%成功率
    let urgency = 50;

    // 1. 检查前置依赖
    const prerequisitesCompleted = point.prerequisites.every((preId: string) =>
        completedPointIds.has(preId)
    );

    if (!prerequisitesCompleted) {
        priority -= 100; // 前置未完成，大幅降低优先级
        reason = '需要先完成前置课程';
        predictedSuccessRate = 20;
    }

    // 2. 根据评估结果调整
    if (assessment) {
        // 2.1 弱项科目优先
        const weakness = assessment.weaknesses?.find((w: any) => w.subject === point.subject);
        if (weakness) {
            priority += 40;
            urgency += 30;
            reason = `强化${point.subject}弱项`;
        }

        // 2.2 能力匹配度
        const skillLevel = assessment.skillProfile?.find((s: any) => s.subject === point.subject)?.level || 50;
        const difficultyScore = point.difficulty * 20; // 1-5 => 20-100
        const matchScore = 100 - Math.abs(skillLevel - difficultyScore);
        priority += matchScore * 0.3;

        // 预测成功率：能力越匹配，成功率越高
        if (skillLevel >= difficultyScore + 20) {
            predictedSuccessRate = 90; // 能力远超难度
        } else if (skillLevel >= difficultyScore) {
            predictedSuccessRate = 80; // 能力略超难度
        } else if (skillLevel >= difficultyScore - 20) {
            predictedSuccessRate = 65; // 能力接近难度
        } else {
            predictedSuccessRate = 40; // 能力不足
            priority -= 20;
        }
    }

    // 3. 根据学习历史调整
    // 3.1 学习速度调整
    if (learningMetrics.learningSpeed > 2) {
        // 学习速度快，可以挑战更难的
        if (point.difficulty >= 3) {
            priority += 15;
        }
    } else if (learningMetrics.learningSpeed < 1) {
        // 学习速度慢，优先推荐简单的
        if (point.difficulty <= 2) {
            priority += 15;
        }
    }

    // 3.2 错题率影响
    const subjectErrors = wrongQuestions.filter((wq: any) => wq.subject === point.subject);
    if (subjectErrors.length > 5) {
        priority += 25; // 错题多，需要强化
        urgency += 20;
        reason = `${point.subject}错题较多，建议强化`;
    }

    // 3.3 学习停滞检测
    if (learningMetrics.daysSinceLastStudy > 7) {
        // 超过7天未学习，优先推荐简单课程，避免挫败感
        if (point.difficulty <= 2) {
            priority += 20;
            reason = '适合重新开始的简单课程';
        }
    }

    // 4. 基础课程优先策略
    if (point.difficulty === 1) {
        priority += 15;
        predictedSuccessRate = Math.min(95, predictedSuccessRate + 15);
    }

    // 5. 时间成本考虑
    // 对于学习时间紧张的用户，优先推荐短时间课程
    const estimatedTime = point.estimatedTime || 60;
    if (estimatedTime <= 30) {
        priority += 10; // 短课程有优势
    }

    // 6. 进行中的课程优先完成
    const inProgress = userProgress.find(
        (p: any) => p.pointId === point.id && p.status === 'in_progress'
    );
    if (inProgress) {
        priority += 50;
        urgency += 40;
        reason = '继续完成进行中的课程';
    }

    // 7. 动态调整：避免难度突变
    // 查找用户最近完成的3个课程的平均难度
    const recentCompleted = userProgress
        .filter((p: any) => p.status === 'completed')
        .slice(-3);
    
    if (recentCompleted.length > 0) {
        const avgRecentDifficulty = recentCompleted.reduce((sum, p) => {
            const kp = allPoints.find((ap: any) => ap.id === p.pointId);
            return sum + (kp?.difficulty || 3);
        }, 0) / recentCompleted.length;

        const difficultyGap = Math.abs(point.difficulty - avgRecentDifficulty);
        if (difficultyGap > 2) {
            priority -= 15; // 难度跳跃过大，降低优先级
            predictedSuccessRate -= 10;
        } else if (difficultyGap <= 0.5) {
            priority += 10; // 难度衔接平滑，提升优先级
        }
    }

    return {
        pointId: point.id,
        priority: Math.round(priority),
        reason,
        predictedSuccessRate: Math.max(10, Math.min(95, Math.round(predictedSuccessRate))),
        estimatedTime,
        difficulty: point.difficulty,
        urgency: Math.max(0, Math.min(100, Math.round(urgency)))
    };
}

/**
 * 智能排序：综合优先级、紧急程度、预测成功率
 */
function intelligentSort(
    recommendations: IntelligentRecommendation[],
    allPoints: any[]
): IntelligentRecommendation[] {
    const pointMap = new Map(allPoints.map(p => [p.id, p]));
    const result: IntelligentRecommendation[] = [];
    const visited = new Set<string>();

    // 计算综合得分：优先级 * 0.5 + 紧急程度 * 0.3 + 成功率 * 0.2
    const withScore = recommendations.map(rec => ({
        ...rec,
        compositeScore: rec.priority * 0.5 + rec.urgency * 0.3 + rec.predictedSuccessRate * 0.2
    }));

    // 按综合得分排序
    const sortedByScore = withScore.sort((a, b) => b.compositeScore - a.compositeScore);

    // 拓扑排序（确保前置依赖顺序）
    for (const rec of sortedByScore) {
        if (!visited.has(rec.pointId)) {
            topologicalDFS(rec.pointId, pointMap, visited, result, withScore);
        }
    }

    return result;
}

function topologicalDFS(
    pointId: string,
    pointMap: Map<string, any>,
    visited: Set<string>,
    result: IntelligentRecommendation[],
    recommendations: any[]
) {
    visited.add(pointId);
    const point = pointMap.get(pointId);
    if (!point) return;

    // 先处理前置依赖
    for (const preId of point.prerequisites) {
        if (!visited.has(preId)) {
            topologicalDFS(preId, pointMap, visited, result, recommendations);
        }
    }

    // 添加当前节点
    const rec = recommendations.find(r => r.pointId === pointId);
    if (rec) {
        result.push({
            pointId: rec.pointId,
            priority: rec.priority,
            reason: rec.reason,
            predictedSuccessRate: rec.predictedSuccessRate,
            estimatedTime: rec.estimatedTime,
            difficulty: rec.difficulty,
            urgency: rec.urgency
        });
    }
}

// 保持向后兼容，导出简化版本
export async function generateRecommendedPath(userId: Types.ObjectId) {
    const intelligentPath = await generateIntelligentPath(userId);
    return intelligentPath.map(item => ({
        pointId: item.pointId,
        priority: item.priority,
        reason: item.reason
    }));
}
