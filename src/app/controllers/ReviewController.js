import calculateTotalRating from "../../utils/calculateTotalRating.js";
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
            // Check existing review
            const { reviews } = await Book.findById(bookId).populate(
                "reviews",
                "postedBy"
            );
            const isAlreadyReviewed = reviews.find(
                (review) => review.postedBy.toString() === userId
            );
            if (isAlreadyReviewed)
                return res
                    .status(400)
                    .json({ error: "Sản phẩm này đã được bạn đánh giá" });

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

            book.totalRating = calculateTotalRating(book.reviews);
            await book.save();

            res.status(201).json({
                message: `Đánh giá thành công`,
            });
        } catch (error) {
            next(error);
        }
    }

    // [PUT] /reviews/:id
    async edit(req, res, next) {
        const { userId } = req.user;
        const { id } = req.params;
        const { rating, content } = req.body;

        if (!userId)
            return res
                .status(403)
                .json({ error: "Không thể xác thực người dùng này" });

        try {
            await Review.findByIdAndUpdate(
                id,
                {
                    content,
                    rating,
                },
                { returnDocument: "after" }
            );
            res.status(200).json({ message: "Cập nhật đánh giá thành công" });
        } catch (error) {
            next(error);
        }
    }

    // [DELETE] /reviews/:id?bookId=...
    async delete(req, res, next) {
        const { userId } = req.user;
        const { id } = req.params;
        const { bookId } = req.query;

        if (!userId)
            return res
                .status(403)
                .json({ error: "Không thể xác thực người dùng này" });

        try {
            const book = await Book.findById(bookId).populate(
                "reviews",
                "rating"
            );
            const newReviews = book.reviews.filter(
                (review) => review._id.toString() !== id
            );

            book.reviews = newReviews;
            book.totalRating = calculateTotalRating(newReviews);
            await book.save();
            await Review.findByIdAndDelete(id);
            res.status(200).json({ message: "Xóa đánh giá thành công" });
        } catch (error) {
            next(error);
        }
    }
}

export default new ReviewController();
