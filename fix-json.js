const fs = require('fs');

// 读取JSON文件
let data = fs.readFileSync('knowledge-points-data.json', 'utf-8');

// 替换中文引号为转义字符
data = data.replace(/"/g, '\\"').replace(/"/g, '\\"');

// 保存修复后的文件
fs.writeFileSync('knowledge-points-data.json', data, 'utf-8');

console.log('✅ JSON文件中的中文引号已修复！');

