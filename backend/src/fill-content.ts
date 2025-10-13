// backend/src/fill-content.ts
// 统一的内容填充脚本 - 支持填充指定知识点或所有知识点的内容
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import KnowledgePoint from './models/KnowledgePoint';
import ContentLoader from './utils/content-loader';
import { contentFilesConfig, getContentFilesForKnowledgePoint } from './config/content-files-config';

dotenv.config();

interface FillOptions {
    knowledgePointIds?: string[];  // 如果不指定，则填充所有已配置的知识点
    clearExisting?: boolean;        // 是否清除现有内容
}

async function fillContent(options: FillOptions = {}) {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
        console.error("错误: MONGO_URI 或 MONGODB_URI 未在 .env 文件中定义");
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUri);
        console.log("数据库连接成功\n");

        const loader = new ContentLoader();
        const knowledgePointIds = options.knowledgePointIds || 
            contentFilesConfig.map(c => c.knowledgePointId);

        let totalSuccess = 0;
        let totalFail = 0;
        let processedCount = 0;

        console.log(`📚 准备填充 ${knowledgePointIds.length} 个知识点的内容\n`);

        for (const kpId of knowledgePointIds) {
            console.log(`\n${'='.repeat(60)}`);
            console.log(`处理知识点: ${kpId}`);
            console.log('='.repeat(60));

            // 查找知识点
            const kp = await KnowledgePoint.findOne({ id: kpId });
            if (!kp) {
                console.error(`❌ 未找到知识点: ${kpId}`);
                totalFail++;
                continue;
            }

            console.log(`✓ 找到知识点: ${kp.title}`);

            // 获取该知识点的文件配置
            const fileConfigs = getContentFilesForKnowledgePoint(kpId);
            if (!fileConfigs || fileConfigs.length === 0) {
                console.warn(`⚠️  知识点 ${kpId} 没有配置内容文件`);
                continue;
            }

            // 如果需要清除现有内容
            if (options.clearExisting) {
                kp.contentFiles = [];
                console.log(`🗑️  已清除现有内容`);
            }

            // 加载文件
            console.log(`\n📂 开始加载 ${fileConfigs.length} 个文件...`);
            const { contentFiles, successCount, failCount } = await loader.loadFiles(fileConfigs);

            // 更新知识点
            if (contentFiles.length > 0) {
                kp.contentFiles = contentFiles;
                await kp.save();

                const totalChars = contentFiles.reduce((sum, file) => sum + file.content.length, 0);
                console.log(`\n✨ 成功将 ${successCount} 个文件添加到知识点 ${kpId}！`);
                console.log(`📝 总内容长度: ${totalChars.toLocaleString()} 字符`);
                
                totalSuccess += successCount;
                totalFail += failCount;
                processedCount++;
            } else {
                console.log(`\n⚠️  没有成功加载任何文件`);
                totalFail += failCount;
            }

            console.log(`\n📊 本知识点统计：`);
            console.log(`  - 成功: ${successCount} 个`);
            console.log(`  - 失败: ${failCount} 个`);
            console.log(`  - 总计: ${fileConfigs.length} 个`);
        }

        // 总结
        console.log(`\n\n${'='.repeat(60)}`);
        console.log('📊 总体统计');
        console.log('='.repeat(60));
        console.log(`  - 已处理知识点: ${processedCount} 个`);
        console.log(`  - 文件加载成功: ${totalSuccess} 个`);
        console.log(`  - 文件加载失败: ${totalFail} 个`);
        console.log(`  - 总文件数: ${totalSuccess + totalFail} 个`);
        console.log('='.repeat(60));
        console.log('\n✅ 内容填充完成！');

    } catch (error) {
        console.error("操作失败:", error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log("\n数据库连接已关闭。");
    }
}

// 命令行参数处理
const args = process.argv.slice(2);
const options: FillOptions = {
    clearExisting: args.includes('--clear')
};

// 如果指定了知识点 ID
const kpIdArgs = args.filter(arg => !arg.startsWith('--'));
if (kpIdArgs.length > 0) {
    options.knowledgePointIds = kpIdArgs;
}

if (require.main === module) {
    fillContent(options);
}

export { fillContent };


