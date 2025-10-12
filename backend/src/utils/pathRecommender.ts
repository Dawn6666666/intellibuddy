// backend/src/utils/pathRecommender.ts
import KnowledgePoint, {IKnowledgePoint} from '../models/KnowledgePoint';
import Assessment, {IAssessment} from '../models/Assessment';
import UserProgress, {IUserProgress} from '../models/UserProgress';
import {Types} from 'mongoose';

interface RecommendedPoint {
    pointId: string;
    priority: number;
    reason: string;
}

/**
 * 生成推荐学习路径
 * @param userId 用户ID
 * @returns 推荐的知识点ID数组（按优先级排序）
 */
export async function generateRecommendedPath(userId: Types.ObjectId): Promise<RecommendedPoint[]> {
    // 1. 获取用户评估结果
    const assessment = await Assessment.findOne({userId});
    if (!assessment) {
        // 如果没有评估，返回基础路径
        return await getDefaultPath();
    }

    // 2. 获取所有知识点
    const allPoints = await KnowledgePoint.find({});

    // 3. 获取用户进度
    const userProgress = await UserProgress.find({userId});
    const completedPointIds = new Set(
        userProgress.filter(p => p.status === 'completed').map(p => p.pointId)
    );

    // 4. 过滤已完成的知识点
    const uncompletedPoints = allPoints.filter(p => !completedPointIds.has(p.id));

    // 5. 为每个知识点计算推荐优先级
    const pointsWithPriority = uncompletedPoints.map(point => {
        let priority = 50; // 基础优先级
        let reason = '推荐学习';

        // 5.1 根据弱项提高优先级
        const weakness = assessment.weaknesses.find(w => w.subject === point.subject);
        if (weakness) {
            priority += 30;
            reason = `强化${point.subject}弱项`;
        }

        // 5.2 根据用户能力调整优先级（匹配难度）
        const skillLevel = assessment.skillProfile.find(s => s.subject === point.subject)?.level || 50;
        const difficultyMatch = 100 - Math.abs(skillLevel - point.difficulty * 20);
        priority += difficultyMatch * 0.2;

        // 5.3 检查前置依赖是否完成
        const prerequisitesCompleted = point.prerequisites.every(preId =>
            completedPointIds.has(preId)
        );
        if (!prerequisitesCompleted) {
            priority -= 50; // 前置依赖未完成，降低优先级
            reason = '需要先完成前置课程';
        }

        // 5.4 优先推荐基础难度的课程
        if (point.difficulty <= 2) {
            priority += 10;
        }

        return {
            pointId: point.id,
            priority,
            reason,
            prerequisites: point.prerequisites,
            difficulty: point.difficulty,
            subject: point.subject,
        };
    });

    // 6. 拓扑排序 + 优先级排序
    const sortedPath = topologicalSortWithPriority(pointsWithPriority, allPoints);

    return sortedPath;
}

/**
 * 拓扑排序 + 优先级加权
 */
function topologicalSortWithPriority(
    points: any[],
    allPoints: IKnowledgePoint[]
): RecommendedPoint[] {
    const pointMap = new Map(allPoints.map(p => [p.id, p]));
    const result: RecommendedPoint[] = [];
    const visited = new Set<string>();

    // 按优先级排序
    const sortedByPriority = [...points].sort((a, b) => b.priority - a.priority);

    for (const point of sortedByPriority) {
        if (!visited.has(point.pointId)) {
            dfs(point.pointId, pointMap, visited, result, points);
        }
    }

    return result;
}

function dfs(
    pointId: string,
    pointMap: Map<string, IKnowledgePoint>,
    visited: Set<string>,
    result: RecommendedPoint[],
    priorityPoints: any[]
) {
    visited.add(pointId);

    const point = pointMap.get(pointId);
    if (!point) return;

    // 先处理前置依赖
    for (const preId of point.prerequisites) {
        if (!visited.has(preId)) {
            dfs(preId, pointMap, visited, result, priorityPoints);
        }
    }

    // 添加当前节点
    const priorityInfo = priorityPoints.find(p => p.pointId === pointId);
    if (priorityInfo) {
        result.push({
            pointId: priorityInfo.pointId,
            priority: priorityInfo.priority,
            reason: priorityInfo.reason,
        });
    }
}

/**
 * 获取默认学习路径（未完成评估时）
 */
async function getDefaultPath(): Promise<RecommendedPoint[]> {
    const allPoints = await KnowledgePoint.find({}).sort({difficulty: 1});

    return allPoints.map((point, index) => ({
        pointId: point.id,
        priority: 100 - index,
        reason: '按基础到进阶顺序推荐',
    }));
}

/**
 * 检查知识点是否可以解锁
 */
export async function canUnlockPoint(
    userId: Types.ObjectId,
    pointId: string
): Promise<{canUnlock: boolean; missingPrerequisites: string[]}> {
    const point = await KnowledgePoint.findOne({id: pointId});
    if (!point) {
        return {canUnlock: false, missingPrerequisites: []};
    }

    if (point.prerequisites.length === 0) {
        return {canUnlock: true, missingPrerequisites: []};
    }

    const userProgress = await UserProgress.find({
        userId,
        pointId: {$in: point.prerequisites},
    });

    const completedPrerequisites = new Set(
        userProgress.filter(p => p.status === 'completed').map(p => p.pointId)
    );

    const missingPrerequisites = point.prerequisites.filter(
        preId => !completedPrerequisites.has(preId)
    );

    return {
        canUnlock: missingPrerequisites.length === 0,
        missingPrerequisites,
    };
}


