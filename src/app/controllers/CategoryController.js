import Category from "../models/Category.js";

class CategoryController {
    // [GET] /categories
    async getAll(req, res, next) {
        try {
            const categories = await Category.find({});

            res.json({ status: 200, data: categories });
        } catch (error) {
            next(error);
        }
    }

    // [POST] /categories/create
    async create(req, res, next) {
        try {
            const category = new Category(req.body);

            await category.save();

            res.json({ message: "Bạn đã thêm thành công" });
        } catch (error) {
            next(error);
        }
    }

    // [PUT] /categories/:id
    async update(req, res, next) {
        try {
            await Category.findOneAndUpdate({ _id: req.params.id }, req.body);

            res.json({ message: "Bạn đã cập nhật thành công" });
        } catch (error) {
            next(error);
        }
    }

    // [DELETE] /categories/:id
    async delete(req, res, next) {
        try {
            await Category.findOneAndDelete({ _id: req.params.id });

            res.json({ message: "Bạn đã xóa thành công" });
        } catch (error) {
            next(error);
        }
    }
}

export default new CategoryController();
