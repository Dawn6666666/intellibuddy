# 软件工程 - (五)版本控制(Git)

掌握Git版本控制和最佳实践。

---

## 5. 版本控制（Git）

### 5.1 Git基础工作流

```bash
# 初始化仓库
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"

# 基本工作流
git add .
git commit -m "Initial commit"
git branch feature/login
git checkout feature/login
# 开发...
git commit -m "Add login feature"
git checkout main
git merge feature/login
git push origin main
```

### 5.2 分支策略

#### 5.2.1 Git Flow

```plain
master (生产环境)
  ↑
release/v1.0 (预发布)
  ↑
develop (开发主分支)
  ↑
feature/user-login (功能分支)
hotfix/critical-bug (紧急修复)
```

```python
class GitFlow:
    """Git Flow工作流模拟"""
    
    def __init__(self):
        self.branches = {
            'master': ['v1.0', 'v1.1'],
            'develop': [],
            'features': [],
            'releases': [],
            'hotfixes': []
        }
    
    def create_feature(self, feature_name):
        """创建功能分支"""
        branch_name = f"feature/{feature_name}"
        self.branches['features'].append(branch_name)
        
        print(f"\n创建功能分支:")
        print(f"$ git checkout -b {branch_name} develop")
        return branch_name
    
    def finish_feature(self, feature_name):
        """完成功能开发"""
        branch_name = f"feature/{feature_name}"
        
        print(f"\n完成功能开发:")
        print(f"$ git checkout develop")
        print(f"$ git merge --no-ff {branch_name}")
        print(f"$ git branch -d {branch_name}")
        
        if branch_name in self.branches['features']:
            self.branches['features'].remove(branch_name)
    
    def create_release(self, version):
        """创建发布分支"""
        branch_name = f"release/{version}"
        self.branches['releases'].append(branch_name)
        
        print(f"\n创建发布分支:")
        print(f"$ git checkout -b {branch_name} develop")
        print(f"# 进行版本号更新、文档完善等")
        return branch_name
    
    def finish_release(self, version):
        """完成发布"""
        branch_name = f"release/{version}"
        
        print(f"\n完成发布:")
        print(f"$ git checkout master")
        print(f"$ git merge --no-ff {branch_name}")
        print(f"$ git tag -a {version} -m 'Release {version}'")
        print(f"$ git checkout develop")
        print(f"$ git merge --no-ff {branch_name}")
        print(f"$ git branch -d {branch_name}")
        
        self.branches['master'].append(version)
    
    def create_hotfix(self, bug_name, version):
        """创建热修复分支"""
        branch_name = f"hotfix/{bug_name}"
        self.branches['hotfixes'].append(branch_name)
        
        print(f"\n创建热修复分支:")
        print(f"$ git checkout -b {branch_name} master")
        print(f"# 修复紧急Bug")
        return branch_name
    
    def finish_hotfix(self, bug_name, version):
        """完成热修复"""
        branch_name = f"hotfix/{bug_name}"
        
        print(f"\n完成热修复:")
        print(f"$ git checkout master")
        print(f"$ git merge --no-ff {branch_name}")
        print(f"$ git tag -a {version} -m 'Hotfix {version}'")
        print(f"$ git checkout develop")
        print(f"$ git merge --no-ff {branch_name}")
        print(f"$ git branch -d {branch_name}")

# 演示Git Flow
flow = GitFlow()

print("="*70)
print("Git Flow 完整流程演示")
print("="*70)

# 开发新功能
flow.create_feature("user-authentication")
flow.finish_feature("user-authentication")

# 准备发布
flow.create_release("v1.2.0")
flow.finish_release("v1.2.0")

# 紧急修复
flow.create_hotfix("security-patch", "v1.2.1")
flow.finish_hotfix("security-patch", "v1.2.1")
```

#### 5.2.2 GitHub Flow

简化版分支策略，适合持续部署。

```plain
main (唯一长期分支)
  ├── feature/add-payment
  ├── fix/login-bug
  └── enhance/performance
```

```bash
# GitHub Flow工作流
# 1. 从main创建分支
git checkout main
git pull origin main
git checkout -b feature/add-payment

# 2. 提交代码
git add .
git commit -m "Add payment integration"
git push origin feature/add-payment

# 3. 创建Pull Request (在GitHub上)
# 4. 代码审查
# 5. 合并到main
# 6. 自动部署到生产环境
```

### 5.3 Rebase vs Merge

#### 5.3.1 Merge（合并）

```bash
# 保留分支历史
git checkout main
git merge feature/login

# 提交历史:
# * Merge branch 'feature/login'
# |\
# | * Add login validation
# | * Create login form
# * Update README
```

#### 5.3.2 Rebase（变基）

