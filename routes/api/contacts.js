import express from "express";
import {
	getContacts,
	getContactById,
	removeContact,
	addContact,
	updateContact,
	updateFavoriteField,
} from "../../controllers/contactsController.js";
import validateBody from "../../middleware/validateBody.js";
import contactSchema from "../../validation/contactValidationSchema.js";
import contactFavoriteSchema from "../../validation/contactFavoriteSchema.js";

const router = express.Router();

router.get("/", getContacts);
router.get("/:id", getContactById);
router.post("/", validateBody(contactSchema), addContact);
router.delete("/:id", removeContact);
router.put("/:id", validateBody(contactSchema), updateContact);
router.patch("/:id/favorite", validateBody(contactFavoriteSchema), updateFavoriteField);

export default router;
