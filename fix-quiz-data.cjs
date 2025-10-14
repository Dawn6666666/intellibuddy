const fs = require('fs');

// 读取原始数据
const data = JSON.parse(fs.readFileSync('knowledge-points-data.json', 'utf8'));

// 为每个知识点的测验题目添加explanation字段
data.forEach(point => {
  if (point.quiz && Array.isArray(point.quiz)) {
    point.quiz.forEach(question => {
      if (!question.explanation) {
        // 根据题目类型和正确答案生成简单的解释
        if (question.type === 'single') {
          const correctIndex = question.correctAnswer;
          const correctOption = question.options[correctIndex];
          question.explanation = `正确答案是：${correctOption}。这是该知识点的核心概念。`;
        } else if (question.type === 'multiple') {
          const correctIndices = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer];
          const correctOptions = correctIndices.map(index => question.options[index]);
          question.explanation = `正确答案包括：${correctOptions.join('、')}。这些都是该知识点的重要方面。`;
        } else if (question.type === 'boolean') {
          const isTrue = question.correctAnswer === 0 || question.correctAnswer === true;
          question.explanation = `这个说法是${isTrue ? '正确' : '错误'}的。请仔细理解相关概念。`;
        }
      }
    });
  }
});

// 写回文件
fs.writeFileSync('knowledge-points-data-fixed.json', JSON.stringify(data, null, 2), 'utf8');
console.log('已修复测验数据格式，保存为 knowledge-points-data-fixed.json');