```bash
# 线性历史，更清晰
git checkout feature/login
git rebase main
git checkout main
git merge feature/login  # Fast-forward merge

# 提交历史:
# * Add login validation
# * Create login form
# * Update README
```

```python
class GitRebaseDemo:
    """Rebase演示"""
    
    @staticmethod
    def show_merge_vs_rebase():
        """对比Merge和Rebase"""
        
        print("="*70)
        print("Merge vs Rebase 对比")
        print("="*70)
        
        print("\n【Merge方式】")
        print("优点:")
        print("  + 保留完整的分支历史")
        print("  + 不修改已有提交")
        print("  + 安全，适合公共分支")
        print("\n缺点:")
        print("  - 历史图复杂，有合并提交")
        print("  - 不易追踪线性历史")
        
        print("\n【Rebase方式】")
        print("优点:")
        print("  + 线性历史，更清晰")
        print("  + 没有额外的合并提交")
        print("  + 易于追踪和bisect")
        print("\n缺点:")
        print("  - 改写提交历史")
        print("  - 不适合已推送的公共分支")
        print("  - 需要强制推送 (git push -f)")
        
        print("\n【使用建议】")
        print("✅ 使用Rebase:")
        print("  - 本地未推送的分支")
        print("  - 整理提交历史")
        print("  - 同步主分支的更新")
        
        print("\n✅ 使用Merge:")
        print("  - 合并功能分支到主分支")
        print("  - 多人协作的公共分支")
        print("  - 需要保留完整历史")

GitRebaseDemo.show_merge_vs_rebase()
```

### 5.4 交互式Rebase

整理提交历史的强大工具。

```bash
# 交互式rebase最近3次提交
git rebase -i HEAD~3

# 编辑器显示:
# pick abc1234 Add user model
# pick def5678 Fix typo
# pick ghi9012 Add validation

# 可以执行的操作:
# pick   - 使用该提交
# reword - 使用该提交，但修改提交信息
# edit   - 使用该提交，但停下来修改
# squash - 合并到前一个提交
# fixup  - 合并到前一个提交，丢弃提交信息
# drop   - 删除该提交
```

```python
class InteractiveRebase:
    """交互式Rebase示例"""
    
    @staticmethod
    def squash_commits_example():
        """合并多个提交的示例"""
        
        print("="*70)
        print("交互式Rebase: 合并提交")
        print("="*70)
        
        print("\n原始提交历史:")
        commits = [
            "abc1234 Add user login feature",
            "def5678 Fix login validation",
            "ghi9012 Update login error message",
            "jkl3456 Fix typo in login",
        ]
        
        for commit in commits:
            print(f"  {commit}")
        
        print("\n执行: git rebase -i HEAD~4")
        print("\n编辑器中修改为:")
        print("  pick abc1234 Add user login feature")
        print("  squash def5678 Fix login validation")
        print("  squash ghi9012 Update login error message")
        print("  squash jkl3456 Fix typo in login")
        
        print("\n结果:")
        print("  abc1234 Add user login feature (完整实现)")
        
        print("\n✅ 优点: 提交历史更清晰，一个功能一个提交")
    
    @staticmethod
    def reorder_commits_example():
        """重新排序提交"""
        
        print("\n" + "="*70)
        print("交互式Rebase: 重新排序")
        print("="*70)
        
        print("\n原始顺序:")
        print("  1. Add feature A")
        print("  2. Update README")
        print("  3. Add feature B")
        
        print("\n重新排序后:")
        print("  1. Add feature A")
        print("  2. Add feature B")
        print("  3. Update README")
        
        print("\n✅ 逻辑更清晰: 先完成功能，再更新文档")

demo = InteractiveRebase()
demo.squash_commits_example()
demo.reorder_commits_example()
```

### 5.5 冲突解决

