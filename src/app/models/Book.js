import mongoose from "mongoose";
import MongooseDelete from "mongoose-delete";
import slug from "mongoose-slug-generator";

const Schema = mongoose.Schema;

const Book = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        image: { type: String },
        author: { type: String, required: true },
        price: { type: Number, required: true },
        category: {
            id: { type: String, required: true },
            slug: { type: String, required: true },
        },
        reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
        totalRating: { type: Number, default: 0 },
        slider: { type: Boolean, default: false },
        count_sell: { type: Number, default: 0 },
        in_stock: { type: Number, required: true },
        slug: { type: String, unique: true, slug: "name" },
    },
    { timestamps: true, collection: "books" }
);

// Add plugin
mongoose.plugin(slug);
Book.plugin(MongooseDelete, { overrideMethods: "all", deletedAt: true });

export default mongoose.model("Book", Book);
