const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { runSeed } = require('../seed');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2000 });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error.message.includes('ECONNREFUSED')) {
      console.log('Local MongoDB not found. Starting in-memory MongoDB server...');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);

      // Auto-seed the database so it's ready for immediate use
      await runSeed();

      // Store reference to close it gracefully later if needed
      mongoose.connection.on('disconnected', async () => {
        await mongoServer.stop();
      });
    } else {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
