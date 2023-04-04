import bookRouter from "./books.js";
import categoryRouter from "./categories.js";
import userRouter from "./users.js";
import orderRouter from "./orders.js";

const route = (app) => {
    app.use("/api/books", bookRouter);

    app.use("/api/categories", categoryRouter);

    app.use("/api/users", userRouter);

    app.use("/api/orders", orderRouter);
};

export default route;
