// backend/src/config/content-files-config.ts
// 知识点内容文件映射配置
import { FileConfig } from '../utils/content-loader';

export interface KnowledgePointContentConfig {
    knowledgePointId: string;
    files: FileConfig[];
}

// 所有知识点的内容文件配置
export const contentFilesConfig: KnowledgePointContentConfig[] = [
    // CS202: 面向对象编程 (C++/Java) - Java 笔记
    {
        knowledgePointId: 'cs202',
        files: [
            // JavaSE 核心内容
            {
                path: 'public/笔记/JavaSE 核心内容/JavaSE 核心内容 - JavaSE 笔记（一）走进Java语言.md',
                title: 'JavaSE 笔记（一）走进Java语言'
            },
            {
                path: 'public/笔记/JavaSE 核心内容/JavaSE 核心内容 - JavaSE 笔记（二）面向过程编程.md',
                title: 'JavaSE 笔记（二）面向过程编程'
            },
            {
                path: 'public/笔记/JavaSE 核心内容/JavaSE 核心内容 - JavaSE 笔记（三）面向对象基础.md',
                title: 'JavaSE 笔记（三）面向对象基础'
            },
            {
                path: 'public/笔记/JavaSE 核心内容/JavaSE 核心内容 - JavaSE 笔记（四）面向对象高级篇.md',
                title: 'JavaSE 笔记（四）面向对象高级篇'
            },
            {
                path: 'public/笔记/JavaSE 核心内容/JavaSE 核心内容 - JavaSE 笔记（五）泛型程序设计.md',
                title: 'JavaSE 笔记（五）泛型程序设计'
            },
            {
                path: 'public/笔记/JavaSE 核心内容/JavaSE 核心内容 - JavaSE 笔记（六）集合类与IO.md',
                title: 'JavaSE 笔记（六）集合类与IO'
            },
            {
                path: 'public/笔记/JavaSE 核心内容/JavaSE 核心内容 - JavaSE 笔记（七）多线程与反射.md',
                title: 'JavaSE 笔记（七）多线程与反射'
            },
            {
                path: 'public/笔记/JavaSE 核心内容/JavaSE 核心内容 - JavaSE 笔记（八）GUI程序开发.md',
                title: 'JavaSE 笔记（八）GUI程序开发'
            },
            // JavaWeb
            {
                path: 'public/笔记/JavaWeb/JavaWeb 旧版 - JavaWeb 笔记（一）Java网络编程.md',
                title: 'JavaWeb 笔记（一）Java网络编程'
            },
            {
                path: 'public/笔记/JavaWeb/JavaWeb 旧版 - JavaWeb 笔记（二）数据库基础.md',
                title: 'JavaWeb 笔记（二）数据库基础'
            },
            {
                path: 'public/笔记/JavaWeb/JavaWeb 旧版 - JavaWeb 笔记（三）Java与数据库.md',
                title: 'JavaWeb 笔记（三）Java与数据库'
            },
            {
                path: 'public/笔记/JavaWeb/JavaWeb 旧版 - JavaWeb 笔记（四）前端基础.md',
                title: 'JavaWeb 笔记（四）前端基础'
            },
            {
                path: 'public/笔记/JavaWeb/JavaWeb 旧版 - JavaWeb 笔记（五）后端开发.md',
                title: 'JavaWeb 笔记（五）后端开发'
            }
        ]
    },
    
    // 在这里添加更多知识点的内容文件配置
    // 例如:
    // {
    //     knowledgePointId: 'cs301',
    //     files: [
    //         {
    //             path: 'public/笔记/算法/算法笔记（一）基础.md',
    //             title: '算法笔记（一）基础'
    //         },
    //         // ...
    //     ]
    // },
];

/**
 * 根据知识点 ID 获取其内容文件配置
 */
export function getContentFilesForKnowledgePoint(knowledgePointId: string): FileConfig[] | undefined {
    const config = contentFilesConfig.find(c => c.knowledgePointId === knowledgePointId);
    return config?.files;
}

/**
 * 获取所有已配置内容文件的知识点 ID 列表
 */
export function getAllConfiguredKnowledgePointIds(): string[] {
    return contentFilesConfig.map(c => c.knowledgePointId);
}


