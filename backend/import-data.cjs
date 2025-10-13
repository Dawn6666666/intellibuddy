const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// 从命令行参数获取MongoDB URI，或使用默认值
const MONGO_URI = process.argv[2] || 'mongodb://localhost:27017/intellibuddy';

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
        console.log('URI:', MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')); // 隐藏密码
        
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
        console.log('\n💡 使用方法:');
        console.log('node import-data.cjs "mongodb://localhost:27017/intellibuddy"');
        console.log('或者:');
        console.log('node import-data.cjs "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/intellibuddy"');
    } finally {
        await mongoose.connection.close();
        console.log('\n数据库连接已关闭。');
    }
}

importData();

