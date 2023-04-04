import mongoose from "mongoose";
import MongooseDelete from "mongoose-delete";
import slug from "mongoose-slug-generator";

const Schema = mongoose.Schema;

const User = new Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        address: { type: String, default: "" },
        phone: { type: String, default: "" },
        avatar: { type: String, default: "" },
        point: { type: Number, default: 0 },
        role: { type: String, default: "user" },
        refreshToken: { type: String, default: "" },
    },
    { timestamps: true, collection: "users" }
);

// Add plugin
mongoose.plugin(slug);
User.plugin(MongooseDelete, { overrideMethods: "all", deletedAt: true });

export default mongoose.model("User", User);
