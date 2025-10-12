# 📑 文件索引 - 快速查找指南

> 本次为你生成了完整的计算机科学课程数据和配套文档，以下是所有文件的快速索引

---

## 🎯 我想...

### 立即导入数据
👉 查看 **[导入数据指南.md](./导入数据指南.md)** （中文，最简洁）  
👉 查看 **[QUICK_START.md](./QUICK_START.md)** （英文，3步导入）

### 了解数据内容
👉 查看 **[DATA_SUMMARY.md](./DATA_SUMMARY.md)** （完整统计）  
👉 查看 **[KNOWLEDGE_POINTS_GUIDE.md](./KNOWLEDGE_POINTS_GUIDE.md)** （课程详情）

### 预览测验题目
👉 查看 **[QUIZ_PREVIEW.md](./QUIZ_PREVIEW.md)** （86道题完整预览）

### 获取完整说明
👉 查看 **[README_DATA_IMPORT.md](./README_DATA_IMPORT.md)** （最完整的文档）

---

## 📁 核心文件

### 1. 数据文件 📊
```
knowledge-points-data.json
```
- **内容**: 12门课程的完整数据
- **大小**: 86道测验题
- **格式**: 标准JSON
- **用途**: 导入到MongoDB数据库

### 2. 导入脚本 🔧
```
backend/src/seed-cs-curriculum.ts
```
- **功能**: 自动读取JSON并导入数据库
- **命令**: `npm run seed:cs`
- **特点**: 清空旧数据 → 插入新数据 → 显示结果

### 3. 配置文件 ⚙️
```
backend/package.json
```
- **修改**: 添加了 `"seed:cs"` 命令
- **用法**: `npm run seed:cs`

---

## 📚 文档文件

### 快速开始类

#### 1. 导入数据指南.md 🇨🇳
- **语言**: 中文
- **长度**: 简短
- **适合**: 快速上手
- **内容**: 3步导入 + 常见问题

#### 2. QUICK_START.md 🇬🇧
- **语言**: 英文
- **长度**: 简短
- **适合**: 快速开始
- **内容**: 导入步骤 + 预期效果 + 故障排除

#### 3. README_DATA_IMPORT.md 📖
- **语言**: 英文
- **长度**: 完整
- **适合**: 全面了解
- **内容**: 完整说明 + 使用指南 + 扩展建议

---

### 详细说明类

#### 4. KNOWLEDGE_POINTS_GUIDE.md 📚
- **内容**: 课程体系详细说明
- **包含**: 
  - 12门课程详情（难度、时长、前置）
  - 测验题目要求
  - 图谱坐标说明
  - 数据格式规范

#### 5. DATA_SUMMARY.md 📊
- **内容**: 数据统计和总结
- **包含**:
  - 课程结构表格
  - 题目分布统计
  - 使用指南
  - 文件清单

#### 6. QUIZ_PREVIEW.md 📝
- **内容**: 所有测验题目预览
- **包含**:
  - 86道题的完整内容
  - 正确答案标注
  - 题型统计
  - 知识点覆盖

---

### 索引文件

#### 7. FILES_INDEX.md 📑
- **内容**: 本文档
- **用途**: 快速找到需要的文件

---

## 🗂️ 文件组织结构

```
intellibuddy/
│
├── 📊 数据文件
│   └── knowledge-points-data.json          # 核心数据（12门课程）
│
├── 🔧 代码文件
│   └── backend/
│       ├── src/
│       │   └── seed-cs-curriculum.ts       # 导入脚本
│       └── package.json                    # npm 命令配置
│
├── 📚 中文文档
│   ├── 导入数据指南.md                      # 快速开始（中文）
│   └── FILES_INDEX.md                      # 本索引文档
│
└── 📖 英文文档
    ├── README_DATA_IMPORT.md               # 主说明文档
    ├── QUICK_START.md                      # 快速开始
    ├── KNOWLEDGE_POINTS_GUIDE.md           # 课程指南
    ├── QUIZ_PREVIEW.md                     # 题目预览
    └── DATA_SUMMARY.md                     # 数据总结
```

---

## 🎯 使用场景推荐

### 场景1: 我是新手，想快速导入
**推荐阅读顺序**:
1. 📄 [导入数据指南.md](./导入数据指南.md) - 了解基本步骤
2. 🔧 执行命令导入数据
3. 🎨 访问前端查看效果

### 场景2: 我想了解数据内容
**推荐阅读顺序**:
1. 📊 [DATA_SUMMARY.md](./DATA_SUMMARY.md) - 查看统计
2. 📚 [KNOWLEDGE_POINTS_GUIDE.md](./KNOWLEDGE_POINTS_GUIDE.md) - 了解课程
3. 📝 [QUIZ_PREVIEW.md](./QUIZ_PREVIEW.md) - 预览题目

### 场景3: 我想深入使用和扩展
**推荐阅读顺序**:
1. 📖 [README_DATA_IMPORT.md](./README_DATA_IMPORT.md) - 完整说明
2. 📊 [knowledge-points-data.json](./knowledge-points-data.json) - 数据格式
3. 🔧 [backend/src/seed-cs-curriculum.ts](./backend/src/seed-cs-curriculum.ts) - 代码实现

### 场景4: 我遇到问题需要排查
**推荐阅读顺序**:
1. 📄 [QUICK_START.md](./QUICK_START.md) - 故障排除部分
2. 📖 [README_DATA_IMPORT.md](./README_DATA_IMPORT.md) - 获取帮助部分
3. 🔧 检查 `.env` 配置和数据库连接

---

## 📈 数据概览（快速版）

### 课程统计
- **总数**: 12门
- **学时**: 565小时
- **题数**: 86道
- **学期**: 4个

### 题目统计
- **单选**: 36道 (42%)
- **多选**: 32道 (37%)
- **判断**: 18道 (21%)

### 难度分布
- ⭐ 简单: 2门
- ⭐⭐ 中等: 5门
- ⭐⭐⭐ 较难: 3门
- ⭐⭐⭐⭐ 困难: 2门

---

## 🚀 快速命令

```bash
# 导入数据（在 backend 目录执行）
npm run seed:cs

# 启动后端服务
npm run dev

# 切换到其他数据集
npm run seed:java    # Java模块
npm run seed         # 默认数据
```

---

## 💡 小贴士

### ✅ 推荐做法
- 先看 **导入数据指南.md**，快速上手
- 遇到问题查看 **QUICK_START.md** 的故障排除
- 想了解详情查看 **README_DATA_IMPORT.md**
- 题目内容查看 **QUIZ_PREVIEW.md**

### ⚠️ 注意事项
- 导入前确保 MongoDB 运行
- 导入会清空原有数据
- 可以随时切换不同数据集
- 所有文档都是为你生成的，可以随意修改

---

## 📞 需要帮助？

1. 📄 查看相关文档（见上方索引）
2. 🔍 检查 MongoDB 连接
3. 🐛 查看控制台错误信息
4. 🔄 尝试重新导入数据

---

## 🎉 总结

**本次为你生成了**:
- ✅ 1个数据文件（12门课程，86道题）
- ✅ 1个导入脚本
- ✅ 7个说明文档
- ✅ 修改了package.json

**使用非常简单**:
```bash
cd backend && npm run seed:cs
```

**立即开始吧！** 🚀

---

<div align="center">

**📑 [返回顶部](#-文件索引---快速查找指南)**

Made with ❤️ for IntelliB​uddy Project

</div>

