# 数据库系统 - (七)高级SQL优化技巧

深入SQL性能优化。

---

## 7. 高级SQL优化技巧

### 7.1 慢查询分析

```sql
-- 开启慢查询日志（MySQL）
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;  -- 2秒

-- 查看慢查询
SHOW VARIABLES LIKE 'slow_query%';

-- 分析慢查询日志
-- mysqldumpslow /var/log/mysql/slow.log
```

**常见慢查询优化：**

```sql
-- ❌ 错误：SELECT *
SELECT * FROM orders WHERE user_id = 123;

-- ✅ 正确：只查询需要的列
SELECT order_id, total, created_at 
FROM orders WHERE user_id = 123;

-- ❌ 错误：隐式类型转换
SELECT * FROM users WHERE phone = 13800138000;  -- phone是VARCHAR

-- ✅ 正确
SELECT * FROM users WHERE phone = '13800138000';

-- ❌ 错误：OR导致全表扫描
SELECT * FROM products WHERE category_id = 1 OR price > 1000;

-- ✅ 正确：拆分为UNION
SELECT * FROM products WHERE category_id = 1
UNION
SELECT * FROM products WHERE price > 1000;
```

### 7.2 索引设计最佳实践

```sql
-- 1. 选择性高的列创建索引
CREATE INDEX idx_email ON users(email);  -- email重复率低

-- 2. 最左前缀原则
CREATE INDEX idx_user_date ON orders(user_id, order_date);

-- 使用索引：
SELECT * FROM orders WHERE user_id = 1;  ✅
SELECT * FROM orders WHERE user_id = 1 AND order_date > '2024-01-01';  ✅
SELECT * FROM orders WHERE order_date > '2024-01-01';  ❌ 不使用索引

-- 3. 覆盖索引
CREATE INDEX idx_user_total ON orders(user_id, total);

-- 不需要回表
SELECT total FROM orders WHERE user_id = 1;

-- 4. 前缀索引（节省空间）
CREATE INDEX idx_title ON articles(title(20));  -- 只索引前20个字符
```

### 7.3 查询重写技巧

```sql
-- 1. 使用JOIN代替子查询
-- ❌ 慢
SELECT * FROM orders 
WHERE user_id IN (SELECT id FROM users WHERE status = 'active');

-- ✅ 快
SELECT o.* FROM orders o
INNER JOIN users u ON o.user_id = u.id
WHERE u.status = 'active';

-- 2. 避免COUNT(*)在大表
-- ❌ 慢
SELECT COUNT(*) FROM orders WHERE status = 'pending';

-- ✅ 快：使用近似值（Redis计数）或预聚合表

-- 3. 分页优化
-- ❌ 深分页慢
SELECT * FROM products ORDER BY id LIMIT 100000, 20;

-- ✅ 使用上次的最大ID
SELECT * FROM products WHERE id > 100020 ORDER BY id LIMIT 20;
```

---

**本章完**
