# 数据库系统 - (二)SQL核心语法

掌握SQL查询语言。

---

## 2. SQL核心语法

### 2.1 DDL（数据定义）

```sql
-- 创建表
CREATE TABLE Students (
    sid INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    age INT CHECK (age >= 0 AND age <= 150),
    major VARCHAR(50),
    UNIQUE (name, age)
);

-- 外键约束
CREATE TABLE Enrollments (
    eid INT PRIMARY KEY,
    sid INT,
    cid INT,
    grade DECIMAL(3, 1),
    FOREIGN KEY (sid) REFERENCES Students(sid) ON DELETE CASCADE,
    FOREIGN KEY (cid) REFERENCES Courses(cid)
);

-- 创建索引
CREATE INDEX idx_student_name ON Students(name);
CREATE UNIQUE INDEX idx_enrollment ON Enrollments(sid, cid);
```

### 2.2 DML（数据操纵）

#### 复杂查询

```sql
-- 子查询
SELECT name FROM Students 
WHERE sid IN (
    SELECT sid FROM Enrollments WHERE grade > 90
);

-- 相关子查询
SELECT s.name, s.age
FROM Students s
WHERE s.age > (
    SELECT AVG(age) FROM Students WHERE major = s.major
);

-- EXISTS
SELECT name FROM Students s
WHERE EXISTS (
    SELECT 1 FROM Enrollments e 
    WHERE e.sid = s.sid AND e.grade > 95
);
```

#### JOIN详解

```sql
-- INNER JOIN
SELECT s.name, e.grade 
FROM Students s 
INNER JOIN Enrollments e ON s.sid = e.sid;

-- LEFT JOIN
SELECT s.name, COALESCE(e.grade, 0) AS grade
FROM Students s
LEFT JOIN Enrollments e ON s.sid = e.sid;

-- CROSS JOIN
SELECT s.name, c.course_name
FROM Students s CROSS JOIN Courses c;
```

#### 聚合与分组

```sql
-- GROUP BY
SELECT major, AVG(age) AS avg_age, COUNT(*) AS count
FROM Students
GROUP BY major
HAVING COUNT(*) > 10;

-- 窗口函数
SELECT name, grade,
       RANK() OVER (PARTITION BY major ORDER BY grade DESC) AS rank
FROM Students JOIN Enrollments USING (sid);
```

### 2.3 高级SQL

#### 视图

```sql
-- 创建视图
CREATE VIEW HighAchievers AS
SELECT s.name, e.course, e.grade
FROM Students s JOIN Enrollments e ON s.sid = e.sid
WHERE e.grade > 90;

-- 使用视图
SELECT * FROM HighAchievers WHERE course = 'CS';
```

#### 存储过程

```sql
-- MySQL存储过程
DELIMITER //
CREATE PROCEDURE GetStudentGrades(IN student_id INT)
BEGIN
    SELECT c.course_name, e.grade
    FROM Enrollments e
    JOIN Courses c ON e.cid = c.cid
    WHERE e.sid = student_id;
END //
DELIMITER ;

CALL GetStudentGrades(1);
```

#### 触发器

```sql
-- 自动更新时间戳
CREATE TRIGGER update_timestamp
BEFORE UPDATE ON Students
FOR EACH ROW
SET NEW.updated_at = NOW();

-- 审计日志
CREATE TRIGGER audit_delete
AFTER DELETE ON Students
FOR EACH ROW
INSERT INTO AuditLog (action, sid, name, timestamp)
VALUES ('DELETE', OLD.sid, OLD.name, NOW());
```

### 2.4 窗口函数

窗口函数（Window Functions）是SQL的强大特性，用于在结果集中进行复杂的分析。

#### 2.4.1 基本窗口函数

