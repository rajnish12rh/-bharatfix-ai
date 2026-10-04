import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  const uri = process.env["MONGODB_URI"]?.trim();

  if (!uri) {
    console.error(
      "MONGODB_URI is not set. Add it on one line in backend/.env, then restart the server."
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}
