import express from "express";

import UploadFile from "../app/middlewares/UploadFile.js";
import UserController from "../app/controllers/UserController.js";
import LocalVariables from "../app/middlewares/LocalVariables.js";
import VerifyEmail from "../app/middlewares/VerifyEmail.js";
import Auth from "../app/middlewares/Auth.js";
import AdminRole from "../app/middlewares/AdminRole.js";
import Filter from "../app/middlewares/Filter.js";

const router = express.Router();

router.post("/registerMail", VerifyEmail, UserController.registerMail);
router.post("/resetPassword", VerifyEmail, UserController.resetPassword);
router.get("/verifyOTP", VerifyEmail, UserController.verifyOTP);
router.get(
    "/generateOTP",
    LocalVariables,
    VerifyEmail,
    UserController.generateOTP
);
router.put("/update/:email", Auth, AdminRole, UserController.updateByAdmin);
router.put("/update", Auth, UploadFile.single("avatar"), UserController.update);
router.post("/logout", UserController.logout);
router.post("/login", UserController.login);
router.post("/refresh", UserController.refreshToken);

router.delete("/favorite/:bookId", Auth, UserController.deleteFavorite);
router.post("/favorite", Auth, UserController.addFavorite);
router.get("/favorite", Auth, UserController.getFavorite);
router.get("/:email", UserController.getUser);

router.delete("/:id", Auth, AdminRole, UserController.delete);
router.post("/", UserController.create);
router.get("/", Auth, AdminRole, Filter, UserController.getAll);

export default router;