```python
class ConflictResolution:
    """Git冲突解决"""
    
    @staticmethod
    def show_conflict_example():
        """展示冲突示例"""
        
        print("="*70)
        print("Git冲突解决流程")
        print("="*70)
        
        print("\n场景: 两个人同时修改了同一文件")
        
        print("\n1. 拉取代码时发现冲突:")
        print("$ git pull origin main")
        print("Auto-merging app.py")
        print("CONFLICT (content): Merge conflict in app.py")
        print("Automatic merge failed; fix conflicts and then commit")
        
        print("\n2. 查看冲突文件:")
        conflict_content = """
<<<<<<< HEAD
def calculate_price(amount):
    tax_rate = 0.08
    return amount * (1 + tax_rate)
=======
def calculate_price(amount, discount=0):
    tax_rate = 0.10
    return amount * (1 + tax_rate) * (1 - discount)
>>>>>>> feature/discount
"""
        print(conflict_content)
        
        print("\n3. 解决冲突 (选择保留哪部分代码):")
        resolved_content = """
def calculate_price(amount, discount=0):
    tax_rate = 0.10  # 使用新的税率
    return amount * (1 + tax_rate) * (1 - discount)
"""
        print(resolved_content)
        
        print("\n4. 标记冲突已解决:")
        print("$ git add app.py")
        print("$ git commit -m 'Merge feature/discount and resolve conflicts'")
        
        print("\n5. 推送代码:")
        print("$ git push origin main")
    
    @staticmethod
    def conflict_prevention_tips():
        """冲突预防技巧"""
        
        print("\n" + "="*70)
        print("冲突预防最佳实践")
        print("="*70)
        
        tips = [
            ("频繁同步", "经常pull主分支，减少差异"),
            ("小步提交", "提交粒度小，冲突范围小"),
            ("沟通协作", "团队成员沟通谁在修改哪些文件"),
            ("功能分离", "不同功能在不同文件中实现"),
            ("代码审查", "PR review时检查潜在冲突"),
            ("自动化测试", "CI确保合并后代码正常"),
        ]
        
        for i, (title, desc) in enumerate(tips, 1):
            print(f"\n{i}. {title}")
            print(f"   {desc}")

resolver = ConflictResolution()
resolver.show_conflict_example()
resolver.conflict_prevention_tips()
```

### 5.6 Git最佳实践

```python
class GitBestPractices:
    """Git最佳实践"""
    
    @staticmethod
    def commit_message_guidelines():
        """提交信息规范"""
        
        print("="*70)
        print("提交信息(Commit Message)规范")
        print("="*70)
        
        print("\n【格式】")
        print("<type>(<scope>): <subject>")
        print()
        print("<body>")
        print()
        print("<footer>")
        
        print("\n【类型(type)】")
        types = [
            ("feat", "新功能"),
            ("fix", "修复Bug"),
            ("docs", "文档更新"),
            ("style", "代码格式(不影响代码运行)"),
            ("refactor", "重构(既不是新功能也不是修复)"),
            ("perf", "性能优化"),
            ("test", "添加测试"),
            ("chore", "构建过程或辅助工具变动"),
        ]
        
        for type_name, desc in types:
            print(f"  {type_name:<10} - {desc}")
        
        print("\n【示例】")
        examples = [
            "feat(auth): add user registration",
            "fix(api): handle null pointer exception",
            "docs(readme): update installation guide",
            "refactor(user): simplify user model",
        ]
        
        for example in examples:
            print(f"  ✅ {example}")
        
        print("\n【详细示例】")
        detailed_example = """
feat(shopping-cart): add product quantity adjustment

- Allow users to increase/decrease product quantity
- Update total price in real-time
- Add quantity validation (min: 1, max: 99)

Closes #123
"""
        print(detailed_example)
    
    @staticmethod
    def branch_naming_conventions():
        """分支命名规范"""
        
        print("="*70)
        print("分支命名规范")
        print("="*70)
        
        conventions = [
            ("feature/", "feature/user-authentication", "新功能开发"),
            ("bugfix/", "bugfix/login-error", "Bug修复"),
            ("hotfix/", "hotfix/security-patch", "紧急修复"),
            ("release/", "release/v1.2.0", "发布分支"),
            ("refactor/", "refactor/database-layer", "代码重构"),
            ("test/", "test/integration-tests", "测试相关"),
        ]
        
        print(f"\n{'前缀':<12} {'示例':<35} {'用途':<20}")
        print("-"*70)
        
        for prefix, example, purpose in conventions:
            print(f"{prefix:<12} {example:<35} {purpose:<20}")
    
    @staticmethod
    def workflow_recommendations():
        """工作流推荐"""
        
        print("\n" + "="*70)
        print("Git工作流推荐")
        print("="*70)
        
        workflows = {
            "小团队(2-5人)": [
                "使用 GitHub Flow",
                "main 分支 + feature 分支",
                "通过 PR 进行代码审查",
                "自动化测试通过后合并"
            ],
            "中型团队(5-20人)": [
                "使用 Git Flow",
                "master + develop + feature/release/hotfix",
                "严格的发布流程",
                "定期版本发布"
            ],
            "大型团队(20+人)": [
                "使用 Trunk-Based Development",
                "短生命周期分支",
                "功能开关(Feature Flags)",
                "持续集成/持续部署"
            ]
        }
        
        for team_size, practices in workflows.items():
            print(f"\n【{team_size}】")
            for practice in practices:
                print(f"  • {practice}")
    
    @staticmethod
    def git_aliases():
        """常用Git别名"""
        
        print("\n" + "="*70)
        print("实用Git别名配置")
        print("="*70)
        
        aliases = [
            ("st", "status", "查看状态"),
            ("co", "checkout", "切换分支"),
            ("br", "branch", "分支管理"),
            ("ci", "commit", "提交"),
            ("unstage", "reset HEAD --", "取消暂存"),
            ("last", "log -1 HEAD", "查看最后一次提交"),
            ("visual", "log --graph --oneline --all", "可视化历史"),
            ("amend", "commit --amend --no-edit", "修改最后一次提交"),
        ]
        
        print("\n配置方法:")
        for short, full, desc in aliases:
            print(f"git config --global alias.{short} '{full}'  # {desc}")
        
        print("\n使用示例:")
        print("git st        # 等同于 git status")
        print("git visual    # 可视化提交历史")

# 展示最佳实践
bp = GitBestPractices()
bp.commit_message_guidelines()
bp.branch_naming_conventions()
bp.workflow_recommendations()
bp.git_aliases()
```

