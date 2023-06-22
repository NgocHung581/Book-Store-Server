import mongoose from "mongoose";

async function connectDB() {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(
            "mongodb+srv://huynhngochung12092001:NgocHungne1209@cluster0.edn3dcd.mongodb.net/"
        );
        console.log("Database connected successfully");
    } catch (error) {
        console.log("connect failure");
    }
}

export { connectDB };
