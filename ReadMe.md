
---

# 智学伴 (IntelliBuddy) - AI 驱动的自适应学习中心

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue.js](https://img.shields.io/badge/Vue.js-3-4FC08D.svg)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-^5.0-646CFF.svg)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-^5.2-3178C6.svg)](https://www.typescriptlang.org/)

**IntelliBuddy** 是一个旨在颠覆传统在线学习模式的智能学习平台。它并非一个静态的课程聚合网站，而是一个能够主动适应每位学习者认知水平与学习节奏的动态伙伴。项目核心在于通过 AI 技术实现学习路径的个性化自适应与伙伴式的智能交互体验。

**[Live Demo (部署后请替换此链接)](https://intellibuddy.example.com)**

## ✨ 核心功能 (Core Features)

### 1. 动态能力评估与自适应学习路径 (Dynamic Assessment & Adaptive Learning Path)

*   **初始能力画像 (Initial Skill Profiling):** 用户通过一个覆盖学科核心知识点的动态评估测试，系统会生成一份包含其知识强弱项的初始能力画像。
*   **可视化知识图谱 (Visualized Knowledge Graph):** 摒弃线性课程列表，采用基于 `AntV X6` / `D3.js` 的可交互知识图谱来展现学科全貌，节点关系清晰可见。
*   **个性化路径生成 (Personalized Path Generation):** 基于能力画像，系统自动在图谱上规划并推荐一条最优学习路径，确保学习者从最合适的地方开始。
*   **智能解锁与回溯机制 (Intelligent Unlocking & Remediation):** 学习者需完成前置节点的测验才能解锁后续内容。当系统监测到学习者在某个知识点上遇到困难时，会自动推荐相关的基础前置节点，引导其进行巩固。

### 2. 情境感知 AI 助教 (Context-Aware AI Assistant)

*   **上下文感知问答 (Context-Aware Q&A):** **(项目灵魂)** AI 助教能够识别用户当前正在学习的知识点上下文。当前端将 `context` 信息与用户问题一并提交给大语言模型（LLM）API 时，AI 能提供高度相关的精准回答，而非泛泛而谈。
*   **主动式干预 (Proactive Intervention):**
    *   **基于表现:** 当用户在测验中连续失败时，AI 会主动介入，提供替代性的解释或更简单的示例。
    *   **基于行为:** 当用户在某个页面停留时间过长时，AI 会主动询问是否需要帮助，打破学习僵局。
*   **代码解释器 (Code Explainer):** 内置代码解释工具，允许用户粘贴代码片段，AI 将提供逐行逻辑分析。

### 3. 数据驱动的学习仪表盘 (Data-Driven Learning Dashboard)

*   **多维能力雷达图 (Competency Radar Chart):** 使用 `ECharts` 等可视化库，将用户的测验成绩聚合成一个多维度能力雷达图，使其对自身技术栈的掌握程度一目了然。
*   **学习热力图 (Learning Activity Heatmap):** 类似 GitHub 的贡献图，激励用户保持持续学习的习惯。
*   **AI 驱动的错题分析 (AI-Powered Formative Review):** 自动归集用户的所有错题，并调用 AI 为每道题生成详尽、人性化的解析。

## 🛠️ 技术栈 (Technology Stack)

| 分类                  | 技术                                                         |
| --------------------- | ------------------------------------------------------------ |
| **前端 (Frontend)**   | `Vue 3` (Composition API), `Vite`, `TypeScript`, `Vue Router 4`, `Pinia`, `Axios` |
| **UI & 可视化**       | `Element Plus` / `Naive UI`, `ECharts`, `AntV X6`            |
| **后端 (Backend)**    | `Serverless Functions` (Vercel / Netlify) 或 `Node.js` (`Express` / `Koa`) |
| **数据库 (Database)** | `MongoDB` (使用 Mongoose 作为 ODM)                           |
| **AI 服务**           | 国内大语言模型 API (百度文心一言, 阿里通义千问, 智谱 AI 等)  |
| **开发工具**          | `ESLint`, `Prettier`, `pnpm`                                 |

## 🏛️ 架构与数据模型 (Architecture & Data Schema)

项目采用前后端分离的架构，推荐使用 Vercel 进行一体化部署，简化运维。核心数据模型围绕以下三个 MongoDB 集合构建：

1.  **`users`**: 存储用户认证信息及初始评估结果。
    ```json
    {
      "username": "string",
      "passwordHash": "string",
      "initialAssessment": { "score": "number", "weakAreas": ["string"] }
    }
    ```
2.  **`knowledgePoints`**: 知识点库，包含内容、前置依赖和测验。
    ```json
    {
      "title": "string",
      "subject": "string",
      "content": "string (Markdown)",
      "prerequisites": ["ObjectId"],
      "quiz": [{ "question": "string", "options": ["string"], "answer": "string" }]
    }
    ```
3.  **`userProgress`**: 核心关联表，记录用户与知识点的交互状态。
    ```json
    {
      "userId": "ObjectId",
      "pointId": "ObjectId",
      "status": "'not_started' | 'in_progress' | 'completed'",
      "quizAttempts": "number",
      "bestScore": "number"
    }
    ```

## 🚀 本地开发 (Getting Started)

请确保您已安装 [Node.js](https://nodejs.org/) (v18+) 和 [pnpm](https://pnpm.io/)。

1.  **克隆仓库**
    ```bash
    git clone https://github.com/your-username/IntelliBuddy.git
    cd IntelliBuddy
    ```

2.  **安装依赖**
    ```bash
    pnpm install
    ```

3.  **配置环境变量**
    在项目根目录创建一个 `.env.local` 文件，并填入必要的环境变量：
    ```env
    # MongoDB 连接字符串
    DATABASE_URL="mongodb+srv://<user>:<password>@<cluster-url>/intellibuddy?retryWrites=true&w=majority"
    
    # JWT 密钥，用于用户认证
    JWT_SECRET="your_strong_jwt_secret"
    
    # AI 大模型 API Key
    AI_API_KEY="your_ai_provider_api_key"
    AI_API_ENDPOINT="your_ai_provider_endpoint"
    ```

4.  **启动开发服务器**
    ```bash
    pnpm dev
    ```
    应用将在 `http://localhost:5173` (或 Vite 指定的其他端口) 上运行。

## 部署 (Deployment)

推荐使用 **[Vercel](https://vercel.com/)** 进行部署。

1.  将您的代码推送到 GitHub/GitLab 仓库。
2.  在 Vercel 上导入该仓库。
3.  Vercel 会自动识别项目为 Vite 应用。
4.  在 Vercel 的项目设置中配置与 `.env.local` 文件中相同的环境变量。
5.  部署！Vercel 会自动处理前端构建和 Serverless Functions 的部署。

## 🤝 贡献 (Contributing)

我们欢迎任何形式的贡献！如果您有好的想法或发现了 Bug，请随时提交 Pull Request 或创建 Issue。

1.  Fork 本仓库
2.  创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3.  提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4.  推送到分支 (`git push origin feature/AmazingFeature`)
5.  开启一个 Pull Request

## 📄 许可证 (License)

本项目采用 [MIT License](https://opensource.org/licenses/MIT) 授权。