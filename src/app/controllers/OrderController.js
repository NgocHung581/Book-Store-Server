import Order from "../models/Order.js";
import OrderStatus from "../models/OrderStatus.js";
import User from "../models/User.js";
import Book from "../models/Book.js";

class OrderController {
    // [POST] /orders/status
    async createOrderStatus(req, res, next) {
        try {
            const status = new OrderStatus(req.body);
            await status.save();

            res.status(201).json({
                message: "Thêm trạng thái đơn hàng thành công",
            });
        } catch (error) {
            next(error);
        }
    }
    // [GET] /orders/status
    async getAllOrderStatus(req, res, next) {
        try {
            const orderStatus = await OrderStatus.find({}).select("label");

            res.status(200).json({
                data: orderStatus.map((status) => ({
                    value: status._id,
                    label: status.label,
                })),
            });
        } catch (error) {
            next(error);
        }
    }

    // [POST] /orders
    async create(req, res, next) {
        let isOverStock;
        for (let i = 0; i < req.body.orderItems.length; i++) {
            const book = await Book.findById(req.body.orderItems[i].id);
            if (book.in_stock < req.body.orderItems[i].quantity) {
                isOverStock = true;
                break;
            }
        }

        if (isOverStock)
            return res.status(400).json({
                error: "Không thể tạo đơn hàng vì không đủ số lượng cung cấp.",
            });

        try {
            const order = new Order(req.body);
            order.status = 2;
            await order.save();

            order.orderItems.forEach(async (item) => {
                const book = await Book.findById(item.id);
                book.in_stock -= item.quantity;
                book.count_sell += item.quantity;
                await book.save();
            });

            const user = await User.findOne({ _id: req.body.userId });

            if (req.body.discount > 0) {
                user.point = 0;
                await user.save();
            }

            const pointFromOrder = Math.floor((order.itemsPrice * 10) / 100000);
            user.point += pointFromOrder;
            await user.save();
            const data = { user_point: user.point };

            res.status(201).json({
                message: `Tạo đơn hàng thành công. Bạn vừa được nhận thêm ${pointFromOrder} điểm`,
                data,
            });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /orders
    async getAll(req, res, next) {
        const {
            sortCondition,
            pagination: { skippedItem, limit, page },
        } = req.filter;
        const { userId } = req.user;
        const { status } = req.query;

        let findCondition = { userId };
        if (status && parseInt(status) !== 1) {
            findCondition = { ...findCondition, status: parseInt(status) };
        }

        if (!userId)
            return res.status(401).json({ error: "Người dùng không tồn tại" });

        try {
            let totalItem;
            let totalPages;
            Order.countDocuments(findCondition, function (error, count) {
                if (error) return res.json({ error });

                totalItem = count;
                totalPages = Math.ceil(count / parseInt(limit));
            });

            const orders = await Order.find(findCondition)
                .populate("status", "label")
                .sort(sortCondition)
                .skip(skippedItem)
                .limit(limit);
            res.status(200).json({
                data: {
                    results: orders,
                    page: parseInt(page),
                    total_pages: totalPages,
                    total_results: totalItem,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /orders/:id
    async get(req, res, next) {
        const { userId } = req.user;
        if (!userId)
            return res.status(401).json({ error: "Người dùng không tồn tại" });
        try {
            const { id } = req.params;
            const order = await Order.findById(id).populate("status", "label");
            res.status(200).json({ data: order });
        } catch (error) {
            next(error);
        }
    }

    // [PUT] /orders/:id
    async updateStatus(req, res, next) {
        const { userId } = req.user;
        const { status } = req.body;
        if (!userId)
            return res.status(401).json({ error: "Người dùng không tồn tại" });
        try {
            const { id } = req.params;
            const order = await Order.findByIdAndUpdate(
                id,
                { status },
                { returnDocument: "after" }
            ).populate("status", "label");
            res.status(200).json({
                message: "Bạn vừa cập nhật đơn hàng thành công",
                data: order,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new OrderController();
