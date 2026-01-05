const app = require("../backend/server");
const connectDB = require("../backend/src/config/db");

module.exports = async (req, res) => {
  try {
    console.log("Function invoked");
    console.log("MONGO_URI defined:", !!process.env.MONGO_URI);

    await connectDB();
    console.log("DB Connected");

    return app(req, res);
  } catch (error) {
    console.error("Vercel Function Crash:", error);
    // Return the error to the client for debugging (remove in final prod)
    res.status(500).json({
      error: "Serverless Function Crash",
      details: error.message,
      stack: error.stack,
    });
  }
};
