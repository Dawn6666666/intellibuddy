// backend/src/seed-cs-curriculum.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import KnowledgePoint from './models/KnowledgePoint';
import type { IKnowledgePoint } from './models/KnowledgePoint';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

// 读取生成的知识点数据
const dataPath = path.join(__dirname, '../../knowledge-points-data.json');
const knowledgePointsData: Partial<IKnowledgePoint>[] = JSON.parse(
    fs.readFileSync(dataPath, 'utf-8')
);

const seedCSCurriculum = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.error("错误: MONGO_URI 未在 .env 文件中定义");
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUri);

        console.log("正在清空知识库，准备载入计算机科学课程体系...");
        await KnowledgePoint.deleteMany({});

        console.log("正在插入计算机科学课程数据...");
        const result = await KnowledgePoint.insertMany(knowledgePointsData);

        console.log(`✅ 计算机科学课程数据填充成功！共插入 ${result.length} 个知识点`);
        console.log("\n课程列表:");
        result.forEach((point, index) => {
            const snippet = point.contentSnippet || '';
            console.log(`${index + 1}. ${point.title} (${point.subject}) - ${snippet.substring(0, 30)}...`);
        });
    } catch (error) {
        console.error("❌ 数据库填充失败:", error);
    } finally {
        await mongoose.connection.close();
        console.log("\n数据库连接已关闭。");
    }
};

seedCSCurriculum();