### 5.7 高级Git技巧

```python
class AdvancedGitTricks:
    """高级Git技巧"""
    
    @staticmethod
    def cherry_pick_example():
        """Cherry-pick: 挑选特定提交"""
        
        print("="*70)
        print("Cherry-pick: 挑选提交")
        print("="*70)
        
        print("\n场景: 将feature分支的某个修复应用到main")
        print("\n$ git checkout main")
        print("$ git cherry-pick abc1234")
        print("\n✅ 只挑选了一个提交，不合并整个分支")
    
    @staticmethod
    def bisect_example():
        """Bisect: 二分查找Bug"""
        
        print("\n" + "="*70)
        print("Bisect: 二分查找引入Bug的提交")
        print("="*70)
        
        print("\n$ git bisect start")
        print("$ git bisect bad              # 当前版本有bug")
        print("$ git bisect good v1.0        # v1.0版本正常")
        print("\n# Git自动切换到中间的提交")
        print("# 测试后标记...")
        print("$ git bisect good/bad")
        print("\n# 重复直到找到引入bug的提交")
        print("$ git bisect reset            # 结束bisect")
    
    @staticmethod
    def stash_example():
        """Stash: 暂存工作区"""
        
        print("\n" + "="*70)
        print("Stash: 暂存当前修改")
        print("="*70)
        
        print("\n场景: 需要紧急切换分支，但当前修改未完成")
        print("\n$ git stash save 'WIP: user profile page'")
        print("$ git checkout hotfix/urgent-bug")
        print("# 处理紧急bug...")
        print("$ git checkout feature/profile")
        print("$ git stash pop")
        print("\n✅ 恢复之前的工作状态")
    
    @staticmethod
    def reflog_example():
        """Reflog: 恢复丢失的提交"""
        
        print("\n" + "="*70)
        print("Reflog: 恢复操作历史")
        print("="*70)
        
        print("\n场景: 不小心删除了分支或重置了提交")
        print("\n$ git reflog")
        print("abc1234 HEAD@{0}: reset: moving to HEAD~")
        print("def5678 HEAD@{1}: commit: Add feature X")
        print("\n$ git checkout def5678")
        print("$ git checkout -b recovery-branch")
        print("\n✅ 成功恢复被删除的提交")

tricks = AdvancedGitTricks()
tricks.cherry_pick_example()
tricks.bisect_example()
tricks.stash_example()
tricks.reflog_example()
```

### 5.8 团队协作规范

```python
def team_collaboration_guide():
    """团队协作指南"""
    
    print("="*70)
    print("Git团队协作规范")
    print("="*70)
    
    print("\n【Pull Request流程】")
    pr_steps = [
        "1. 创建功能分支: git checkout -b feature/xxx",
        "2. 完成开发并提交: git commit -m 'xxx'",
        "3. 推送分支: git push origin feature/xxx",
        "4. 在GitHub/GitLab创建PR",
        "5. 填写PR描述(做了什么、为什么、如何测试)",
        "6. 请求代码审查",
        "7. 根据反馈修改代码",
        "8. 审查通过后合并",
        "9. 删除功能分支"
    ]
    
    for step in pr_steps:
        print(f"  {step}")
    
    print("\n【代码审查清单】")
    review_checklist = [
        "✓ 代码符合团队规范",
        "✓ 有适当的注释和文档",
        "✓ 测试覆盖率充足",
        "✓ 没有明显的性能问题",
        "✓ 没有安全漏洞",
        "✓ 提交信息清晰",
        "✓ 没有遗留的调试代码",
    ]
    
    for item in review_checklist:
        print(f"  {item}")
    
    print("\n【.gitignore最佳实践】")
    gitignore_example = """
# 依赖目录
node_modules/
venv/
__pycache__/

# IDE配置
.vscode/
.idea/
*.swp

# 构建输出
dist/
build/
*.pyc

# 环境变量
.env
.env.local

# 日志文件
*.log
logs/

# 操作系统文件
.DS_Store
Thumbs.db
"""
    print(gitignore_example)

team_collaboration_guide()
```

---

**本章完**
