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
import validateBody from "../../middleware/validateBody.js";
import { authLimiter } from "../../middleware/rateLimiter.js";
import userRegistrationSchema from "../../validation/userRegistrationSchema.js";
import userLoginSchema from "../../validation/userLoginSchema.js";
import emailVerificationSchema from "../../validation/emailVerificationSchema.js";

const router = express.Router();

router.get("/current", auth, getCurrentUser);
router.post("/register", authLimiter, validateBody(userRegistrationSchema), registerUser);
router.get("/verify/:verifyToken", verifyNewUser);
router.post("/verify", authLimiter, validateBody(emailVerificationSchema), resendVerificationToken);
router.post("/login", authLimiter, validateBody(userLoginSchema), logInUser);
router.post("/logout", auth, logOutUser);
router.patch("/avatar", auth, avatar.single("avatar"), changeAvatar);
router.patch("/:id/avatar", auth, avatar.single("avatar"), changeAvatar);

export default router;
