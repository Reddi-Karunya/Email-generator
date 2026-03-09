const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function clearDB() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/emailgen';
    console.log(`Connecting to ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    
    // In MongoDB, we can drop the database or individual collections
    const db = mongoose.connection.db;
    
    const collections = await db.listCollections().toArray();
    for (let collection of collections) {
      console.log(`Dropping collection: ${collection.name}`);
      await db.dropCollection(collection.name);
    }
    
    console.log('✅ Database cleared successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to clear database:', err.message);
    process.exit(1);
  }
}

clearDB();
