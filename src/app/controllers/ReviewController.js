import Review from "../models/Review.js";
import User from "../models/User.js";

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
        const { reviews } = req.body;

        if (!userId)
            return res
                .status(403)
                .json({ error: "Không thể xác thực người dùng này" });

        try {
            reviews.forEach(async (review) => {
                const newReview = new Review({
                    content: review.content,
                    bookId: review.bookId,
                    postedBy: userId,
                });
                await newReview.save();
            });

            const pointFromReview = reviews.length * 5;
            const user = await User.findById(userId);
            user.point += pointFromReview;
            await user.save();

            res.status(201).json({
                message: `Đánh giá thành công. Bạn vừa nhận thêm ${pointFromReview} điểm tích lũy`,
                data: {
                    user_point: user.point,
                },
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new ReviewController();
