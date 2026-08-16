import express from "express";
import {
	registerUser,
	logInUser,
	logOutUser,
	getCurrentUser,
	changeAvatar,
	verifyNewUser,
	resendVerificationToken,
} from "../../controllers/usersController.js";
import auth from "../../middleware/auth.js";
import avatar from "../../middleware/avatar.js";

const router = express.Router();

router.get("/current", auth, getCurrentUser);
router.post("/register", registerUser);
router.get("/verify/:verifyToken", verifyNewUser);
router.post("/verify", resendVerificationToken);
router.post("/login", logInUser);
router.post("/logout", auth, logOutUser);
router.patch("/avatar", auth, avatar.single("avatar"), changeAvatar);
router.patch("/:id/avatar", auth, avatar.single("avatar"), changeAvatar);

export default router;
