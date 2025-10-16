const mongoose = require('mongoose');

// 从命令行参数获取MongoDB URI，或使用默认值
const MONGODB_URI = process.argv[2] || 'mongodb://localhost:27017/intellibuddy';

const ContentFileSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
}, { _id: false });

const GraphPositionSchema = new mongoose.Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
}, { _id: false });

const KnowledgePointSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subject: { type: String, required: true },
  contentSnippet: { type: String, required: true },
  content: { type: String, required: false },
  contentFiles: { type: [ContentFileSchema], required: false },
  status: { type: String, required: true },
  prerequisites: [{ type: String }],
  quiz: { type: Array, default: [] },
  difficulty: { type: Number, required: true },
  estimatedTime: { type: Number, required: true },
  graphPosition: { type: GraphPositionSchema, required: true },
});

const KnowledgePoint = mongoose.model('KnowledgePoint', KnowledgePointSchema);

async function checkKnowledgePoints() {
  try {
    console.log('连接到 MongoDB...');
    console.log(`URI: ${MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}\n`);
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ 连接成功\n');
    
    const points = await KnowledgePoint.find({}).sort({ id: 1 });
    
    console.log(`数据库中共有 ${points.length} 个知识点\n`);
    console.log('='.repeat(80));
    
    points.forEach((point, index) => {
      console.log(`\n${index + 1}. ${point.id}: ${point.title}`);
      console.log(`   学科: ${point.subject}`);
      console.log(`   前置依赖: ${point.prerequisites.length > 0 ? point.prerequisites.join(', ') : '无'}`);
      console.log(`   是否有content字段: ${point.content ? '是 (' + point.content.length + ' 字符)' : '否'}`);
      console.log(`   是否有contentFiles字段: ${point.contentFiles ? '是 (' + point.contentFiles.length + ' 个文件)' : '否'}`);
      
      if (point.contentFiles && point.contentFiles.length > 0) {
        console.log(`   文件列表:`);
        point.contentFiles.forEach((file, i) => {
          console.log(`     ${i + 1}. ${file.title} (${file.content.length} 字符)`);
        });
      }
    });
    
    console.log('\n' + '='.repeat(80));
    console.log('\n统计信息:');
    const withContent = points.filter(p => p.content && p.content.length > 0).length;
    const withContentFiles = points.filter(p => p.contentFiles && p.contentFiles.length > 0).length;
    const withoutContent = points.filter(p => (!p.content || p.content.length === 0) && (!p.contentFiles || p.contentFiles.length === 0)).length;
    
    console.log(`  - 有 content 字段的: ${withContent} 个`);
    console.log(`  - 有 contentFiles 字段的: ${withContentFiles} 个`);
    console.log(`  - 无内容的: ${withoutContent} 个`);
    
    await mongoose.connection.close();
    console.log('\n✅ 连接已关闭\n');
  } catch (error) {
    console.error('\n❌ 错误:', error.message);
    process.exit(1);
  }
}

checkKnowledgePoints();

