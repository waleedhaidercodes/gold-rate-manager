const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error.message.includes('whitelisted')) {
      console.error('❌ MongoDB Connection Failed: Access blocked by IP whitelist.');
      console.error('👉 ACTION REQUIRED: Go to MongoDB Atlas > Network Access and whitelist your current IP address.');
    } else {
      console.error(`Error: ${error.message}`);
    }
    process.exit(1);
  }
};

module.exports = connectDB;
