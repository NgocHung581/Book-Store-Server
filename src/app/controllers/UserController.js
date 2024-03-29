import bcrypt from "bcryptjs";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import User from "../models/User.js";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../../utils/generateToken.js";

class UserController {
    // [GET] /users/:email
    async getUser(req, res, next) {
        const { email } = req.params;

        try {
            const user = await User.findOne({ email });

            if (!user)
                return res.json({
                    status: 404,
                    error: "Không tìm thấy người dùng",
                });

            const data = {
                fullName: user.fullName,
                email: user.email,
                avatar: user.avatar,
                phone: user.phone,
                address: user.address,
                role: user.role,
            };

            res.status(200).json({ data });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /users
    async getAll(req, res, next) {
        const { role } = req.query;

        let findCondition = {};

        if (role) {
            findCondition = { role };
        }

        const {
            pagination: { skippedItem, limit, page },
        } = req.filter;
        let totalItem;
        let totalPages;
        User.countDocuments(findCondition, function (error, count) {
            if (error) return res.status(400).json({ error });

            totalItem = count;
            totalPages = Math.ceil(count / limit);
        });

        try {
            const users = await User.find(findCondition)
                .skip(skippedItem)
                .limit(limit);
            res.status(200).json({
                data: {
                    results: users,
                    page,
                    total_pages: totalPages,
                    total_results: totalItem,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    // [PUT] /users/update
    async update(req, res, next) {
        if (req.file) {
            req.body.avatar = req.file.filename;
        }
        const { userId } = req.user;

        try {
            if (userId) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: userId },
                    req.body,
                    { returnDocument: "after" }
                );

                res.status(201).json({
                    message: "Cập nhật thành công",
                    data: updatedUser,
                });
            } else {
                res.status(401).json({
                    error: "Không tìm thấy người dùng",
                });
            }
        } catch (error) {
            next(error);
        }
    }

    // [PUT] /users/update/:email
    async updateByAdmin(req, res, next) {
        const { email } = req.params;

        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                await User.findOneAndUpdate({ email }, req.body);
                res.status(201).json({
                    message: "Cập nhật thành công",
                });
            } else {
                res.status(401).json({
                    error: "Không tìm thấy người dùng",
                });
            }
        } catch (error) {
            next(error);
        }
    }

    // [POST] /users
    async create(req, res, next) {
        try {
            const existingUser = await User.findOne({ email: req.body.email });

            if (existingUser)
                return res.status(400).json({
                    error: "Người dùng đã tồn tại",
                });

            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const user = new User({ ...req.body, password: hashedPassword });

            await user.save();

            res.status(201).json({
                message: "Bạn đã đăng ký thành công",
            });
        } catch (error) {
            next(error);
        }
    }

    // [DELETE] /users/:id
    async delete(req, res, next) {
        const { id } = req.params;

        try {
            await User.findOneAndDelete({ _id: id });

            res.status(200).json({
                message: "Bạn đã xóa người dùng thành công",
            });
        } catch (error) {
            next(error);
        }
    }

    // [POST] /users/login
    async login(req, res, next) {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (user) {
                const matchPassword = await bcrypt.compare(
                    password,
                    user.password
                );

                if (matchPassword) {
                    const data = {
                        userId: user._id,
                        email: user.email,
                        role: user.role,
                    };
                    const accessToken = generateAccessToken(data);
                    const refreshToken = generateRefreshToken(data);

                    user.refreshToken = refreshToken;
                    await user.save();

                    const response = {
                        _id: user._id,
                        fullName: user.fullName,
                        email: user.email,
                        phone: user.phone,
                        address: user.address,
                        avatar: user.avatar,
                        point: user.point,
                        favorite: user.favorite,
                        role: user.role,
                        accessToken,
                        refreshToken,
                    };

                    res.json({
                        status: 200,
                        message: "Bạn đã đăng nhập thành công",
                        data: response,
                    });
                } else {
                    res.json({
                        status: 404,
                        error: "Mật khẩu không chính xác",
                    });
                }
            } else {
                res.json({
                    status: 404,
                    error: "Không tìm thấy người dùng này",
                });
            }
        } catch (error) {
            next(error);
        }
    }

    // [POST] /users/logout
    async logout(req, res, next) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken)
                return res
                    .status(401)
                    .json({ status: 401, error: "Lỗi xác thực" });

            const user = await User.findOne({ refreshToken });
            if (!user)
                return res.status(403).json({
                    status: 403,
                    error: "Không tìm thấy người dùng này",
                });

            user.refreshToken = "";
            await user.save();

