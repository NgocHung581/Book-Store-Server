import bookRouter from "./books.js";
import reviewRouter from "./reviews.js";
import categoryRouter from "./categories.js";
import userRouter from "./users.js";
import orderRouter from "./orders.js";
import chatRouter from "./chats.js";
import amazonSearchRouter from "./amazon-searchs.js";

const route = (app) => {
    app.use("/api/books", bookRouter);

    app.use("/api/reviews", reviewRouter);

    app.use("/api/categories", categoryRouter);

    app.use("/api/users", userRouter);

    app.use("/api/orders", orderRouter);

    app.use("/api/chats", chatRouter);

    app.use("/api/amazon", amazonSearchRouter);
};

export default route;
