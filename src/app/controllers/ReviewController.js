import Book from "../models/Book.js";
import Review from "../models/Review.js";

class ReviewController {
    // [GET] /reviews/:bookId
    async getAll(req, res, next) {
        const { bookId } = req.params;

        try {
            const reviews = await Review.find({ bookId }).populate(
                "postedBy",
                "avatar fullName"
            );
            res.status(200).json({ data: reviews });
        } catch (error) {
            next(error);
        }
    }

    // [POST] /reviews
    async create(req, res, next) {
        const { userId } = req.user;
        const { bookId, star, content } = req.body;

        if (!userId)
            return res
                .status(403)
                .json({ error: "Không thể xác thực người dùng này" });

        try {
            // Rating Book
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

            // Review
            const newReview = new Review({
                content,
                bookId,
                postedBy: userId,
            });
            await newReview.save();

            res.status(201).json({
                message: `Đánh giá thành công.`,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new ReviewController();
