import jwt from "jsonwebtoken";

async function Auth(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(401).json({
            error: "Hết phiên đăng nhập. Vui lòng đăng nhập lại!",
        });
    }
}

export default Auth;
