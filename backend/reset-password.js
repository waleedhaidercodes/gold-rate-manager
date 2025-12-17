const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const connectDB = require('./src/config/db');

dotenv.config();

const resetPassword = async () => {
  const email = process.argv[2];
  const newPassword = process.argv[3];

  if (!email || !newPassword) {
    console.log('Usage: node reset-password.js <email> <new_password>');
    process.exit(1);
  }

  await connectDB();

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User not found with email: ${email}`);
      process.exit(1);
    }

    user.password = newPassword;
    await user.save();
    console.log(`Password for ${email} has been reset successfully.`);
  } catch (error) {
    console.error('Error resetting password:', error);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
};

resetPassword();
