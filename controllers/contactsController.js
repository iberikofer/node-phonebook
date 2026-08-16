import contactModel from "../models/contactsModel.js";

export async function getContacts(req, res, next) {
	try {
		const contacts = await contactModel.find({ ownerId: req.user.id }).exec();
		return res.status(200).send(contacts);
	} catch (error) {
		next(error);
	}
}

export async function getContactById(req, res, next) {
	try {
		const contact = await contactModel.findOne({ _id: req.params.id, ownerId: req.user.id }).exec();

		if (!contact) {
			return res.status(404).send({ message: "Contact is not found!" });
		}

		return res.status(200).send(contact);
	} catch (error) {
		next(error);
	}
}

export async function addContact(req, res, next) {
	const ownerId = req.user.id;
	const { name, email, phone, favorite } = req.body;

	try {
		const existingPhoneContact = await contactModel.findOne({ phone, ownerId }).exec();
		if (existingPhoneContact) {
			return res.status(400).send({ message: "Contact with this phone number already exists!" });
		}

		const newContact = { name, email, phone, favorite, ownerId };
		const contact = await contactModel.create(newContact);

		return res.status(201).send(contact);
	} catch (error) {
		next(error);
	}
}

export async function updateContact(req, res, next) {
	const { name, email, phone } = req.body;

	try {
		const result = await contactModel
			.findOneAndUpdate({ _id: req.params.id, ownerId: req.user.id }, { name, email, phone }, { new: true })
			.exec();

		if (!result) {
			return res.status(404).send({ message: "Contact is not found!" });
		}

		return res.send(result);
	} catch (error) {
		next(error);
	}
}

export async function updateFavoriteField(req, res, next) {
	try {
		const result = await contactModel
			.findOneAndUpdate({ _id: req.params.id, ownerId: req.user.id }, { favorite: req.body.favorite }, { new: true })
			.exec();

		if (!result) {
			return res.status(404).send({ message: "Contact is not found!" });
		}

		return res.send(result);
	} catch (error) {
		next(error);
	}
}

export async function removeContact(req, res, next) {
	try {
		const result = await contactModel.findOneAndDelete({ _id: req.params.id, ownerId: req.user.id }).exec();

		if (!result) {
			return res.status(404).send({ message: "Contact is not found!" });
		}

		return res.send(result);
	} catch (error) {
		next(error);
	}
}
