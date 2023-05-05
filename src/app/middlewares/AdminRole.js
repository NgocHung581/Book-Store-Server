async function AdminRole(req, res, next) {
    try {
        const { role } = req.user;
        if (role === "admin") {
            next();
        } else {
            res.status(403).json({
                error: "Bạn không quyền để thực hiện tác vụ này!",
            });
        }
    } catch (error) {
        res.status(403).json({
            error: "Bạn không quyền để thực hiện tác vụ này!",
        });
    }
}

export default AdminRole;
