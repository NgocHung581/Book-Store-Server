import jwt from "jsonwebtoken";

export const generateAccessToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export const generateRefreshToken = (data) => {
    return jwt.sign(data, process.env.JWT_REFRESH_SECRET);
};
