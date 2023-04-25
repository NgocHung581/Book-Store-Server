import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Search = new Schema(
    {
        id: { type: String },
        search: { type: String },
        start_eta: { type: String },
        results: { type: Array },
        status: { type: String },
    },
    { timestamps: true, collection: "amazon_searchs" }
);

export default mongoose.model("Search", Search);
