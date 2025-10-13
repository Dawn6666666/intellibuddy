// backend/src/utils/content-loader.ts
// 通用的内容加载工具函数
import fs from 'fs';
import path from 'path';

export interface ContentFile {
    title: string;
    content: string;
}

export interface FileConfig {
    path: string;
    title: string;
}

export class ContentLoader {
    private projectRoot: string;

    constructor() {
        this.projectRoot = path.resolve(__dirname, '../../..');
    }

    /**
     * 加载单个文件
     */
    async loadFile(fileConfig: FileConfig): Promise<ContentFile | null> {
        try {
            const filePath = path.join(this.projectRoot, fileConfig.path);
            
            if (!fs.existsSync(filePath)) {
                console.warn(`⚠️  文件不存在: ${fileConfig.path}`);
                return null;
            }

            const content = fs.readFileSync(filePath, 'utf-8');
            
            return {
                title: fileConfig.title,
                content: content
            };
        } catch (error) {
            console.error(`❌ 读取文件失败 ${fileConfig.path}:`, error);
            return null;
        }
    }

    /**
     * 批量加载文件
     */
    async loadFiles(fileConfigs: FileConfig[]): Promise<{
        contentFiles: ContentFile[];
        successCount: number;
        failCount: number;
    }> {
        const contentFiles: ContentFile[] = [];
        let successCount = 0;
        let failCount = 0;

        for (const fileConfig of fileConfigs) {
            const result = await this.loadFile(fileConfig);
            
            if (result) {
                contentFiles.push(result);
                console.log(`✅ 已读取: ${fileConfig.title}`);
                successCount++;
            } else {
                failCount++;
            }
        }

        return { contentFiles, successCount, failCount };
    }

    /**
     * 合并多个文件内容为单个字符串（向后兼容旧的 content 字段）
     */
    async loadAndMergeFiles(fileConfigs: FileConfig[]): Promise<string> {
        let combinedContent = '';

        for (const fileConfig of fileConfigs) {
            const result = await this.loadFile(fileConfig);
            
            if (result) {
                combinedContent += `\n\n---\n\n# ${result.title}\n\n${result.content}`;
            }
        }

        return combinedContent.trim();
    }
}

export default ContentLoader;


