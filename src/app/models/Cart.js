import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Cart = new Schema(
    {
        user: { type: String, required: true, ref: "User" },
        book: { type: String, required: true, ref: "Book" },
        quantity: { type: Number, required: true },
    },
    { timestamps: true, collection: "carts" }
);

export default mongoose.model("Cart", Cart);
