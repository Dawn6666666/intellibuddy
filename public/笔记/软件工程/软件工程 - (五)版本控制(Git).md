![(五)版本控制(Git)](https://via.placeholder.com/800x200?text=Git)

# 软件工程 - (五)版本控制(Git)

掌握Git版本控制。

---


```bash
# 基本工作流
git init
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

---

## 6. CI/CD