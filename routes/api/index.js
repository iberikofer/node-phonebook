import express from "express";
import usersRoutes from "./users.js";
import contactsRoutes from "./contacts.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

router.use("/users", usersRoutes);
router.use("/contacts", auth, contactsRoutes);

export default router;