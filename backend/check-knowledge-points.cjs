// backend/check-knowledge-points.cjs
// 检查数据库中的所有知识点

const mongoose = require('mongoose');
require('dotenv').config();

const KnowledgePointSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subject: { type: String, required: true },
    contentSnippet: { type: String, required: true },
    status: {
        type: String,
        enum: ['not_started', 'in_progress', 'completed'],
        default: 'not_started'
    },
    prerequisites: [{ type: String }],
    difficulty: { type: Number, min: 1, max: 5 },
    estimatedTime: { type: Number },
    contentFiles: [{
        path: String,
        title: String,
        content: String
    }],
    quiz: [{
        question: String,
        type: { type: String, enum: ['single', 'multiple', 'truefalse'] },
        options: [String],
        correctAnswer: mongoose.Schema.Types.Mixed,
        explanation: String
    }],
    graphPosition: {
        x: { type: Number, required: true },
        y: { type: Number, required: true }
    }
}, { timestamps: true });

const KnowledgePoint = mongoose.model('KnowledgePoint', KnowledgePointSchema);

async function checkKnowledgePoints() {
    try {
        console.log('连接到 MongoDB...');
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/intellibuddy';
        await mongoose.connect(mongoUri);
        console.log('✅ 已连接到 MongoDB\n');

        // 获取所有知识点
        const knowledgePoints = await KnowledgePoint.find({}).sort({ id: 1 });
        
        console.log(`📊 数据库中共有 ${knowledgePoints.length} 个知识点：\n`);
        console.log('序号 | ID | 标题 | 学期/主题 | 笔记数');
        console.log('-'.repeat(80));
        
        knowledgePoints.forEach((kp, index) => {
            const fileCount = kp.contentFiles ? kp.contentFiles.length : 0;
            const subject = kp.subject || '未分类';
            console.log(`${(index + 1).toString().padStart(2)}   | ${kp.id.padEnd(20)} | ${kp.title.padEnd(25)} | ${subject.padEnd(15)} | ${fileCount}`);
        });
        
        console.log('\n' + '='.repeat(80));
        console.log(`\n总计：${knowledgePoints.length} 个知识点`);
        
        // 统计有内容文件的知识点
        const withContent = knowledgePoints.filter(kp => kp.contentFiles && kp.contentFiles.length > 0);
        console.log(`有笔记内容的知识点：${withContent.length} 个`);
        
        const totalFiles = knowledgePoints.reduce((sum, kp) => {
            return sum + (kp.contentFiles ? kp.contentFiles.length : 0);
        }, 0);
        console.log(`笔记文件总数：${totalFiles} 个\n`);
        
    } catch (error) {
        console.error('❌ 发生错误:', error);
    } finally {
        await mongoose.connection.close();
        console.log('✅ 已断开数据库连接');
        process.exit(0);
    }
}

checkKnowledgePoints();

