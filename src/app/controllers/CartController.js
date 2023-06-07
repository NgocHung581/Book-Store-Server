import Cart from "../models/Cart.js";

class CartController {
    // [GET] /carts
    async getAll(req, res, next) {
        try {
            const { userId } = req.user;
            const carts = await Cart.find({ user: userId }).populate(
                "book",
                "name price image slug"
            );

            res.status(200).json({ data: carts });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // [POST] /carts
    async add(req, res, next) {
        try {
            const { userId } = req.user;
            const { bookId, quantity } = req.body;

            const existingCart = await Cart.findOne({
                user: userId,
                book: bookId,
            }).populate("book", "name price image slug");

            if (existingCart) {
                existingCart.quantity += quantity;
                await existingCart.save();
                return res.status(200).json({
                    message: "Cập nhật số lượng thành công",
                    data: existingCart,
                });
            }

            const newCart = await Cart.create({
                user: userId,
                book: bookId,
                quantity,
            });
            await newCart.populate("book", "name price image slug");
            res.status(201).json({
                message: "Bạn vừa thêm một sản phẩm vào giỏ hàng",
                data: newCart,
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // [PUT] /carts
    async update(req, res, next) {
        try {
            const { userId } = req.user;
            const { bookId, quantity } = req.body;

            const updatedCart = await Cart.findOneAndUpdate(
                { user: userId, book: bookId },
                { quantity },
                { returnDocument: "after" }
            ).populate("book", "name price image slug");
            res.status(200).json({
                message: "Cập nhật số lượng thành công",
                data: updatedCart,
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // [DELETE] /carts?id=
    async delete(req, res, next) {
        try {
            const { id } = req.query;

            const deletedCart = await Cart.findOneAndDelete(
                { _id: id },
                { returnDocument: "after" }
            );
            res.status(200).json({
                message: "Bạn vừa xóa một sản phẩm khỏi giỏ hàng",
                data: deletedCart,
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default new CartController();
