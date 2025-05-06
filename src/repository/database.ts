import mongoose from "mongoose";

let isConnected = false;

export async function connect() {
  if (isConnected) return;

  try {
    if (!process.env.DBHOST) {
      throw new Error("⚠️ Environment variable DBHOST is not defined.");
    }

    await mongoose.connect(process.env.DBHOST);

    if (mongoose.connection.db) {
      await mongoose.connection.db.admin().command({ ping: 1 });
      console.log("✅ DB connection is established.");
      isConnected = true;
    } else {
      throw new Error("❌ DB connection failed without a specific reason.");
    }
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
    process.exit(1);
  }
}
