import mongoose from "mongoose";
import MongooseDelete from "mongoose-delete";
import slug from "mongoose-slug-generator";

const Schema = mongoose.Schema;

const Category = new Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, unique: true, slug: "name" },
    },
    { timestamps: true, collection: "categories" }
);

// Add plugin
mongoose.plugin(slug);
Category.plugin(MongooseDelete, { overrideMethods: "all", deletedAt: true });

export default mongoose.model("Category", Category);
