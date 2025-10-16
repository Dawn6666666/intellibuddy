const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

async function listAllKnowledgePoints() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('数据库连接成功\n');
    
    const docs = await mongoose.connection.db.collection('knowledgepoints').find({}).sort({ year: 1, id: 1 }).toArray();
    
    console.log(`数据库中的知识点数量: ${docs.length}\n`);
    console.log('所有知识点ID和标题:');
    console.log('='.repeat(60));
    
    let currentYear = null;
    docs.forEach(d => {
      if (d.year !== currentYear) {
        currentYear = d.year;
        console.log(`\n第${d.year}学年:`);
      }
      console.log(`  ${d.id}: ${d.title}`);
    });
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('错误:', error);
    process.exit(1);
  }
}

listAllKnowledgePoints();

