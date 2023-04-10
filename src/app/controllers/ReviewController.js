import Book from "../models/Book.js";
import Review from "../models/Review.js";

class ReviewController {
    // [POST] /reviews
    async create(req, res, next) {
        const { userId } = req.user;
        const { bookId, rating, content } = req.body;

        if (!userId)
            return res
                .status(403)
                .json({ error: "Không thể xác thực người dùng này" });

        try {
            // Review
            const newReview = new Review({
                content,
                bookId,
                rating,
                postedBy: userId,
            });
            await newReview.save();

            // Rating Book
            const book = await Book.findByIdAndUpdate(
                bookId,
                {
                    $push: { reviews: newReview._id },
                },
                { returnDocument: "after" }
            ).populate("reviews", "rating");

            const totalStar = book.reviews.reduce(
                (total, review) => total + review.rating,
                0
            );
            const ratingLength = book.reviews.length;
            book.totalRating = Math.round((totalStar / ratingLength) * 10) / 10;
            await book.save();

            res.status(201).json({
                message: `Đánh giá thành công.`,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new ReviewController();
