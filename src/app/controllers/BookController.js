import Book from "../models/Book.js";
import Review from "../models/Review.js";
import User from "../models/User.js";

class BookController {
    // [GET] /books?page=...&limit=...
    async getAll(req, res, next) {
        const {
            sortCondition,
            pagination: { skippedItem, limit, page },
        } = req.filter;
        let totalItem;
        let totalPages;
        Book.countDocuments({}, function (error, count) {
            if (error) return res.json({ error });

            totalItem = count;
            totalPages = Math.ceil(count / parseInt(limit));
        });
        try {
            const books = await Book.find({})
                .sort(sortCondition)
                .skip(skippedItem)
                .limit(limit);
            res.status(200).json({
                data: {
                    results: books,
                    page: parseInt(page),
                    total_pages: totalPages,
                    total_results: totalItem,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /books/feature?type=...&limit=...
    async getFeature(req, res, next) {
        try {
            let condition;
            let limit;

            switch (req.query.type) {
                case "rating":
                    condition = { totalRating: { $gte: 4 } };
                    limit = req.query.limit;
                    break;
                case "slider":
                    condition = { slider: true };
                    limit = req.query.limit;
                    break;
                case req.query.type:
                    condition = { "category.slug": req.query.type };
                    limit = req.query.limit;
                    break;
                default:
                    condition = {};
                    break;
            }

            const books = await Book.find(condition).limit(limit);
            res.status(200).json({ data: books });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /books/:slug
    async get(req, res, next) {
        try {
            const book = await Book.findOne({ slug: req.params.slug });
            res.status(200).json({ data: book });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /books/category/:slug?page=...&limit=...&sortBy=[field]&type=[asc | desc]
    async getSpecificCategory(req, res, next) {
        const {
            sortCondition,
            pagination: { skippedItem, limit, page },
        } = req.filter;

        let totalItem;
        let totalPages;
        Book.countDocuments(
            {
                "category.slug": req.params.slug,
            },
            function (error, count) {
                if (error) return res.json({ error });

                totalItem = count;
                totalPages = Math.ceil(count / parseInt(limit));
            }
        );

        try {
            const books = await Book.find({
                "category.slug": req.params.slug,
            })
                .sort(sortCondition)
                .skip(skippedItem)
                .limit(limit);
            res.status(200).json({
                data: {
                    results: books,
                    page: parseInt(page),
                    total_pages: totalPages,
                    total_results: totalItem,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /books/search?q=
    async search(req, res, next) {
        const {
            sortCondition,
            pagination: { skippedItem, limit, page },
        } = req.filter;

        let totalItem;
        let totalPages;
        Book.countDocuments(
            {
                name: { $regex: "^" + req.query.q, $options: "i" },
            },
            function (error, count) {
                if (error) return res.json({ error });

                totalItem = count;
                totalPages = Math.ceil(count / parseInt(limit));
            }
        );

        try {
            const books = await Book.find({
                name: { $regex: "^" + req.query.q, $options: "i" },
            })
                .sort(sortCondition)
                .skip(skippedItem)
                .limit(limit);

            res.status(200).json({
                data: {
                    results: books,
                    page: parseInt(page),
                    total_pages: totalPages,
                    total_results: totalItem,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    // [POST] /books
    async create(req, res, next) {
        req.body.image = req.file.filename;
        try {
            const book = new Book(req.body);

            const response = await book.save();

            res.status(200).json({
                message: "Bạn đã thêm thành công",
                data: response,
            });
        } catch (error) {
            next(error);
        }
    }

    // [PUT] /books/:id
    async update(req, res, next) {
        try {
            const response = await Book.findOneAndUpdate(
                { _id: req.params.id },
                req.body
            );

            res.status(200).json({
                message: "Bạn đã chỉnh sửa thành công",
                data: response,
            });
        } catch (error) {
            next(error);
        }
    }

    // [DELETE] /books/:id
    async delete(req, res, next) {
        try {
            await Book.findOneAndDelete({ _id: req.params.id });

            res.status(200).json({ message: "Bạn đã xóa thành công" });
        } catch (error) {
            next(error);
        }
    }

    // [POST] /books/rating
    async rating(req, res, next) {
        const { userId } = req.user;
        const { bookId, star } = req.body;

        if (!userId)
            return res
                .status(403)
                .json({ error: "Không thể xác thực người dùng này" });

        try {
            const book = await Book.findByIdAndUpdate(
                bookId,
                {
                    $push: { rating: { star, userId } },
                },
                { returnDocument: "after" }
            );

            const totalStar = book.rating.reduce(
                (total, item) => total + item.star,
                0
            );
            const ratingLength = book.rating.length;
            book.totalRating = Math.round(totalStar / ratingLength);
            await book.save();

            res.status(201).json({
                message: "Đánh giá thành công",
                data: book,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new BookController();
