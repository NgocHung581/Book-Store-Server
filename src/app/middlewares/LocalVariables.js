function LocalVariables(req, res, next) {
    req.app.locals = {
        OTP: null,
        resetSession: false,
    };
    next();
}

export default LocalVariables;
