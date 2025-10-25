// backend/src/services/aiDiagnosticService.ts
// AI学习诊断与主动干预服务
import UserProgress from '../models/UserProgress';
import StudySession from '../models/StudySession';
import WrongQuestion from '../models/WrongQuestion';
import KnowledgePoint from '../models/KnowledgePoint';
import {Types} from 'mongoose';

export interface DiagnosticReport {
    userId: string;
    generatedAt: Date;
    overallStatus: 'excellent' | 'good' | 'normal' | 'warning' | 'critical';
    issues: DiagnosticIssue[];
    recommendations: Recommendation[];
    motivationalMessage: string;
}

export interface DiagnosticIssue {
    type: 'learning_stagnation' | 'repeated_failures' | 'time_anomaly' | 'knowledge_gap' | 'low_engagement';
    severity: 'low' | 'medium' | 'high';
    title: string;
    description: string;
    affectedPoints?: string[];
}

export interface Recommendation {
    priority: 'high' | 'medium' | 'low';
    action: string;
    reason: string;
    relatedPointIds?: string[];
}

/**
 * 生成用户学习诊断报告
 */
export async function generateDiagnosticReport(userId: Types.ObjectId): Promise<DiagnosticReport> {
    // 获取用户所有学习数据
    const [userProgress, studySessions, wrongQuestions] = await Promise.all([
        UserProgress.find({userId}).lean(),
        StudySession.find({userId}).sort({startTime: -1}).limit(100).lean(),
        WrongQuestion.find({userId}).lean()
    ]);

    const issues: DiagnosticIssue[] = [];
    const recommendations: Recommendation[] = [];

    // 1. 检测学习停滞
    const stagnationIssue = detectLearningStagnation(studySessions);
    if (stagnationIssue) {
        issues.push(stagnationIssue);
        recommendations.push({
            priority: 'high',
            action: '重新开始学习，选择一门简单的课程恢复状态',
            reason: '长时间未学习会导致知识遗忘，建议尽快恢复学习节奏'
        });
    }

    // 2. 检测反复失败的知识点
    const failureIssues = await detectRepeatedFailures(userProgress, wrongQuestions);
    if (failureIssues.length > 0) {
        issues.push(...failureIssues);
        
        for (const issue of failureIssues) {
            if (issue.affectedPoints && issue.affectedPoints.length > 0) {
                const pointTitles = await getPointTitles(issue.affectedPoints);
                recommendations.push({
                    priority: 'high',
                    action: `重点复习：${pointTitles.join('、')}`,
                    reason: '这些知识点的错题率较高，建议先回顾前置知识再重新学习',
                    relatedPointIds: issue.affectedPoints
                });
            }
        }
    }

    // 3. 检测知识缺口
    const gapIssues = await detectKnowledgeGaps(userProgress);
    if (gapIssues.length > 0) {
        issues.push(...gapIssues);
        recommendations.push({
            priority: 'medium',
            action: '按推荐路径学习，确保前置知识扎实',
            reason: '发现部分进阶课程学习困难，可能是基础知识未掌握牢固'
        });
    }

    // 4. 检测学习时间异常
    const timeIssue = detectTimeAnomaly(studySessions);
    if (timeIssue) {
        issues.push(timeIssue);
        recommendations.push({
            priority: 'medium',
            action: '调整学习计划，建议每天学习30-60分钟，保持规律',
            reason: '学习时间不规律或单次学习时间过长/过短，影响学习效果'
        });
    }

    // 5. 检测低参与度
    const engagementIssue = detectLowEngagement(userProgress, studySessions);
    if (engagementIssue) {
        issues.push(engagementIssue);
        recommendations.push({
            priority: 'low',
            action: '尝试挑战新的学科或参与测验，提升学习兴趣',
            reason: '学习活跃度较低，可能对当前课程缺乏兴趣'
        });
    }

    // 6. 确定整体状态
    const overallStatus = determineOverallStatus(issues);

    // 7. 生成激励消息
    const motivationalMessage = generateMotivationalMessage(overallStatus, userProgress);

    return {
        userId: userId.toString(),
        generatedAt: new Date(),
        overallStatus,
        issues,
        recommendations,
        motivationalMessage
    };
}

/**
 * 检测学习停滞
 */
