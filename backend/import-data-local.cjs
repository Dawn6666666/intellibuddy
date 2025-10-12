const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// MongoDB连接URI - 使用本地MongoDB
const MONGO_URI = 'mongodb://localhost:27017/intellibuddy';

// 知识点Schema（简化版）
const knowledgePointSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subject: String,
    contentSnippet: String,
    prerequisites: [String],
    difficulty: Number,
    estimatedTime: Number,
    graphPosition: {
        x: Number,
        y: Number
    },
    quiz: [{
        question: String,
        type: String,
        options: [String],
        correctAnswer: mongoose.Schema.Types.Mixed
    }]
}, { timestamps: true });

const KnowledgePoint = mongoose.model('KnowledgePoint', knowledgePointSchema);

// 读取数据
const dataPath = path.join(__dirname, '../knowledge-points-data.json');
const knowledgePointsData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

async function importData() {
    try {
        console.log('正在连接到 MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ 成功连接到 MongoDB');

        console.log('正在清空知识库...');
        await KnowledgePoint.deleteMany({});

        console.log('正在插入计算机科学课程数据...');
        const result = await KnowledgePoint.insertMany(knowledgePointsData);

        console.log(`\n✅ 计算机科学课程数据填充成功！共插入 ${result.length} 个知识点\n`);
        console.log('课程列表:');
        result.forEach((point, index) => {
            const snippet = point.contentSnippet || '';
            console.log(`${index + 1}. ${point.title} (${point.subject}) - ${snippet.substring(0, 30)}...`);
        });

    } catch (error) {
        console.error('❌ 数据库填充失败:', error.message);
        console.log('\n💡 提示:');
        console.log('1. 确保 MongoDB 已安装并运行');
        console.log('2. Windows: 打开服务，启动 MongoDB Server');
        console.log('3. 或者修改脚本中的 MONGO_URI 为你的 MongoDB Atlas 连接字符串');
    } finally {
        await mongoose.connection.close();
        console.log('\n数据库连接已关闭。');
    }
}

importData();