```sql
-- ROW_NUMBER: 行号
SELECT 
    name,
    major,
    grade,
    ROW_NUMBER() OVER (PARTITION BY major ORDER BY grade DESC) AS row_num
FROM Students JOIN Enrollments USING (sid);

-- RANK: 排名（有并列，序号跳跃）
SELECT 
    name,
    grade,
    RANK() OVER (ORDER BY grade DESC) AS rank
FROM Students JOIN Enrollments USING (sid);

-- DENSE_RANK: 密集排名（有并列，序号连续）
SELECT 
    name,
    grade,
    DENSE_RANK() OVER (ORDER BY grade DESC) AS dense_rank
FROM Students JOIN Enrollments USING (sid);

-- NTILE: 分桶
SELECT 
    name,
    grade,
    NTILE(4) OVER (ORDER BY grade DESC) AS quartile
FROM Students JOIN Enrollments USING (sid);
```

#### 2.4.2 聚合窗口函数

```sql
-- 移动平均
SELECT 
    date,
    sales,
    AVG(sales) OVER (
        ORDER BY date 
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) AS moving_avg_3days
FROM Sales;

-- 累计求和
SELECT 
    date,
    sales,
    SUM(sales) OVER (ORDER BY date) AS cumulative_sales
FROM Sales;

-- 分组内占比
SELECT 
    name,
    major,
    grade,
    grade * 100.0 / SUM(grade) OVER (PARTITION BY major) AS pct_of_major
FROM Students JOIN Enrollments USING (sid);
```

#### 2.4.3 偏移窗口函数

```sql
-- LAG: 获取上一行的值
SELECT 
    date,
    sales,
    LAG(sales, 1) OVER (ORDER BY date) AS prev_sales,
    sales - LAG(sales, 1) OVER (ORDER BY date) AS sales_diff
FROM Sales;

-- LEAD: 获取下一行的值
SELECT 
    date,
    sales,
    LEAD(sales, 1) OVER (ORDER BY date) AS next_sales
FROM Sales;

-- FIRST_VALUE和LAST_VALUE
SELECT 
    name,
    major,
    grade,
    FIRST_VALUE(grade) OVER (
        PARTITION BY major 
        ORDER BY grade DESC
    ) AS top_grade,
    LAST_VALUE(grade) OVER (
        PARTITION BY major 
        ORDER BY grade DESC
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) AS bottom_grade
FROM Students JOIN Enrollments USING (sid);
```

#### 2.4.4 窗口框架（Frame）

```sql
-- ROWS模式：物理行
SELECT 
    date,
    sales,
    AVG(sales) OVER (
        ORDER BY date
        ROWS BETWEEN 3 PRECEDING AND 3 FOLLOWING
    ) AS avg_7days
FROM Sales;

-- RANGE模式：逻辑范围
SELECT 
    date,
    sales,
    SUM(sales) OVER (
        ORDER BY date
        RANGE BETWEEN INTERVAL '7' DAY PRECEDING AND CURRENT ROW
    ) AS sum_last_week
FROM Sales;
```

### 2.5 公共表表达式（CTE）

#### 2.5.1 基本CTE

```sql
-- 使用WITH定义CTE
WITH HighGrades AS (
    SELECT sid, AVG(grade) AS avg_grade
    FROM Enrollments
    GROUP BY sid
    HAVING AVG(grade) > 90
)
SELECT s.name, h.avg_grade
FROM Students s
JOIN HighGrades h ON s.sid = h.sid;

-- 多个CTE
WITH 
    MajorAvg AS (
        SELECT major, AVG(age) AS avg_age
        FROM Students
        GROUP BY major
    ),
    OldStudents AS (
        SELECT sid, name, age, major
        FROM Students
        WHERE age > 20
    )
SELECT o.name, o.age, m.avg_age
FROM OldStudents o
JOIN MajorAvg m ON o.major = m.major;
```

#### 2.5.2 递归CTE

