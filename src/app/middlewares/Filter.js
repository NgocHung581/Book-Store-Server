function Filter(req, res, next) {
    const {
        sortBy = "createdAt",
        type = "desc",
        page = 1,
        limit = 12,
    } = req.query;

    const sortCondition = { [sortBy]: type };

    const skippedItem = (parseInt(page) - 1) * parseInt(limit);
    const pagination = {
        skippedItem,
        limit: parseInt(limit),
        page: parseInt(page),
    };

    req.filter = { sortCondition, pagination };
    next();
}

export default Filter;
