import User from "../models/User.js";

async function VerifyEmail(req, res, next) {
    const { email } = req.method == "GET" ? req.query : req.body;

    try {
        const existUser = await User.findOne({ email });
        if (!existUser)
            return res.json({
                status: 404,
                error: "Không tìm thấy người dùng",
            });
        next();
    } catch (error) {
        return res.json({ status: 404, error: "Lỗi xác thực" });
    }
}

export default VerifyEmail;
