import express from "express";
import {
	getContacts,
	getContactById,
	removeContact,
	addContact,
	updateContact,
	updateFavoriteField,
} from "../../controllers/contactsController.js";

const router = express.Router();

router.get("/", getContacts);
router.get("/:id", getContactById);
router.post("/", addContact);
router.delete("/:id", removeContact);
router.put("/:id", updateContact);
router.patch("/:id/favorite", updateFavoriteField);

export default router;
