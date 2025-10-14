// backend/src/config/content-files-config.ts
// 知识点内容文件映射配置
import { FileConfig } from '../utils/content-loader';

export interface KnowledgePointContentConfig {
    knowledgePointId: string;
    files: FileConfig[];
}

// 所有知识点的内容文件配置
export const contentFilesConfig: KnowledgePointContentConfig[] = [
    // cs101: 编程导论 (C语言)
    {
        knowledgePointId: 'cs101',
        files: [
            {
                path: 'public/笔记/C语言编程导论/C语言编程导论 - C语言笔记(一)走进C语言.md',
                title: 'C语言笔记(一)走进C语言'
            },
            {
                path: 'public/笔记/C语言编程导论/C语言编程导论 - C语言笔记(二)基本语法.md',
                title: 'C语言笔记(二)基本语法'
            },
            {
                path: 'public/笔记/C语言编程导论/C语言编程导论 - C语言笔记(三)控制结构.md',
                title: 'C语言笔记(三)控制结构'
            },
            {
                path: 'public/笔记/C语言编程导论/C语言编程导论 - C语言笔记(四)函数与模块化.md',
                title: 'C语言笔记(四)函数与模块化'
            },
            {
                path: 'public/笔记/C语言编程导论/C语言编程导论 - C语言笔记(五)指针核心.md',
                title: 'C语言笔记(五)指针核心'
            },
            {
                path: 'public/笔记/C语言编程导论/C语言编程导论 - C语言笔记(六)数组与字符串.md',
                title: 'C语言笔记(六)数组与字符串'
            },
            {
                path: 'public/笔记/C语言编程导论/C语言编程导论 - C语言笔记(七)结构体与自定义类型.md',
                title: 'C语言笔记(七)结构体与自定义类型'
            },
            {
                path: 'public/笔记/C语言编程导论/C语言编程导论 - C语言笔记(八)动态内存管理.md',
                title: 'C语言笔记(八)动态内存管理'
            },
            {
                path: 'public/笔记/C语言编程导论/C语言编程导论 - C语言笔记(九)文件操作.md',
                title: 'C语言笔记(九)文件操作'
            },
            {
                path: 'public/笔记/C语言编程导论/C语言编程导论 - C语言笔记(十)预处理器.md',
                title: 'C语言笔记(十)预处理器'
            },
            {
                path: 'public/笔记/C语言编程导论/C语言编程导论 - C语言笔记(十一)调试与最佳实践.md',
                title: 'C语言笔记(十一)调试与最佳实践'
            }
        ]
    },

    // cs102-discrete: 离散数学与计算机科学导论
    {
        knowledgePointId: 'cs102-discrete',
        files: [
            {
                path: 'public/笔记/离散数学/离散数学 - (一)数理逻辑.md',
                title: '离散数学 - (一)数理逻辑'
            },
            {
                path: 'public/笔记/离散数学/离散数学 - (二)集合论.md',
                title: '离散数学 - (二)集合论'
            },
            {
                path: 'public/笔记/离散数学/离散数学 - (三)关系与函数.md',
                title: '离散数学 - (三)关系与函数'
            },
            {
                path: 'public/笔记/离散数学/离散数学 - (四)组合数学.md',
                title: '离散数学 - (四)组合数学'
            },
            {
                path: 'public/笔记/离散数学/离散数学 - (五)图论.md',
                title: '离散数学 - (五)图论'
            },
            {
                path: 'public/笔记/离散数学/离散数学 - (六)递归与递推.md',
                title: '离散数学 - (六)递归与递推'
            },
            {
                path: 'public/笔记/离散数学/离散数学 - (七)数论基础.md',
                title: '离散数学 - (七)数论基础'
            },
            {
                path: 'public/笔记/离散数学/离散数学 - (八)代数系统(进阶).md',
                title: '离散数学 - (八)代数系统(进阶)'
            },
            {
                path: 'public/笔记/离散数学/离散数学 - (九)实战项目.md',
                title: '离散数学 - (九)实战项目'
            }
        ]
    },

    // math101: 微积分 I (高等数学A上)
    {
        knowledgePointId: 'math101',
        files: [
            {
                path: 'public/笔记/高等数学A(上)/高等数学A(上) - (一)函数与极限.md',
                title: '高等数学A(上) - (一)函数与极限'
            },
            {
                path: 'public/笔记/高等数学A(上)/高等数学A(上) - (二)导数与微分.md',
                title: '高等数学A(上) - (二)导数与微分'
            },
            {
                path: 'public/笔记/高等数学A(上)/高等数学A(上) - (三)微分中值定理.md',
                title: '高等数学A(上) - (三)微分中值定理'
            },
            {
                path: 'public/笔记/高等数学A(上)/高等数学A(上) - (四)导数的应用.md',
                title: '高等数学A(上) - (四)导数的应用'
            },
            {
                path: 'public/笔记/高等数学A(上)/高等数学A(上) - (五)不定积分.md',
                title: '高等数学A(上) - (五)不定积分'
            },
            {
                path: 'public/笔记/高等数学A(上)/高等数学A(上) - (六)定积分.md',
                title: '高等数学A(上) - (六)定积分'
            },
            {
                path: 'public/笔记/高等数学A(上)/高等数学A(上) - (七)典型题型归纳.md',
                title: '高等数学A(上) - (七)典型题型归纳'
            },
            {
                path: 'public/笔记/高等数学A(上)/高等数学A(上) - (八)微积分应用专题.md',
                title: '高等数学A(上) - (八)微积分应用专题'
            },
            {
                path: 'public/笔记/高等数学A(上)/高等数学A(上) - (九)综合应用题.md',
                title: '高等数学A(上) - (九)综合应用题'
            },
            {
                path: 'public/笔记/高等数学A(上)/高等数学A(上) - (十)常见错误与易错点.md',
                title: '高等数学A(上) - (十)常见错误与易错点'
            },
            {
                path: 'public/笔记/高等数学A(上)/高等数学A(上) - (十一)考前冲刺要点.md',
                title: '高等数学A(上) - (十一)考前冲刺要点'
            }
        ]
    },

    // cs202: 面向对象编程 (C++/Java)
    {
        knowledgePointId: 'cs202',
        files: [
            // C++ 面向对象编程 (9个文件)
            {
                path: 'public/笔记/C++面向对象编程/C++面向对象编程 - (一)C++基础与C的区别.md',
                title: 'C++面向对象编程 - (一)C++基础与C的区别'
            },
            {
                path: 'public/笔记/C++面向对象编程/C++面向对象编程 - (二)类与对象.md',
                title: 'C++面向对象编程 - (二)类与对象'
            },
            {
                path: 'public/笔记/C++面向对象编程/C++面向对象编程 - (三)内存管理.md',
                title: 'C++面向对象编程 - (三)内存管理'
            },
            {
                path: 'public/笔记/C++面向对象编程/C++面向对象编程 - (四)继承与多态.md',
                title: 'C++面向对象编程 - (四)继承与多态'
            },
            {
                path: 'public/笔记/C++面向对象编程/C++面向对象编程 - (五)运算符重载.md',
                title: 'C++面向对象编程 - (五)运算符重载'
            },
            {
                path: 'public/笔记/C++面向对象编程/C++面向对象编程 - (六)模板编程.md',
                title: 'C++面向对象编程 - (六)模板编程'
            },
            {
                path: 'public/笔记/C++面向对象编程/C++面向对象编程 - (七)现代C++特性.md',
                title: 'C++面向对象编程 - (七)现代C++特性'
            },
            {
                path: 'public/笔记/C++面向对象编程/C++面向对象编程 - (八)STL标准库.md',
                title: 'C++面向对象编程 - (八)STL标准库'
            },
            {
                path: 'public/笔记/C++面向对象编程/C++面向对象编程 - (九)实战项目.md',
                title: 'C++面向对象编程 - (九)实战项目'
            },
            
            // JavaSE 核心内容 (8个文件)
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
            
            // JavaWeb (5个文件)
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
    
    // math201: 线性代数
    {
        knowledgePointId: 'math201',
        files: [
            {
                path: 'public/笔记/线性代数/线性代数 - (一)行列式.md',
                title: '线性代数 - (一)行列式'
            },
            {
                path: 'public/笔记/线性代数/线性代数 - (二)矩阵.md',
                title: '线性代数 - (二)矩阵'
            },
            {
                path: 'public/笔记/线性代数/线性代数 - (三)线性方程组.md',
                title: '线性代数 - (三)线性方程组'
            },
            {
                path: 'public/笔记/线性代数/线性代数 - (四)向量空间.md',
                title: '线性代数 - (四)向量空间'
            },
            {
                path: 'public/笔记/线性代数/线性代数 - (五)特征值与特征向量.md',
                title: '线性代数 - (五)特征值与特征向量'
            },
            {
                path: 'public/笔记/线性代数/线性代数 - (六)内积空间与正交.md',
                title: '线性代数 - (六)内积空间与正交'
            },
            {
                path: 'public/笔记/线性代数/线性代数 - (七)应用案例.md',
                title: '线性代数 - (七)应用案例'
            },
            {
                path: 'public/笔记/线性代数/线性代数 - (八)二次型.md',
                title: '线性代数 - (八)二次型'
            },
            {
                path: 'public/笔记/线性代数/线性代数 - (九)线性变换.md',
                title: '线性代数 - (九)线性变换'
            },
            {
                path: 'public/笔记/线性代数/线性代数 - (十)实战项目.md',
                title: '线性代数 - (十)实战项目'
            }
        ]
    },

    // cs103: 数据结构
    {
        knowledgePointId: 'cs103',
        files: [
            {
                path: 'public/笔记/数据结构与算法/数据结构与算法 - (一)算法分析基础.md',
                title: '数据结构与算法 - (一)算法分析基础'
            },
            {
                path: 'public/笔记/数据结构与算法/数据结构与算法 - (二)线性结构.md',
                title: '数据结构与算法 - (二)线性结构'
            },
            {
                path: 'public/笔记/数据结构与算法/数据结构与算法 - (三)树形结构.md',
                title: '数据结构与算法 - (三)树形结构'
            },
            {
                path: 'public/笔记/数据结构与算法/数据结构与算法 - (四)图论算法.md',
                title: '数据结构与算法 - (四)图论算法'
            },
            {
                path: 'public/笔记/数据结构与算法/数据结构与算法 - (五)排序算法.md',
                title: '数据结构与算法 - (五)排序算法'
            },
            {
                path: 'public/笔记/数据结构与算法/数据结构与算法 - (六)动态规划.md',
                title: '数据结构与算法 - (六)动态规划'
            },
            {
                path: 'public/笔记/数据结构与算法/数据结构与算法 - (七)字符串算法.md',
                title: '数据结构与算法 - (七)字符串算法'
            },
            {
                path: 'public/笔记/数据结构与算法/数据结构与算法 - (八)LeetCode经典题解.md',
                title: '数据结构与算法 - (八)LeetCode经典题解'
            },
            {
                path: 'public/笔记/数据结构与算法/数据结构与算法 - (九)高级数据结构与算法设计.md',
                title: '数据结构与算法 - (九)高级数据结构与算法设计'
            }
        ]
    },

    // cs201: 计算机组成与体系结构
    {
        knowledgePointId: 'cs201',
        files: [
            {
                path: 'public/笔记/计算机组成原理/计算机组成原理 - (一)数制与编码.md',
                title: '计算机组成原理 - (一)数制与编码'
            },
            {
                path: 'public/笔记/计算机组成原理/计算机组成原理 - (二)运算器设计.md',
                title: '计算机组成原理 - (二)运算器设计'
            },
            {
                path: 'public/笔记/计算机组成原理/计算机组成原理 - (三)存储器层次结构.md',
                title: '计算机组成原理 - (三)存储器层次结构'
            },
            {
                path: 'public/笔记/计算机组成原理/计算机组成原理 - (四)指令系统.md',
                title: '计算机组成原理 - (四)指令系统'
            },
            {
                path: 'public/笔记/计算机组成原理/计算机组成原理 - (五)CPU控制器.md',
                title: '计算机组成原理 - (五)CPU控制器'
            },
            {
                path: 'public/笔记/计算机组成原理/计算机组成原理 - (六)总线与IO.md',
                title: '计算机组成原理 - (六)总线与IO'
            },
            {
                path: 'public/笔记/计算机组成原理/计算机组成原理 - (七)汇编语言编程.md',
                title: '计算机组成原理 - (七)汇编语言编程'
            },
            {
                path: 'public/笔记/计算机组成原理/计算机组成原理 - (八)实验指导.md',
                title: '计算机组成原理 - (八)实验指导'
            },
            {
                path: 'public/笔记/计算机组成原理/计算机组成原理 - (九)面试高频问题.md',
                title: '计算机组成原理 - (九)面试高频问题'
            }
        ]
    },

    // cs203: 软件工程基础
    {
        knowledgePointId: 'cs203',
        files: [
            {
                path: 'public/笔记/软件工程/软件工程 - (一)开发模型.md',
                title: '软件工程 - (一)开发模型'
            },
            {
                path: 'public/笔记/软件工程/软件工程 - (二)UML设计.md',
                title: '软件工程 - (二)UML设计'
            },
            {
                path: 'public/笔记/软件工程/软件工程 - (三)设计模式.md',
                title: '软件工程 - (三)设计模式'
            },
            {
                path: 'public/笔记/软件工程/软件工程 - (四)测试.md',
                title: '软件工程 - (四)测试'
            },
            {
                path: 'public/笔记/软件工程/软件工程 - (五)版本控制(Git).md',
                title: '软件工程 - (五)版本控制(Git)'
            },
            {
                path: 'public/笔记/软件工程/软件工程 - (六)CI-CD.md',
                title: '软件工程 - (六)CI-CD'
            },
            {
                path: 'public/笔记/软件工程/软件工程 - (七)23种设计模式详解.md',
                title: '软件工程 - (七)23种设计模式详解'
            },
            {
                path: 'public/笔记/软件工程/软件工程 - (八)敏捷开发实践.md',
                title: '软件工程 - (八)敏捷开发实践'
            },
            {
                path: 'public/笔记/软件工程/软件工程 - (九)项目管理.md',
                title: '软件工程 - (九)项目管理'
            },
            {
                path: 'public/笔记/软件工程/软件工程 - (十)代码质量管理.md',
                title: '软件工程 - (十)代码质量管理'
            }
        ]
    },

    // cs204: 算法设计与分析
    {
        knowledgePointId: 'cs204',
        files: [
            {
                path: 'public/笔记/算法设计与分析/算法设计与分析 - (一)渐进分析进阶.md',
                title: '算法设计与分析 - (一)渐进分析进阶'
            },
            {
                path: 'public/笔记/算法设计与分析/算法设计与分析 - (二)高级分治算法.md',
                title: '算法设计与分析 - (二)高级分治算法'
            },
            {
                path: 'public/笔记/算法设计与分析/算法设计与分析 - (三)动态规划优化.md',
                title: '算法设计与分析 - (三)动态规划优化'
            },
            {
                path: 'public/笔记/算法设计与分析/算法设计与分析 - (四)图算法进阶.md',
                title: '算法设计与分析 - (四)图算法进阶'
            },
            {
                path: 'public/笔记/算法设计与分析/算法设计与分析 - (五)字符串算法.md',
                title: '算法设计与分析 - (五)字符串算法'
            },
            {
                path: 'public/笔记/算法设计与分析/算法设计与分析 - (六)计算几何.md',
                title: '算法设计与分析 - (六)计算几何'
            },
            {
                path: 'public/笔记/算法设计与分析/算法设计与分析 - (七)复杂度理论.md',
                title: '算法设计与分析 - (七)复杂度理论'
            },
            {
                path: 'public/笔记/算法设计与分析/算法设计与分析 - (八)数学算法.md',
                title: '算法设计与分析 - (八)数学算法'
            },
            {
                path: 'public/笔记/算法设计与分析/算法设计与分析 - (九)高级数据结构.md',
                title: '算法设计与分析 - (九)高级数据结构'
            },
            {
                path: 'public/笔记/算法设计与分析/算法设计与分析 - (十)算法竞赛经典题解.md',
                title: '算法设计与分析 - (十)算法竞赛经典题解'
            },
            {
                path: 'public/笔记/算法设计与分析/算法设计与分析 - (十一)近似算法.md',
                title: '算法设计与分析 - (十一)近似算法'
            },
            {
                path: 'public/笔记/算法设计与分析/算法设计与分析 - (十二)在线算法.md',
                title: '算法设计与分析 - (十二)在线算法'
            }
        ]
    },

    // cs206-pl: 编程语言原理
    {
        knowledgePointId: 'cs206-pl',
        files: [
            {
                path: 'public/笔记/编译原理/编译原理 - (一)词法分析.md',
                title: '编译原理 - (一)词法分析'
            },
            {
                path: 'public/笔记/编译原理/编译原理 - (二)语法分析.md',
                title: '编译原理 - (二)语法分析'
            },
            {
                path: 'public/笔记/编译原理/编译原理 - (三)语义分析.md',
                title: '编译原理 - (三)语义分析'
            },
            {
                path: 'public/笔记/编译原理/编译原理 - (四)中间代码生成.md',
                title: '编译原理 - (四)中间代码生成'
            },
            {
                path: 'public/笔记/编译原理/编译原理 - (五)代码优化.md',
                title: '编译原理 - (五)代码优化'
            },
            {
                path: 'public/笔记/编译原理/编译原理 - (六)目标代码生成.md',
                title: '编译原理 - (六)目标代码生成'
            },
            {
                path: 'public/笔记/编译原理/编译原理 - (七)正则表达式与DFA.md',
                title: '编译原理 - (七)正则表达式与DFA'
            },
            {
                path: 'public/笔记/编译原理/编译原理 - (八)LR语法分析.md',
                title: '编译原理 - (八)LR语法分析'
            },
            {
                path: 'public/笔记/编译原理/编译原理 - (九)语义分析深入.md',
                title: '编译原理 - (九)语义分析深入'
            },
            {
                path: 'public/笔记/编译原理/编译原理 - (十)代码优化技术.md',
                title: '编译原理 - (十)代码优化技术'
            },
            {
                path: 'public/笔记/编译原理/编译原理 - (十一)寄存器分配.md',
                title: '编译原理 - (十一)寄存器分配'
            },
            {
                path: 'public/笔记/编译原理/编译原理 - (十二)实战-完整编译器.md',
                title: '编译原理 - (十二)实战-完整编译器'
            }
        ]
    },

    // cs206-db: 数据库系统
    {
        knowledgePointId: 'cs206-db',
        files: [
            {
                path: 'public/笔记/数据库系统/数据库系统 - (一)关系模型.md',
                title: '数据库系统 - (一)关系模型'
            },
            {
                path: 'public/笔记/数据库系统/数据库系统 - (二)SQL核心语法.md',
                title: '数据库系统 - (二)SQL核心语法'
            },
            {
                path: 'public/笔记/数据库系统/数据库系统 - (三)数据库设计.md',
                title: '数据库系统 - (三)数据库设计'
            },
            {
                path: 'public/笔记/数据库系统/数据库系统 - (四)事务管理.md',
                title: '数据库系统 - (四)事务管理'
            },
            {
                path: 'public/笔记/数据库系统/数据库系统 - (五)索引与优化.md',
                title: '数据库系统 - (五)索引与优化'
            },
            {
                path: 'public/笔记/数据库系统/数据库系统 - (六)NoSQL数据库.md',
                title: '数据库系统 - (六)NoSQL数据库'
            },
            {
                path: 'public/笔记/数据库系统/数据库系统 - (七)高级SQL优化技巧.md',
                title: '数据库系统 - (七)高级SQL优化技巧'
            },
            {
                path: 'public/笔记/数据库系统/数据库系统 - (八)事务深入.md',
                title: '数据库系统 - (八)事务深入'
            },
            {
                path: 'public/笔记/数据库系统/数据库系统 - (九)数据库性能优化.md',
                title: '数据库系统 - (九)数据库性能优化'
            },
            {
                path: 'public/笔记/数据库系统/数据库系统 - (十)实战案例.md',
                title: '数据库系统 - (十)实战案例'
            },
            {
                path: 'public/笔记/数据库系统/数据库系统 - (十一)数据库监控与运维.md',
                title: '数据库系统 - (十一)数据库监控与运维'
            }
        ]
    },

    // cs205: 操作系统
    {
        knowledgePointId: 'cs205',
        files: [
            {
                path: 'public/笔记/操作系统/操作系统 - (一)进程管理.md',
                title: '操作系统 - (一)进程管理'
            },
            {
                path: 'public/笔记/操作系统/操作系统 - (二)内存管理.md',
                title: '操作系统 - (二)内存管理'
            },
            {
                path: 'public/笔记/操作系统/操作系统 - (三)文件系统.md',
                title: '操作系统 - (三)文件系统'
            },
            {
                path: 'public/笔记/操作系统/操作系统 - (四)实践项目.md',
                title: '操作系统 - (四)实践项目'
            },
            {
                path: 'public/笔记/操作系统/操作系统 - (五)高级进程调度.md',
                title: '操作系统 - (五)高级进程调度'
            },
            {
                path: 'public/笔记/操作系统/操作系统 - (六)虚拟内存深入.md',
                title: '操作系统 - (六)虚拟内存深入'
            },
            {
                path: 'public/笔记/操作系统/操作系统 - (七)文件系统详解.md',
                title: '操作系统 - (七)文件系统详解'
            },
            {
                path: 'public/笔记/操作系统/操作系统 - (八)IO系统.md',
                title: '操作系统 - (八)IO系统'
            },
            {
                path: 'public/笔记/操作系统/操作系统 - (九)安全机制.md',
                title: '操作系统 - (九)安全机制'
            },
            {
                path: 'public/笔记/操作系统/操作系统 - (十)性能优化.md',
                title: '操作系统 - (十)性能优化'
            }
        ]
    },

    // cs301: 计算机网络
    {
        knowledgePointId: 'cs301',
        files: [
            {
                path: 'public/笔记/计算机网络/计算机网络 - (一)应用层协议.md',
                title: '计算机网络 - (一)应用层协议'
            },
            {
                path: 'public/笔记/计算机网络/计算机网络 - (二)传输层.md',
                title: '计算机网络 - (二)传输层'
            },
            {
                path: 'public/笔记/计算机网络/计算机网络 - (三)网络层.md',
                title: '计算机网络 - (三)网络层'
            },
            {
                path: 'public/笔记/计算机网络/计算机网络 - (四)数据链路层.md',
                title: '计算机网络 - (四)数据链路层'
            },
            {
                path: 'public/笔记/计算机网络/计算机网络 - (五)网络安全.md',
                title: '计算机网络 - (五)网络安全'
            },
            {
                path: 'public/笔记/计算机网络/计算机网络 - (六)HTTP协议深入.md',
                title: '计算机网络 - (六)HTTP协议深入'
            },
            {
                path: 'public/笔记/计算机网络/计算机网络 - (七)WebSocket实时通信.md',
                title: '计算机网络 - (七)WebSocket实时通信'
            },
            {
                path: 'public/笔记/计算机网络/计算机网络 - (八)TCP详解.md',
                title: '计算机网络 - (八)TCP详解'
            },
            {
                path: 'public/笔记/计算机网络/计算机网络 - (九)IP协议与路由.md',
                title: '计算机网络 - (九)IP协议与路由'
            },
            {
                path: 'public/笔记/计算机网络/计算机网络 - (十)网络编程实战.md',
                title: '计算机网络 - (十)网络编程实战'
            },
            {
                path: 'public/笔记/计算机网络/计算机网络 - (十一)Wireshark抓包分析.md',
                title: '计算机网络 - (十一)Wireshark抓包分析'
            }
        ]
    },

    // cs104: 高级编程与代码规范 (Python编程 + 面向对象编程基础)
    {
        knowledgePointId: 'cs104',
        files: [
            // Python编程 (11个文件)
            {
                path: 'public/笔记/Python编程/Python编程 - (一)基础语法.md',
                title: 'Python编程 - (一)基础语法'
            },
            {
                path: 'public/笔记/Python编程/Python编程 - (二)函数与模块.md',
                title: 'Python编程 - (二)函数与模块'
            },
            {
                path: 'public/笔记/Python编程/Python编程 - (三)面向对象编程.md',
                title: 'Python编程 - (三)面向对象编程'
            },
            {
                path: 'public/笔记/Python编程/Python编程 - (四)文件操作与异常处理.md',
                title: 'Python编程 - (四)文件操作与异常处理'
            },
            {
                path: 'public/笔记/Python编程/Python编程 - (五)常用库和应用.md',
                title: 'Python编程 - (五)常用库和应用'
            },
            {
                path: 'public/笔记/Python编程/Python编程 - (六)实践项目.md',
                title: 'Python编程 - (六)实践项目'
            },
            {
                path: 'public/笔记/Python编程/Python编程 - (七)Python标准库详解.md',
                title: 'Python编程 - (七)Python标准库详解'
            },
            {
                path: 'public/笔记/Python编程/Python编程 - (八)高级编程技巧.md',
                title: 'Python编程 - (八)高级编程技巧'
            },
            {
                path: 'public/笔记/Python编程/Python编程 - (九)数据分析实战.md',
                title: 'Python编程 - (九)数据分析实战'
            },
            {
                path: 'public/笔记/Python编程/Python编程 - (十)Web开发实战.md',
                title: 'Python编程 - (十)Web开发实战'
            },
            {
                path: 'public/笔记/Python编程/Python编程 - (十一)综合实战项目.md',
                title: 'Python编程 - (十一)综合实战项目'
            },

            // 面向对象编程基础 (6个文件)
            {
                path: 'public/笔记/面向对象编程基础/面向对象编程基础 - (一)OOP三大特性.md',
                title: '面向对象编程基础 - (一)OOP三大特性'
            },
            {
                path: 'public/笔记/面向对象编程基础/面向对象编程基础 - (二)类与对象详解.md',
                title: '面向对象编程基础 - (二)类与对象详解'
            },
            {
                path: 'public/笔记/面向对象编程基础/面向对象编程基础 - (三)抽象类与接口.md',
                title: '面向对象编程基础 - (三)抽象类与接口'
            },
            {
                path: 'public/笔记/面向对象编程基础/面向对象编程基础 - (四)SOLID设计原则.md',
                title: '面向对象编程基础 - (四)SOLID设计原则'
            },
            {
                path: 'public/笔记/面向对象编程基础/面向对象编程基础 - (五)常用设计模式.md',
                title: '面向对象编程基础 - (五)常用设计模式'
            },
            {
                path: 'public/笔记/面向对象编程基础/面向对象编程基础 - (六)实战项目.md',
                title: '面向对象编程基础 - (六)实战项目'
            }
        ]
    },

    // ai1: 人工智能导论
    {
        knowledgePointId: 'ai1',
        files: [
            {
                path: 'public/笔记/人工智能导论/人工智能导论 - (一)搜索算法.md',
                title: '人工智能导论 - (一)搜索算法'
            },
            {
                path: 'public/笔记/人工智能导论/人工智能导论 - (二)机器学习基础.md',
                title: '人工智能导论 - (二)机器学习基础'
            },
            {
                path: 'public/笔记/人工智能导论/人工智能导论 - (三)神经网络.md',
                title: '人工智能导论 - (三)神经网络'
            },
            {
                path: 'public/笔记/人工智能导论/人工智能导论 - (四)专家系统.md',
                title: '人工智能导论 - (四)专家系统'
            },
            {
                path: 'public/笔记/人工智能导论/人工智能导论 - (五)自然语言处理.md',
                title: '人工智能导论 - (五)自然语言处理'
            },
            {
                path: 'public/笔记/人工智能导论/人工智能导论 - (六)深度学习.md',
                title: '人工智能导论 - (六)深度学习'
            },
            {
                path: 'public/笔记/人工智能导论/人工智能导论 - (七)强化学习.md',
                title: '人工智能导论 - (七)强化学习'
            },
            {
                path: 'public/笔记/人工智能导论/人工智能导论 - (八)实战项目.md',
                title: '人工智能导论 - (八)实战项目'
            }
        ]
    },

    // ai2: 深度学习
    {
        knowledgePointId: 'ai2',
        files: [
            {
                path: 'public/笔记/深度学习/深度学习 - (一)卷积神经网络(CNN).md',
                title: '深度学习 - (一)卷积神经网络(CNN)'
            },
            {
                path: 'public/笔记/深度学习/深度学习 - (二)循环神经网络(RNN).md',
                title: '深度学习 - (二)循环神经网络(RNN)'
            },
            {
                path: 'public/笔记/深度学习/深度学习 - (三)Transformer架构.md',
                title: '深度学习 - (三)Transformer架构'
            },
            {
                path: 'public/笔记/深度学习/深度学习 - (四)生成对抗网络(GAN).md',
                title: '深度学习 - (四)生成对抗网络(GAN)'
            },
            {
                path: 'public/笔记/深度学习/深度学习 - (五)优化算法.md',
                title: '深度学习 - (五)优化算法'
            },
            {
                path: 'public/笔记/深度学习/深度学习 - (六)正则化技术.md',
                title: '深度学习 - (六)正则化技术'
            },
            {
                path: 'public/笔记/深度学习/深度学习 - (七)实战项目.md',
                title: '深度学习 - (七)实战项目'
            },
            {
                path: 'public/笔记/深度学习/深度学习 - (八)高级技巧.md',
                title: '深度学习 - (八)高级技巧'
            },

            // 机器学习笔记也归到这里
            {
                path: 'public/笔记/机器学习/机器学习 - (一)监督学习.md',
                title: '机器学习 - (一)监督学习'
            },
            {
                path: 'public/笔记/机器学习/机器学习 - (二)无监督学习.md',
                title: '机器学习 - (二)无监督学习'
            },
            {
                path: 'public/笔记/机器学习/机器学习 - (三)深度学习基础.md',
                title: '机器学习 - (三)深度学习基础'
            },
            {
                path: 'public/笔记/机器学习/机器学习 - (四)模型评估.md',
                title: '机器学习 - (四)模型评估'
            },
            {
                path: 'public/笔记/机器学习/机器学习 - (五)集成学习.md',
                title: '机器学习 - (五)集成学习'
            },
            {
                path: 'public/笔记/机器学习/机器学习 - (六)特征工程.md',
                title: '机器学习 - (六)特征工程'
            },
            {
                path: 'public/笔记/机器学习/机器学习 - (七)超参数优化.md',
                title: '机器学习 - (七)超参数优化'
            },
            {
                path: 'public/笔记/机器学习/机器学习 - (八)实战项目.md',
                title: '机器学习 - (八)实战项目'
            },
            {
                path: 'public/笔记/机器学习/机器学习 - (九)模型解释与可视化.md',
                title: '机器学习 - (九)模型解释与可视化'
            }
        ]
    },

    // cs402: 分布式系统
    {
        knowledgePointId: 'cs402',
        files: [
            {
                path: 'public/笔记/分布式系统/分布式系统 - (一)CAP定理.md',
                title: '分布式系统 - (一)CAP定理'
            },
            {
                path: 'public/笔记/分布式系统/分布式系统 - (二)一致性模型.md',
                title: '分布式系统 - (二)一致性模型'
            },
            {
                path: 'public/笔记/分布式系统/分布式系统 - (三)分布式存储.md',
                title: '分布式系统 - (三)分布式存储'
            },
            {
                path: 'public/笔记/分布式系统/分布式系统 - (四)微服务架构.md',
                title: '分布式系统 - (四)微服务架构'
            },
            {
                path: 'public/笔记/分布式系统/分布式系统 - (五)消息队列.md',
                title: '分布式系统 - (五)消息队列'
            },
            {
                path: 'public/笔记/分布式系统/分布式系统 - (六)分布式事务.md',
                title: '分布式系统 - (六)分布式事务'
            }
        ]
    },

    // sec1: 网络安全导论
    {
        knowledgePointId: 'sec1',
        files: [
            {
                path: 'public/笔记/网络安全/网络安全 - (一)密码学基础.md',
                title: '网络安全 - (一)密码学基础'
            },
            {
                path: 'public/笔记/网络安全/网络安全 - (二)Web安全.md',
                title: '网络安全 - (二)Web安全'
            },
            {
                path: 'public/笔记/网络安全/网络安全 - (三)网络攻击与防护.md',
                title: '网络安全 - (三)网络攻击与防护'
            }
        ]
    },

    // cs499: 毕业设计
    {
        knowledgePointId: 'cs499',
        files: [
            {
                path: 'public/笔记/毕业设计/毕业设计 - (一)项目选题指南.md',
                title: '毕业设计 - (一)项目选题指南'
            },
            {
                path: 'public/笔记/毕业设计/毕业设计 - (二)系统设计.md',
                title: '毕业设计 - (二)系统设计'
            },
            {
                path: 'public/笔记/毕业设计/毕业设计 - (三)项目实施.md',
                title: '毕业设计 - (三)项目实施'
            },
            {
                path: 'public/笔记/毕业设计/毕业设计 - (四)论文撰写.md',
                title: '毕业设计 - (四)论文撰写'
            },
            {
                path: 'public/笔记/毕业设计/毕业设计 - (五)答辩准备.md',
                title: '毕业设计 - (五)答辩准备'
            }
        ]
    },

    // math102: 微积分 II
    {
        knowledgePointId: 'math102',
        files: [
            {
                path: 'public/笔记/微积分II/微积分II - (一)多元函数微分学.md',
                title: '微积分II - (一)多元函数微分学'
            },
            {
                path: 'public/笔记/微积分II/微积分II - (二)重积分.md',
                title: '微积分II - (二)重积分'
            },
            {
                path: 'public/笔记/微积分II/微积分II - (三)无穷级数.md',
                title: '微积分II - (三)无穷级数'
            },
            {
                path: 'public/笔记/微积分II/微积分II - (四)微分方程.md',
                title: '微积分II - (四)微分方程'
            },
            {
                path: 'public/笔记/微积分II/微积分II - (五)典型例题详解.md',
                title: '微积分II - (五)典型例题详解'
            },
            {
                path: 'public/笔记/微积分II/微积分II - (六)解题技巧总结.md',
                title: '微积分II - (六)解题技巧总结'
            }
        ]
    },

    // math203: 概率论与数理统计
    {
        knowledgePointId: 'math203',
        files: [
            {
                path: 'public/笔记/概率论与数理统计/概率论与数理统计 - (一)概率论基础.md',
                title: '概率论与数理统计 - (一)概率论基础'
            },
            {
                path: 'public/笔记/概率论与数理统计/概率论与数理统计 - (二)随机变量与分布.md',
                title: '概率论与数理统计 - (二)随机变量与分布'
            },
            {
                path: 'public/笔记/概率论与数理统计/概率论与数理统计 - (三)多维随机变量.md',
                title: '概率论与数理统计 - (三)多维随机变量'
            },
            {
                path: 'public/笔记/概率论与数理统计/概率论与数理统计 - (四)大数定律与中心极限定理.md',
                title: '概率论与数理统计 - (四)大数定律与中心极限定理'
            },
            {
                path: 'public/笔记/概率论与数理统计/概率论与数理统计 - (五)参数估计.md',
                title: '概率论与数理统计 - (五)参数估计'
            },
            {
                path: 'public/笔记/概率论与数理统计/概率论与数理统计 - (六)假设检验.md',
                title: '概率论与数理统计 - (六)假设检验'
            },
            {
                path: 'public/笔记/概率论与数理统计/概率论与数理统计 - (七)回归分析.md',
                title: '概率论与数理统计 - (七)回归分析'
            },
            {
                path: 'public/笔记/概率论与数理统计/概率论与数理统计 - (八)典型例题详解.md',
                title: '概率论与数理统计 - (八)典型例题详解'
            },
            {
                path: 'public/笔记/概率论与数理统计/概率论与数理统计 - (九)统计分析实战.md',
                title: '概率论与数理统计 - (九)统计分析实战'
            },
            {
                path: 'public/笔记/概率论与数理统计/概率论与数理统计 - (十)常用统计检验速查.md',
                title: '概率论与数理统计 - (十)常用统计检验速查'
            }
        ]
    },

    // phys101: 大学物理
    {
        knowledgePointId: 'phys101',
        files: [
            {
                path: 'public/笔记/大学物理/大学物理 - (一)力学.md',
                title: '大学物理 - (一)力学'
            },
            {
                path: 'public/笔记/大学物理/大学物理 - (二)热学.md',
                title: '大学物理 - (二)热学'
            },
            {
                path: 'public/笔记/大学物理/大学物理 - (三)电磁学.md',
                title: '大学物理 - (三)电磁学'
            },
            {
                path: 'public/笔记/大学物理/大学物理 - (四)光学.md',
                title: '大学物理 - (四)光学'
            },
            {
                path: 'public/笔记/大学物理/大学物理 - (五)近代物理.md',
                title: '大学物理 - (五)近代物理'
            },
            {
                path: 'public/笔记/大学物理/大学物理 - (六)物理模拟实践.md',
                title: '大学物理 - (六)物理模拟实践'
            },
            {
                path: 'public/笔记/大学物理/大学物理 - (七)流体力学.md',
                title: '大学物理 - (七)流体力学'
            },
            {
                path: 'public/笔记/大学物理/大学物理 - (八)振动与波动.md',
                title: '大学物理 - (八)振动与波动'
            },
            {
                path: 'public/笔记/大学物理/大学物理 - (九)电磁波与天线.md',
                title: '大学物理 - (九)电磁波与天线'
            },
            {
                path: 'public/笔记/大学物理/大学物理 - (十)实战项目集锦.md',
                title: '大学物理 - (十)实战项目集锦'
            },
            {
                path: 'public/笔记/大学物理/大学物理 - (十一)物理常数速查表.md',
                title: '大学物理 - (十一)物理常数速查表'
            },
            {
                path: 'public/笔记/大学物理/大学物理 - (十二)物理公式速查.md',
                title: '大学物理 - (十二)物理公式速查'
            }
        ]
    },

    // eng101: 大学英语
    {
        knowledgePointId: 'eng101',
        files: [
            {
                path: 'public/笔记/大学英语/大学英语 - (一)学术英语阅读.md',
                title: '大学英语 - (一)学术英语阅读'
            },
            {
                path: 'public/笔记/大学英语/大学英语 - (二)学术写作.md',
                title: '大学英语 - (二)学术写作'
            },
            {
                path: 'public/笔记/大学英语/大学英语 - (三)技术文档阅读.md',
                title: '大学英语 - (三)技术文档阅读'
            },
            {
                path: 'public/笔记/大学英语/大学英语 - (四)日常学术对话.md',
                title: '大学英语 - (四)日常学术对话'
            },
            {
                path: 'public/笔记/大学英语/大学英语 - (五)技术演讲与展示.md',
                title: '大学英语 - (五)技术演讲与展示'
            },
            {
                path: 'public/笔记/大学英语/大学英语 - (六)英语语法要点.md',
                title: '大学英语 - (六)英语语法要点'
            },
            {
                path: 'public/笔记/大学英语/大学英语 - (七)技术面试英语.md',
                title: '大学英语 - (七)技术面试英语'
            },
            {
                path: 'public/笔记/大学英语/大学英语 - (八)常见英语学习误区与纠正.md',
                title: '大学英语 - (八)常见英语学习误区与纠正'
            },
            {
                path: 'public/笔记/大学英语/大学英语 - (九)科技英语阅读材料.md',
                title: '大学英语 - (九)科技英语阅读材料'
            },
            {
                path: 'public/笔记/大学英语/大学英语 - (十)英语四六级备考.md',
                title: '大学英语 - (十)英语四六级备考'
            },
            {
                path: 'public/笔记/大学英语/大学英语 - (十一)实用工具与资源.md',
                title: '大学英语 - (十一)实用工具与资源'
            }
        ]
    },

    // cs100: 计算机导论
    {
        knowledgePointId: 'cs100',
        files: [
            {
                path: 'public/笔记/计算机导论/计算机导论 - (一)计算机发展史.md',
                title: '计算机导论 - (一)计算机发展史'
            },
            {
                path: 'public/笔记/计算机导论/计算机导论 - (二)计算机硬件系统.md',
                title: '计算机导论 - (二)计算机硬件系统'
            },
            {
                path: 'public/笔记/计算机导论/计算机导论 - (三)计算机软件系统.md',
                title: '计算机导论 - (三)计算机软件系统'
            },
            {
                path: 'public/笔记/计算机导论/计算机导论 - (四)数据表示与编码.md',
                title: '计算机导论 - (四)数据表示与编码'
            },
            {
                path: 'public/笔记/计算机导论/计算机导论 - (五)算法与数据结构基础.md',
                title: '计算机导论 - (五)算法与数据结构基础'
            },
            {
                path: 'public/笔记/计算机导论/计算机导论 - (六)计算机网络基础.md',
                title: '计算机导论 - (六)计算机网络基础'
            },
            {
                path: 'public/笔记/计算机导论/计算机导论 - (七)新兴技术与发展趋势.md',
                title: '计算机导论 - (七)新兴技术与发展趋势'
            },
            {
                path: 'public/笔记/计算机导论/计算机导论 - (八)计算机科学实践项目.md',
                title: '计算机导论 - (八)计算机科学实践项目'
            }
        ]
    }
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


