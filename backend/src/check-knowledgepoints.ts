// backend/src/check-knowledgepoints.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import KnowledgePoint from './models/KnowledgePoint';

dotenv.config();

const checkKnowledgePoints = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.error("错误: MONGO_URI 未在 .env 文件中定义");
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUri);
        console.log("数据库连接成功\n");

        const points = await KnowledgePoint.find({}, 'id title subject').sort({ id: 1 });
        
        console.log(`数据库中共有 ${points.length} 个知识点：\n`);
        
        for (const point of points) {
            console.log(`  - ${point.id}: ${point.title} (${point.subject})`);
        }

    } catch (error) {
        console.error("数据库操作失败:", error);
    } finally {
        await mongoose.connection.close();
        console.log("\n数据库连接已关闭。");
    }
};

checkKnowledgePoints();

