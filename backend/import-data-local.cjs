const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// MongoDB连接URI - 优先使用环境变量
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/intellibuddy';

// SubTopic Schema
const SubTopicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    order: { type: Number, required: true }
}, { _id: false });

// Resource Schema
const ResourceSchema = new mongoose.Schema({
    type: { type: String, required: true },
    title: { type: String, required: true },
    url: { type: String, required: false }
}, { _id: false });

// Graph Position Schema
const GraphPositionSchema = new mongoose.Schema({
    x: { type: Number, required: true },
    y: { type: Number, required: true }
}, { _id: false });

// 知识点Schema - 更新为新的数据模型
const knowledgePointSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    order: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    subject: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: { type: Number, required: true, min: 1, max: 5 },
    prerequisites: [{ type: String }],
    learningPath: { type: String, required: true },
    estimatedHours: { type: Number, required: true },
    contentSnippet: { type: String, required: true },
    resources: [ResourceSchema],
    tags: [{ type: String }],
    subtopics: [SubTopicSchema],
    status: { 
        type: String, 
        enum: ['not_started', 'in_progress', 'completed'], 
        default: 'not_started' 
    },
    graphPosition: GraphPositionSchema
}, { timestamps: true });

const KnowledgePoint = mongoose.model('KnowledgePoint', knowledgePointSchema);

// 定义24个知识点的ID（根据映射关系审阅文档）
const KNOWLEDGE_POINT_IDS = [
    'cs101',        // 编程导论 (C语言)
    'math101',      // 微积分 I
    'cs102-discrete', // 离散数学与计算机科学导论
    'cs100',        // 计算机导论
    'math201',      // 线性代数
    'cs103',        // 数据结构
    'cs104',        // 高级编程与代码规范
    'math102',      // 微积分 II
    'cs201',        // 计算机组成与体系结构
    'cs202',        // 面向对象编程 (C++/Java)
    'cs203',        // 软件工程基础
    'cs204',        // 算法设计与分析
    'cs205',        // 操作系统
    'cs206-pl',     // 编程语言原理
    'cs206-db',     // 数据库系统
    'cs301',        // 计算机网络
    'ai1',          // 人工智能导论
    'ai2',          // 深度学习
    'cs402',        // 分布式系统
    'sec1',         // 网络安全导论
    'cs499',        // 毕业设计
    'math203',      // 概率论与数理统计
    'phys101',      // 大学物理
    'eng101'        // 大学英语
];

async function importData() {
    try {
        console.log('🚀 开始导入知识点数据...\n');
        console.log('正在连接到 MongoDB...');
        console.log(`连接URI: ${MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}\n`);
        
        await mongoose.connect(MONGO_URI);
        console.log('✅ 成功连接到 MongoDB\n');

        console.log('正在清空旧知识点数据...');
        const deleteResult = await KnowledgePoint.deleteMany({});
        console.log(`✅ 已删除 ${deleteResult.deletedCount} 条旧数据\n`);

        console.log('正在读取新知识点数据...');
        
        // 尝试导入 TypeScript seed 数据
        let knowledgePointsData = [];
        
        // 方法1: 尝试直接require编译后的JS文件（如果存在）
        try {
            const distPath = path.join(__dirname, 'dist', 'seed-all.js');
            if (fs.existsSync(distPath)) {
                console.log('  ℹ️  使用编译后的 TypeScript 数据\n');
                // 注意：这需要先编译TypeScript
                const { seedData } = require(distPath);
                knowledgePointsData = seedData;
            }
        } catch (e) {
            // 忽略错误，尝试下一个方法
        }

        // 方法2: 使用 ts-node 动态导入（推荐）
        if (knowledgePointsData.length === 0) {
            console.log('  ℹ️  提示：推荐使用 TypeScript 导入脚本');
            console.log('  ℹ️  运行命令: npm run import 或 npm run import:local\n');
            console.log('  ℹ️  当前使用兼容模式：从 JSON 文件导入\n');
            
            // 方法3: 从 JSON 文件导入（向后兼容）
            const jsonPath = path.join(__dirname, '..', 'knowledge-points-data-new.json');
            if (fs.existsSync(jsonPath)) {
                knowledgePointsData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
            } else {
                throw new Error('找不到知识点数据文件。请运行 npm run build 或使用 TypeScript 导入脚本。');
            }
        }

        // 过滤只保留24个配置的知识点
        const filteredData = knowledgePointsData.filter(kp => 
            KNOWLEDGE_POINT_IDS.includes(kp.id)
        );

        if (filteredData.length === 0) {
            throw new Error('没有找到符合条件的知识点数据');
        }

        console.log(`正在插入 ${filteredData.length} 个知识点...`);
        const result = await KnowledgePoint.insertMany(filteredData);

        console.log(`\n${'='.repeat(60)}`);
        console.log('✅ 知识点数据导入成功！');
        console.log(`${'='.repeat(60)}`);
        console.log(`  - 共导入 ${result.length} 个知识点`);
        console.log(`  - 配置映射 24 个知识点`);
        console.log(`${'='.repeat(60)}\n`);
        
        console.log('📚 已导入的知识点列表:\n');
        result.forEach((point, index) => {
            const snippet = point.contentSnippet || '';
            console.log(`${(index + 1).toString().padStart(2, ' ')}. [${point.id.padEnd(15, ' ')}] ${point.title}`);
        });

        console.log(`\n${'='.repeat(60)}`);
        console.log('💡 下一步操作：');
        console.log('  1. 运行 npm run fill-content 填充笔记内容');
        console.log('  2. 或直接使用 npm run seed 一次性完成导入和填充');
        console.log(`${'='.repeat(60)}`);

    } catch (error) {
        console.error('\n❌ 数据库填充失败:', error.message);
        console.log('\n💡 故障排查提示:');
        console.log('1. 确保 MongoDB 已安装并运行');
        console.log('2. Windows: 打开服务，启动 MongoDB Server');
        console.log('3. 检查 .env 文件中的 MONGODB_URI 配置');
        console.log('4. 推荐使用: npm run import 或 npm run import:local');
        console.log('');
        throw error;
    } finally {
        await mongoose.connection.close();
        console.log('\n✅ 数据库连接已关闭。\n');
    }
}

// 只在直接运行时执行
if (require.main === module) {
    importData().catch(err => {
        console.error(err);
        process.exit(1);
    });
}

module.exports = { importData };


