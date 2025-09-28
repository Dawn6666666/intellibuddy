# push.ps1
# 自动提交并推送到 GitHub

# 获取当前时间作为提交信息
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$commitMessage = "自动提交: $timestamp"

# 执行 Git 命令
git add .
git commit -m "$commitMessage"
git push origin main
