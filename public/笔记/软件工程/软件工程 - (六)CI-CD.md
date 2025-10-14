![(六)CI-CD](https://via.placeholder.com/800x200?text=CI+CD)

# 软件工程 - (六)CI-CD

学习持续集成与部署。

---


### GitHub Actions配置

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Python
        uses: actions/setup-python@v2
        with:
          python-version: 3.9
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Run tests
        run: pytest
```

---

## 7. 23种设计模式详解