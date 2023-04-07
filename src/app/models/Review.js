import mongoose from "mongoose";
import MongooseDelete from "mongoose-delete";

const Schema = mongoose.Schema;

const Review = new Schema(
    {
        content: { type: String, required: true },
        bookId: { type: Schema.Types.ObjectId, ref: "Book" },
        postedBy: { type: Schema.Types.ObjectId, ref: "User" },
        like: {
            users: [{ type: Schema.Types.ObjectId, ref: "User" }],
            total: { type: Number, min: 0, default: 0 },
        },
        dislike: {
            users: [{ type: Schema.Types.ObjectId, ref: "User" }],
            total: { type: Number, min: 0, default: 0 },
        },
    },
    { timestamps: true, collection: "reviews" }
);

// Add plugin
Review.plugin(MongooseDelete, { overrideMethods: "all", deletedAt: true });

export default mongoose.model("Review", Review);
