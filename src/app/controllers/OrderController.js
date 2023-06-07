import Order from "../models/Order.js";
import OrderStatus from "../models/OrderStatus.js";
import User from "../models/User.js";
import Book from "../models/Book.js";
import Cart from "../models/Cart.js";

class OrderController {
    // [POST] /orders/status
    async getAllByAdmin(req, res, next) {
        const { status } = req.query;

        let findCondition = {};

        if (status && parseInt(status) !== 1) {
            findCondition = { status: parseInt(status) };
        }

        const {
            pagination: { skippedItem, limit, page },
        } = req.filter;
        let totalItem;
        let totalPages;
        Order.countDocuments(findCondition, function (error, count) {
            if (error) return res.json({ error });

            totalItem = count;
            totalPages = Math.ceil(count / limit);
        });

        try {
            const orders = await Order.find(findCondition)
                .populate("status", "label")
                .populate("orderItems.book", "name price image slug")
                .skip(skippedItem)
                .limit(limit);

            res.status(200).json({
                data: {
                    results: orders,
                    page,
                    total_pages: totalPages,
                    total_results: totalItem,
                },
            });
        } catch (error) {
            next(error);
        }
    }

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
        const { userId } = req.user;

        let isOverStock;
        for (let i = 0; i < req.body.orderItems.length; i++) {
            const foundBook = await Book.findById(req.body.orderItems[i].book);
            if (foundBook.in_stock < req.body.orderItems[i].quantity) {
                isOverStock = true;
                break;
            }
        }

        if (isOverStock)
            return res.status(400).json({
                error: "Không thể tạo đơn hàng vì không đủ số lượng cung cấp.",
            });

        try {
            // Create Order
            const order = new Order(req.body);
            order.status = 2;
            await order.save();

            order.orderItems.forEach(async (item) => {
                const foundBook = await Book.findById(item.book);
                foundBook.in_stock -= item.quantity;
                foundBook.count_sell += item.quantity;
                await foundBook.save();

                await Cart.findOneAndDelete(
                    { user: userId, book: item.book },
                    { returnDocument: "after" }
                );
            });

            res.status(201).json({
                message: `Tạo đơn hàng thành công.`,
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
                .populate("orderItems.book", "name price image slug")
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
            const order = await Order.findById(id)
                .populate("status", "label")
                .populate("orderItems.book", "name price image slug");
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
                { status: parseInt(status) },
                { returnDocument: "after" }
            )
                .populate("status", "label")
                .populate("orderItems.book", "name price image slug");

            // Calculate point for user
            if (parseInt(status) === 5) {
                let point;
                const user = await User.findOne({ _id: userId });

                if (order.discount > 0) {
                    user.point = 0;
                    await user.save();
                }

                const pointFromOrder = Math.floor(
                    (order.itemsPrice * 10) / 100000
                );
                user.point += pointFromOrder;
                await user.save();
                point = user.point;

                res.status(200).json({
                    message: `Bạn vừa nhận được ${point} điểm`,
                    data: order,
                    point,
                });
                return;
            }

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
