# 数据库系统 - (六)NoSQL数据库

学习NoSQL数据库。

---

## 6. NoSQL数据库

### 6.1 MongoDB（文档数据库）

```javascript
// 插入文档
db.students.insertOne({
    name: "Alice",
    age: 20,
    courses: ["Math", "CS"],
    address: {
        city: "Beijing",
        street: "中关村"
    }
});

// 查询
db.students.find({ age: { $gt: 18 } });

// 聚合
db.students.aggregate([
    { $match: { age: { $gt: 18 } } },
    { $group: { _id: "$major", count: { $sum: 1 } } }
]);
```

### 6.2 Redis（键值数据库）

```python
import redis

r = redis.Redis(host='localhost', port=6379)

# 字符串
r.set('name', 'Alice')
print(r.get('name'))

# 列表
r.lpush('tasks', 'task1', 'task2')
print(r.lrange('tasks', 0, -1))

# 哈希
r.hset('user:1', mapping={'name': 'Alice', 'age': 20})
print(r.hgetall('user:1'))

# 集合
r.sadd('tags', 'python', 'java', 'c++')
print(r.smembers('tags'))
```

---

**本章完**
