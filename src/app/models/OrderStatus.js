import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";

const Schema = mongoose.Schema;

const OrderStatus = new Schema(
    {
        _id: { type: Number },
        label: { type: String, required: true },
    },
    { collection: "order_status", timestamps: true, _id: false }
);

// Add plugin
OrderStatus.plugin(AutoIncrement(mongoose));

export default mongoose.model("OrderStatus", OrderStatus);
