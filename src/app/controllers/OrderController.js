import Order from "../models/Order.js";
import OrderStatus from "../models/OrderStatus.js";
import User from "../models/User.js";

class OrderController {
    // [POST] /orders
    async create(req, res, next) {
        try {
            const order = new Order(req.body);
            await order.save();
            let data;
            if (req.body.discount > 0) {
                const user = await User.findOne({ _id: req.body.userId });
                user.point = 0;
                await user.save();
                data = { user_point: user.point };
            }
            res.status(201).json({
                message: "Tạo đơn hàng thành công",
                data,
            });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /orders
    async getAll(req, res, next) {
        const { sortCondition, pagination } = req.filter;
        const { userId } = req.user;
        const { status } = req.query;

        if (!userId)
            return res.status(401).json({ error: "Người dùng không tồn tại" });
        try {
            const orders = await Order.find({ userId });
            res.status(200).json({ data: orders });
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
            const order = await Order.findById(id);
            res.status(200).json({ data: order });
        } catch (error) {
            next(error);
        }
    }
}

export default new OrderController();