```sql
-- 组织架构层级查询
WITH RECURSIVE EmployeeHierarchy AS (
    -- 基础查询（锚点成员）
    SELECT 
        emp_id,
        name,
        manager_id,
        1 AS level,
        CAST(name AS VARCHAR(1000)) AS path
    FROM Employees
    WHERE manager_id IS NULL
    
    UNION ALL
    
    -- 递归查询（递归成员）
    SELECT 
        e.emp_id,
        e.name,
        e.manager_id,
        eh.level + 1,
        CONCAT(eh.path, ' -> ', e.name)
    FROM Employees e
    JOIN EmployeeHierarchy eh ON e.manager_id = eh.emp_id
)
SELECT * FROM EmployeeHierarchy
ORDER BY level, emp_id;

-- 查找所有下属
WITH RECURSIVE Subordinates AS (
    SELECT emp_id, name
    FROM Employees
    WHERE emp_id = 1  -- 起始员工
    
    UNION ALL
    
    SELECT e.emp_id, e.name
    FROM Employees e
    JOIN Subordinates s ON e.manager_id = s.emp_id
)
SELECT * FROM Subordinates;

-- 路径查找（图遍历）
WITH RECURSIVE PathFinder AS (
    SELECT 
        from_node,
        to_node,
        cost,
        ARRAY[from_node] AS path,
        cost AS total_cost
    FROM Edges
    WHERE from_node = 'A'
    
    UNION ALL
    
    SELECT 
        e.from_node,
        e.to_node,
        e.cost,
        pf.path || e.from_node,
        pf.total_cost + e.cost
    FROM Edges e
    JOIN PathFinder pf ON e.from_node = pf.to_node
    WHERE NOT (e.from_node = ANY(pf.path))  -- 避免循环
)
SELECT * FROM PathFinder
WHERE to_node = 'Z';
```

#### 2.5.3 CTE实战案例

```sql
-- 案例1：查找连续登录天数
WITH LoginDates AS (
    SELECT 
        user_id,
        login_date,
        ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) AS rn,
        DATE_SUB(login_date, INTERVAL 
            ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) DAY
        ) AS grp
    FROM UserLogins
)
SELECT 
    user_id,
    MIN(login_date) AS streak_start,
    MAX(login_date) AS streak_end,
    COUNT(*) AS consecutive_days
FROM LoginDates
GROUP BY user_id, grp
HAVING COUNT(*) >= 3;

-- 案例2：层次聚合（汇总树）
WITH RECURSIVE CategoryTree AS (
    SELECT 
        category_id,
        category_name,
        parent_id,
        sales
    FROM Categories
    WHERE parent_id IS NULL
    
    UNION ALL
    
    SELECT 
        c.category_id,
        c.category_name,
        c.parent_id,
        c.sales
    FROM Categories c
    JOIN CategoryTree ct ON c.parent_id = ct.category_id
)
SELECT 
    category_id,
    category_name,
    SUM(sales) AS total_sales
FROM CategoryTree
GROUP BY category_id, category_name;
```

### 2.6 高级查询技巧

#### 2.6.1 CASE表达式

```sql
-- 简单CASE
SELECT 
    name,
    grade,
    CASE 
        WHEN grade >= 90 THEN 'A'
        WHEN grade >= 80 THEN 'B'
        WHEN grade >= 70 THEN 'C'
        WHEN grade >= 60 THEN 'D'
        ELSE 'F'
    END AS letter_grade
FROM Students JOIN Enrollments USING (sid);

-- 透视数据
SELECT 
    major,
    SUM(CASE WHEN gender = 'M' THEN 1 ELSE 0 END) AS male_count,
    SUM(CASE WHEN gender = 'F' THEN 1 ELSE 0 END) AS female_count
FROM Students
GROUP BY major;

-- 条件聚合
SELECT 
    major,
    AVG(CASE WHEN age < 20 THEN grade END) AS avg_grade_young,
    AVG(CASE WHEN age >= 20 THEN grade END) AS avg_grade_old
FROM Students JOIN Enrollments USING (sid)
GROUP BY major;
```

#### 2.6.2 集合操作

```sql
-- UNION: 并集（去重）
SELECT name FROM Students WHERE major = 'CS'
UNION
SELECT name FROM Students WHERE age > 20;

-- UNION ALL: 并集（保留重复）
SELECT name FROM Students WHERE major = 'CS'
UNION ALL
SELECT name FROM Students WHERE major = 'Math';

-- INTERSECT: 交集
SELECT sid FROM Enrollments WHERE cid = 101
INTERSECT
SELECT sid FROM Enrollments WHERE cid = 102;

-- EXCEPT: 差集
SELECT sid FROM Students
EXCEPT
SELECT sid FROM Enrollments;
```

