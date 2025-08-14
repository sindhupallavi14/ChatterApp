import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUrl = process.env.MONGO_URL;

  try {
    if (!mongoUrl) {
      throw new Error(
        "MONGO_URL is not set. Create a .env file in the project root."
      );
    }

    await mongoose.connect(mongoUrl);

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message || error);
  }
};

export default connectDB;
