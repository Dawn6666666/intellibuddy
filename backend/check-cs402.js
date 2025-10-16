const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

async function checkCS402() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('数据库连接成功\n');
    
    const doc = await mongoose.connection.db.collection('knowledgepoints').findOne({ id: 'cs402' });
    
    if (doc) {
      console.log('CS402 (分布式系统) 信息:');
      console.log('  标题:', doc.title);
      console.log('  前置课程:', doc.prerequisites);
      console.log('\n✅ 前置课程已正确更新为 cs203');
    } else {
      console.log('❌ 未找到 cs402');
    }
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('错误:', error);
    process.exit(1);
  }
}

checkCS402();

