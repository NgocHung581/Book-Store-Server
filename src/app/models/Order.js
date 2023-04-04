import mongoose from "mongoose";
import MongooseDelete from "mongoose-delete";
import slug from "mongoose-slug-generator";

const Schema = mongoose.Schema;

const Order = new Schema(
    {
        orderItems: [
            {
                name: { type: String, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                quantity: { type: Number, required: true },
                slug: { type: String, required: true },
                id: {
                    type: Schema.Types.ObjectId,
                    ref: "Book",
                    required: true,
                },
            },
        ],
        shippingInformation: {
            fullName: { type: String, required: true },
            email: { type: String, required: true },
            address: { type: String, required: true },
            phone: { type: String, required: true },
        },
        paymentMethod: { type: String, required: true },
        itemsPrice: { type: Number, required: true },
        discount: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        isPaid: { type: Boolean, default: false },
        paidAt: { type: Date },
        isDelivered: { type: Boolean, default: false },
        deliveredAt: { type: Date },
        status: { type: String, default: "Pending" },
        date: { type: String, required: true },
    },
    { timestamps: true, collection: "orders" }
);

// Add plugin
mongoose.plugin(slug);
Order.plugin(MongooseDelete, { overrideMethods: "all", deletedAt: true });

export default mongoose.model("Order", Order);
