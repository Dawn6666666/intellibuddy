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

---

**本章完**
