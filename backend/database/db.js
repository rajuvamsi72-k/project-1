const mongoose = require("mongoose");
const { DB_NAME } = require("../constants");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
