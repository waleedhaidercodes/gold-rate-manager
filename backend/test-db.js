require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;
console.log("Testing Connection to:");
// Mask password for safety in logs
console.log(uri.replace(/:([^@]+)@/, ':****@'));

mongoose.connect(uri)
  .then(() => {
    console.log("✅ SUCCESS: Connected to MongoDB Atlas!");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ FAILURE: Connection failed.");
    console.error("Error Name:", err.name);
    console.error("Error Message:", err.message);
    console.error("Error CodeName:", err.codeName);
    process.exit(1);
  });