            res.status(200).json({
                status: 200,
                message: "Bạn đã đăng xuất thành công",
            });
        } catch (error) {
            next(error);
        }
    }

    // [POST] /users/refresh
    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken)
                return res
                    .status(401)
                    .json({ status: 401, error: "Lỗi xác thực" });

            const user = await User.findOne({ refreshToken });
            if (!user)
                return res.status(403).json({
                    status: 403,
                    error: "Không tìm thấy người dùng này",
                });

            const { iat, ...restDecodedToken } = jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET
            );

            user.refreshToken = "";
            await user.save();

            const newAccessToken = generateAccessToken(restDecodedToken);
            const newRefreshToken = generateRefreshToken(restDecodedToken);

            user.refreshToken = newRefreshToken;
            await user.save();

            res.status(200).json({
                status: 200,
                data: {
                    newAccessToken,
                    newRefreshToken,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /users/generateOTP
    async generateOTP(req, res, next) {
        req.app.locals.OTP = otpGenerator.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });
        res.status(201).json({ status: 201, code: req.app.locals.OTP });
    }

    // [GET] /users/verifyOTP
    async verifyOTP(req, res, next) {
        const { code } = req.query;
        if (code === req.app.locals.OTP) {
            req.app.locals.OTP = null;
            req.app.locals.resetSession = true;
            return res.json({ status: 201, message: "Xác thực thành công" });
        }
        return res.json({ status: 400, error: "OTP không hợp lệ" });
    }

    // [POST] /users/resetPassword
    async resetPassword(req, res, next) {
        const { email, password } = req.body;

        if (!req.app.locals.resetSession)
            return res.json({
                status: 440,
                error: "Vui lòng xác thực để khôi phục mật khẩu",
            });

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.findOneAndUpdate(
                { email },
                { password: hashedPassword }
            );
            req.app.locals.resetSession = false;
            res.json({
                status: 201,
                message: "Cập nhật mật khẩu thành công",
            });
        } catch (error) {
            next(error);
        }
    }

    // [POST] /users/registerMail
    async registerMail(req, res, next) {
        const { fullName, email, text, subject } = req.body;

        const nodeConfig = {
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        };

        const transporter = nodemailer.createTransport(nodeConfig);

        const mailGenerator = new Mailgen({
            theme: "default",
            product: {
                name: "Mailgen",
                link: "https://mailgen.js/",
            },
        });

        const emailContent = {
            body: {
                name: fullName,
                intro: text,
                outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
            },
        };

        const emailBody = mailGenerator.generate(emailContent);

        const message = {
            from: process.env.MAIL_USERNAME,
            to: email,
            subject,
            html: emailBody,
        };

        // Send mail
        await transporter.sendMail(message);
        return res.json({
            status: 200,
            message: "Bạn vừa nhận được một email từ chúng tôi",
        });
    }

    // [GET] /users/favorite
    async getFavorite(req, res, next) {
        const { userId } = req.user;

        if (!userId) {
            return res
                .status(403)
                .json({ error: "Không thể xác thực người dùng này." });
        }

        try {
            const { favorite } = await User.findOne({ _id: userId })
                .populate("favorite")
                .select("favorite -_id");

            res.status(200).json({ data: favorite });
        } catch (error) {
            next(error);
        }
    }

    // [POST] /users/favorite
    async addFavorite(req, res, next) {
        const { userId } = req.user;
        const { bookId } = req.body;

        if (!userId) {
            return res
                .status(403)
                .json({ error: "Không thể xác thực người dùng này." });
        }

        try {
            const user = await User.findOne({ _id: userId });
            const existingFavoriteBook = user.favorite.find((item) =>
                item.equals(bookId)
            );

            if (existingFavoriteBook)
                return res.status(400).json({
                    error: "Sản phẩm này đã tồn tại trong danh sách yêu thích của bạn",
                });

            user.favorite.push(mongoose.Types.ObjectId(bookId));
            await user.save();

            res.status(201).json({
                message: "Bạn vừa thêm 1 sản phẩm vào danh sách yêu thích",
                data: user.favorite,
            });
        } catch (error) {
            next(error);
        }
    }

    // [DELETE] /users/favorite/:bookId
    async deleteFavorite(req, res, next) {
        const { userId } = req.user;
        const { bookId } = req.params;

        if (!userId) {
            return res
                .status(403)
                .json({ error: "Không thể xác thực người dùng này." });
        }

        try {
            const user = await User.findOne({ _id: userId });
            const existingFavoriteBook = user.favorite.find((item) =>
                item.equals(bookId)
            );

            if (!existingFavoriteBook)
                return res.status(400).json({
                    error: "Sản phẩm này không có trong danh sách yêu thích của bạn",
                });

            user.favorite = user.favorite.filter(
                (item) => !item.equals(bookId)
            );
            await user.save();

            res.status(200).json({
                message: "Bạn vừa xóa 1 sản phẩm khỏi danh sách yêu thích",
                data: user.favorite,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();
