# IntelliBuddy 知识点和笔记快速导入脚本
# PowerShell 脚本 - 适用于 Windows

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  IntelliBuddy 数据导入脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 .env 文件
if (-not (Test-Path ".env")) {
    Write-Host "❌ 错误: 未找到 .env 文件" -ForegroundColor Red
    Write-Host ""
    Write-Host "请按照以下步骤操作：" -ForegroundColor Yellow
    Write-Host "1. 将 '环境配置示例.txt' 重命名为 '.env'" -ForegroundColor Yellow
    Write-Host "2. 编辑 .env 文件，填入你的 MongoDB Atlas 连接字符串" -ForegroundColor Yellow
    Write-Host "3. 重新运行此脚本" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "按任意键退出"
    exit 1
}

Write-Host "✅ 找到 .env 配置文件" -ForegroundColor Green
Write-Host ""

# 检查 node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 未找到 node_modules，正在安装依赖..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 依赖安装失败" -ForegroundColor Red
        Read-Host "按任意键退出"
        exit 1
    }
    Write-Host "✅ 依赖安装完成" -ForegroundColor Green
    Write-Host ""
}

# 询问用户导入方式
Write-Host "请选择导入方式：" -ForegroundColor Cyan
Write-Host "1. 一键导入（推荐）- 导入知识点结构 + 填充笔记内容" -ForegroundColor White
Write-Host "2. 仅导入知识点结构（不包含笔记内容）" -ForegroundColor White
Write-Host "3. 仅填充笔记内容（需要先有知识点数据）" -ForegroundColor White
Write-Host "4. 清除并重新填充笔记内容" -ForegroundColor White
Write-Host ""

$choice = Read-Host "请输入选项 (1-4)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🚀 开始一键导入..." -ForegroundColor Cyan
        Write-Host ""
        npm run seed:all
    }
    "2" {
        Write-Host ""
        Write-Host "🚀 开始导入知识点结构..." -ForegroundColor Cyan
        Write-Host ""
        npm run seed
    }
    "3" {
        Write-Host ""
        Write-Host "🚀 开始填充笔记内容..." -ForegroundColor Cyan
        Write-Host ""
        npm run fill:content
    }
    "4" {
        Write-Host ""
        Write-Host "🚀 开始清除并重新填充笔记内容..." -ForegroundColor Cyan
        Write-Host ""
        npm run fill:content:clear
    }
    default {
        Write-Host ""
        Write-Host "❌ 无效选项" -ForegroundColor Red
        Read-Host "按任意键退出"
        exit 1
    }
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✅ 导入完成！" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  ❌ 导入失败" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "请检查错误信息并重试" -ForegroundColor Yellow
    Write-Host ""
}

Read-Host "按任意键退出"

