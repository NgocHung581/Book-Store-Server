import mongoose from "mongoose";
import MongooseDelete from "mongoose-delete";

const Schema = mongoose.Schema;

const Review = new Schema(
    {
        content: { type: String, required: true },
        bookId: { type: Schema.Types.ObjectId, ref: "Book" },
        rating: { type: Number, required: true },
        postedBy: { type: Schema.Types.ObjectId, ref: "User" },
        like: [{ type: Schema.Types.ObjectId, ref: "User" }],
        dislike: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true, collection: "reviews" }
);

// Add plugin
Review.plugin(MongooseDelete, { overrideMethods: "all", deletedAt: true });

export default mongoose.model("Review", Review);