#### 2.6.3 子查询优化

```sql
-- 标量子查询
SELECT 
    name,
    age,
    (SELECT AVG(age) FROM Students) AS avg_age,
    age - (SELECT AVG(age) FROM Students) AS age_diff
FROM Students;

-- 相关子查询转换为JOIN
-- ❌ 低效
SELECT name
FROM Students s
WHERE age > (
    SELECT AVG(age) 
    FROM Students 
    WHERE major = s.major
);

-- ✅ 高效
SELECT s.name
FROM Students s
JOIN (
    SELECT major, AVG(age) AS avg_age
    FROM Students
    GROUP BY major
) m ON s.major = m.major
WHERE s.age > m.avg_age;

-- EXISTS vs IN
-- 当子查询返回大量数据时，EXISTS通常更快
SELECT name
FROM Students s
WHERE EXISTS (
    SELECT 1
    FROM Enrollments e
    WHERE e.sid = s.sid AND e.grade > 90
);
```

#### 2.6.4 LATERAL连接

```sql
-- LATERAL允许子查询引用前面的表
SELECT 
    s.name,
    s.major,
    top_courses.course_name,
    top_courses.grade
FROM Students s
CROSS JOIN LATERAL (
    SELECT c.course_name, e.grade
    FROM Enrollments e
    JOIN Courses c ON e.cid = c.cid
    WHERE e.sid = s.sid
    ORDER BY e.grade DESC
    LIMIT 3
) AS top_courses;
```

### 2.7 JSON操作

```sql
-- MySQL JSON函数
-- 创建JSON
SELECT JSON_OBJECT(
    'name', name,
    'age', age,
    'major', major
) AS student_json
FROM Students;

-- 查询JSON
SELECT 
    data->>'$.name' AS name,
    data->>'$.age' AS age
FROM JsonTable;

-- JSON数组
SELECT JSON_ARRAYAGG(name) AS all_names
FROM Students;

-- 修改JSON
UPDATE JsonTable
SET data = JSON_SET(data, '$.age', 21)
WHERE id = 1;
```

### 2.8 SQL性能编写技巧

```python
def sql_best_practices():
    """
    SQL编写最佳实践
    """
    print("=" * 70)
    print("SQL性能编写技巧")
    print("=" * 70)
    
    tips = [
        ("避免SELECT *", "只选择需要的列", "SELECT name, age"),
        ("使用LIMIT", "限制返回行数", "SELECT * FROM t LIMIT 100"),
        ("避免子查询", "使用JOIN替代", "JOIN代替IN子查询"),
        ("使用EXISTS", "检查存在性", "EXISTS代替COUNT(*) > 0"),
        ("索引列", "WHERE/JOIN列加索引", "CREATE INDEX ON t(col)"),
        ("避免函数", "WHERE中不对列使用函数", "WHERE date >= '2024-01-01'"),
        ("批量操作", "使用批量INSERT", "INSERT INTO t VALUES (...), (...)"),
        ("分页优化", "使用游标分页", "WHERE id > last_id LIMIT 100"),
    ]
    
    print(f"\n{'技巧':<20} {'说明':<30} {'示例':<20}")
    print("-" * 70)
    
    for tip, desc, example in tips:
        print(f"{tip:<20} {desc:<30} {example:<20}")
    
    print("\n" + "=" * 70)
    print("常见SQL反模式")
    print("=" * 70)
    
    anti_patterns = [
        ("❌ SELECT * FROM large_table", "✅ SELECT id, name FROM large_table"),
        ("❌ WHERE YEAR(date) = 2024", "✅ WHERE date >= '2024-01-01' AND date < '2025-01-01'"),
        ("❌ OR导致索引失效", "✅ UNION ALL两个查询"),
        ("❌ OFFSET 10000 LIMIT 10", "✅ WHERE id > 10000 LIMIT 10"),
    ]
    
    print()
    for anti, fix in anti_patterns:
        print(f"{anti:<50} {fix}")

sql_best_practices()
```

---

**本章完**
