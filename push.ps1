# push.ps1 (中文注释版)
# 自动检查、提交并推送到 GitHub 当前分支

# --- 1. 检查是否有文件变更 ---
Write-Host "Checking file status..."
$status = git status --porcelain
if (-not $status) {
    Write-Host "Working directory is clean. No changes to commit."
    # 正常退出脚本
    exit 0
}

# --- 2. 准备提交信息 ---
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$commitMessage = "Auto-commit: $timestamp"

# --- 3. 获取当前分支名 ---
$currentBranch = git rev-parse --abbrev-ref HEAD
Write-Host "Detected current branch: $currentBranch"

# --- 4. 执行 Git 命令并进行错误检查 ---

# 添加文件
Write-Host "Executing: git add ."
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: 'git add' command failed!" -ForegroundColor Red
    exit 1
}

# 提交文件
Write-Host "Executing: git commit -m `"$commitMessage`""
git commit -m "$commitMessage"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: 'git commit' command failed!" -ForegroundColor Red
    exit 1
}

# 推送到远程仓库的当前分支
Write-Host "Executing: git push origin $currentBranch"
git push origin $currentBranch
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: 'git push' command failed! Please check your network connection or remote repository status." -ForegroundColor Red
    exit 1
}

Write-Host "Operation completed successfully!" -ForegroundColor Green