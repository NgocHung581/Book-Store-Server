import Category from "../models/Category.js";
import Book from "../models/Book.js";

class CategoryController {
    // [GET] /categories
    async getAll(req, res, next) {
        const {
            sortCondition,
            pagination: { skippedItem, limit, page },
        } = req.filter;
        let totalItem;
        let totalPages;
        Category.countDocuments({}, function (error, count) {
            if (error) return res.json({ error });

            totalItem = count;
            totalPages = Math.ceil(count / limit);
        });

        try {
            const categories = await Category.find({})
                .sort(sortCondition)
                .skip(skippedItem)
                .limit(limit);

            res.status(200).json({
                data: {
                    results: categories,
                    page,
                    total_pages: totalPages,
                    total_results: totalItem,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /categories/:slug
    async get(req, res, next) {
        const { slug } = req.params;

        try {
            const category = await Category.findOne({ slug });

            res.status(200).json({
                data: category,
            });
        } catch (error) {
            next(error);
        }
    }

    // [POST] /categories/create
    async create(req, res, next) {
        try {
            const category = new Category(req.body);

            await category.save();

            res.status(201).json({ message: "Bạn đã thêm thành công" });
        } catch (error) {
            next(error);
        }
    }

    // [PUT] /categories/:id
    async update(req, res, next) {
        try {
            await Category.findOneAndUpdate({ _id: req.params.id }, req.body);

            res.status(200).json({ message: "Bạn đã cập nhật thành công" });
        } catch (error) {
            next(error);
        }
    }

    // [DELETE] /categories/:id
    async delete(req, res, next) {
        const { id } = req.params;

        try {
            const books = await Book.find({});

            const isExistingBookInCategory = books.find(
                (book) => book.category.id === id
            );

            if (isExistingBookInCategory)
                return res.status(400).json({
                    error: "Không thể xóa vì vẫn còn sản phẩm trong danh mục",
                });

            await Category.findOneAndDelete({ _id: id });

            res.status(200).json({ message: "Bạn đã xóa thành công" });
        } catch (error) {
            next(error);
        }
    }
}

export default new CategoryController();