function detectLearningStagnation(studySessions: any[]): DiagnosticIssue | null {
    if (studySessions.length === 0) {
        return {
            type: 'learning_stagnation',
            severity: 'high',
            title: '尚未开始学习',
            description: '您还没有开始学习任何课程，快来开启您的学习之旅吧！'
        };
    }

    const lastSession = studySessions[0];
    const daysSinceLastStudy = Math.floor(
        (Date.now() - new Date(lastSession.startTime).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastStudy > 14) {
        return {
            type: 'learning_stagnation',
            severity: 'high',
            title: '学习已停滞超过2周',
            description: `您已经${daysSinceLastStudy}天没有学习了，长时间不学习会导致知识遗忘。`
        };
    } else if (daysSinceLastStudy > 7) {
        return {
            type: 'learning_stagnation',
            severity: 'medium',
            title: '学习已停滞1周',
            description: `您已经${daysSinceLastStudy}天没有学习了，建议尽快恢复学习。`
        };
    } else if (daysSinceLastStudy > 3) {
        return {
            type: 'learning_stagnation',
            severity: 'low',
            title: '学习间隔较长',
            description: `您已经${daysSinceLastStudy}天没有学习了，记得保持学习连续性哦。`
        };
    }

    return null;
}

/**
 * 检测反复失败的知识点
 */
async function detectRepeatedFailures(
    userProgress: any[],
    wrongQuestions: any[]
): Promise<DiagnosticIssue[]> {
    const issues: DiagnosticIssue[] = [];

    // 按知识点统计错题数
    const errorsByPoint = new Map<string, number>();
    wrongQuestions.forEach(wq => {
        if (!wq.mastered) {
            const count = errorsByPoint.get(wq.pointId) || 0;
            errorsByPoint.set(wq.pointId, count + 1);
        }
    });

    // 找出错题最多的知识点
    const highErrorPoints: string[] = [];
    errorsByPoint.forEach((count, pointId) => {
        if (count >= 3) {
            highErrorPoints.push(pointId);
        }
    });

    if (highErrorPoints.length > 0) {
        issues.push({
            type: 'repeated_failures',
            severity: 'high',
            title: '部分知识点掌握不牢',
            description: `发现${highErrorPoints.length}个知识点的错题数量较多，建议重点复习。`,
            affectedPoints: highErrorPoints
        });
    }

    // 检测低分数的知识点
    const lowScorePoints = userProgress
        .filter(p => p.score !== undefined && p.score < 60)
        .map(p => p.pointId);

    if (lowScorePoints.length > 0) {
        issues.push({
            type: 'repeated_failures',
            severity: 'medium',
            title: '部分课程测验分数较低',
            description: `有${lowScorePoints.length}门课程的测验分数低于60分，建议重新学习。`,
            affectedPoints: lowScorePoints
        });
    }

    return issues;
}

/**
 * 检测知识缺口
 */
async function detectKnowledgeGaps(userProgress: any[]): Promise<DiagnosticIssue[]> {
    const issues: DiagnosticIssue[] = [];

    // 获取所有知识点
    const allPoints = await KnowledgePoint.find({}).select('id prerequisites').lean();
    const completedPoints = new Set(
        userProgress.filter(p => p.status === 'completed').map(p => p.pointId)
    );

    // 检测跳过的前置课程
    const skippedPrerequisites: string[] = [];
    userProgress.forEach(progress => {
        if (progress.status === 'in_progress' || progress.status === 'completed') {
            const point = allPoints.find(p => p.id === progress.pointId);
            if (point && point.prerequisites.length > 0) {
                point.prerequisites.forEach(preId => {
                    if (!completedPoints.has(preId) && !skippedPrerequisites.includes(preId)) {
                        skippedPrerequisites.push(preId);
                    }
                });
            }
        }
    });

    if (skippedPrerequisites.length > 0) {
        issues.push({
            type: 'knowledge_gap',
            severity: 'medium',
            title: '存在知识缺口',
            description: `发现${skippedPrerequisites.length}门前置课程未完成，可能影响后续学习效果。`,
            affectedPoints: skippedPrerequisites
        });
    }

    return issues;
}

/**
 * 检测学习时间异常
 */
function detectTimeAnomaly(studySessions: any[]): DiagnosticIssue | null {
    if (studySessions.length < 5) {
        return null; // 数据太少，无法判断
    }

    const recentSessions = studySessions.slice(0, 20);
    const durations = recentSessions.map(s => s.duration || 0);
    const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;

    // 检测单次学习时间过短（小于5分钟）
    const shortSessions = durations.filter(d => d < 300).length;
    if (shortSessions / durations.length > 0.5) {
        return {
            type: 'time_anomaly',
            severity: 'medium',
            title: '单次学习时间过短',
            description: '超过一半的学习时长不足5分钟，可能学习效果不佳。'
        };
    }

    // 检测单次学习时间过长（超过2小时）
    const longSessions = durations.filter(d => d > 7200).length;
    if (longSessions / durations.length > 0.3) {
        return {
            type: 'time_anomaly',
            severity: 'low',
            title: '单次学习时间过长',
            description: '部分学习时长超过2小时，建议适当休息，避免疲劳。'
        };
    }

    return null;
}

/**
 * 检测低参与度
 */
function detectLowEngagement(userProgress: any[], studySessions: any[]): DiagnosticIssue | null {
    const totalCompleted = userProgress.filter(p => p.status === 'completed').length;
    const totalInProgress = userProgress.filter(p => p.status === 'in_progress').length;
    const recentSessionCount = studySessions.slice(0, 7).length;

    // 最近7天的学习次数少于2次
    if (recentSessionCount < 2 && totalCompleted > 0) {
        return {
            type: 'low_engagement',
            severity: 'low',
            title: '学习频率偏低',
            description: '最近一周学习次数较少，建议增加学习频率以保持连续性。'
        };
    }

    // 有很多进行中的课程但完成很少
    if (totalInProgress > 5 && totalCompleted < totalInProgress / 2) {
        return {
            type: 'low_engagement',
            severity: 'medium',
            title: '课程完成率较低',
            description: `有${totalInProgress}门课程正在学习，但完成的较少。建议集中精力完成几门课程。`
        };
    }

    return null;
}

/**
 * 确定整体状态
 */
function determineOverallStatus(issues: DiagnosticIssue[]): DiagnosticReport['overallStatus'] {
    if (issues.length === 0) {
        return 'excellent';
    }

    const highSeverityCount = issues.filter(i => i.severity === 'high').length;
    const mediumSeverityCount = issues.filter(i => i.severity === 'medium').length;

    if (highSeverityCount >= 2) {
        return 'critical';
    } else if (highSeverityCount === 1) {
        return 'warning';
    } else if (mediumSeverityCount >= 2) {
        return 'normal';
    } else {
        return 'good';
    }
}

/**
 * 生成激励消息
 */
function generateMotivationalMessage(
    status: DiagnosticReport['overallStatus'],
    userProgress: any[]
): string {
    const completedCount = userProgress.filter(p => p.status === 'completed').length;

    const messages = {
        excellent: [
            '太棒了！您的学习状态非常好，继续保持这种节奏！💪',
            '学习状态极佳！您正在稳步前进，加油！🎉',
            '完美的学习状态！您是学习的榜样！🌟'
        ],
        good: [
            '学习状态不错！稍作调整会更好。😊',
            '您做得很好！注意一下提示的小问题就更完美了。👍',
            `已完成${completedCount}个知识点，继续加油！💪`
        ],
        normal: [
            '学习状态正常，但还有提升空间。看看诊断建议吧！📊',
            '您的学习进度正常，注意解决发现的问题。✨',
            '保持学习状态，按建议调整会更好！🎯'
        ],
        warning: [
            '学习状态需要关注！请查看诊断建议及时调整。⚠️',
            '发现一些需要注意的问题，建议尽快处理。💡',
            '学习遇到了一些挑战，别担心，我们帮您分析了原因！🔍'
        ],
        critical: [
            '学习状态需要立即调整！请重视诊断建议。🚨',
            '发现多个严重问题，请尽快按建议调整学习计划。⚡',
            '别灰心！问题虽然多，但都有解决方案。让我们一起改进！💪'
        ]
    };

    const messageList = messages[status];
    return messageList[Math.floor(Math.random() * messageList.length)];
}

/**
 * 获取知识点标题
 */
async function getPointTitles(pointIds: string[]): Promise<string[]> {
    const points = await KnowledgePoint.find({id: {$in: pointIds}})
        .select('title')
        .lean();
    return points.map(p => p.title);
}
