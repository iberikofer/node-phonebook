import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import Jimp from "jimp";
import userModel from "../models/usersModel.js";
import sendVerificationEmail from "../mail/transport.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function registerUser(req, res, next) {
	const { name, email, password, subscription } = req.body;

	const user = await userModel.findOne({ email }).exec();
	if (user !== null) {
		return res.status(409).send({ message: "This email is already is use!" });
	}

	try {
		const passwordHash = await bcrypt.hash(password, 10);
		const verifyToken = crypto.randomUUID();
		const checkedSubscription = subscription || "starter";
		const avatar = gravatar.url(email, { s: "500" }, true);

		await userModel.create({ name, email, password: passwordHash, subscription: checkedSubscription, avatar, verifyToken });

		const message = {
			to: email,
			subject: `Glad to have you here, ${name}!`,
			html: `<h3 style="color: #3a7032">You are almost there! Last step - you need to verify your email by clicking the link below.</h3><br /><a href="http://localhost:3000/api/users/verify/${verifyToken}">Verify!</a>`,
			text: `You are almost there! Last step - you need to verify your email by clicking the link below.\nhttp://localhost:3000/api/users/verify/${verifyToken}`,
		};
		await sendVerificationEmail(message).catch((error) => console.error(error));

		res.status(201).send({
			user: {
				name: name,
				email: email,
				subscription: checkedSubscription,
			},
			message: "Registered successfully! Please note that you need to verify your email address. Check your email for further instructions.",
		});
	} catch (error) {
		next(error);
	}
}

export async function verifyNewUser(req, res, next) {
	const user = await userModel.findOne({ verifyToken: req.params.verifyToken }).exec();

	if (user === null) {
		return res.status(401).send({ message: "Invalid verify token or user is not found!" });
	}
	try {
		await userModel.findByIdAndUpdate(user._id, { verified: true, verifyToken: null }).exec();

		res.status(200).send({ message: "Your Email address has been verified!" });
	} catch (error) {
		next(error);
	}
}

export async function resendVerificationToken(req, res, next) {
	const { email } = req.body;

	const user = await userModel.findOne({ email }).exec();
	if (!user) {
		return res.status(404).send({ message: "User is not found!" });
	}

	if (user.verified === true) {
		return res.status(400).send({ message: "Email verification has already been completed for this account." });
	}

	try {
		const verifyToken = crypto.randomUUID();
		const message = {
			to: email,
			subject: `New verification letter`,
			html: `<h3 style="color: #3a7032">You are almost there! Last step - you need to verify your email by clicking the link below.</h3><br /><a href="http://localhost:3000/api/users/verify/${verifyToken}">Verify!</a>`,
			text: `You are almost there! Last step - you need to verify your email by clicking the link below.\nhttp://localhost:3000/api/users/verify/${verifyToken}`,
		};
		await sendVerificationEmail(message).catch((error) => console.error(error));

		await userModel.findOneAndUpdate({ email }, { verifyToken });

		res.status(200).send({ message: "New verification letter has been sent!" });
	} catch (error) {
		next(error);
	}
}

export async function logInUser(req, res, next) {
	const { email, password } = req.body;

	const user = await userModel.findOne({ email }).exec();
	if (user === null) {
		return res.status(400).send({ message: "Email or password is incorrect!" });
	}

	const isPasswordMatching = await bcrypt.compare(password, user.password);
	if (!isPasswordMatching) {
		return res.status(401).send({ message: "Email or password is incorrect!" });
	}

	try {
		const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });

		await userModel.findByIdAndUpdate(user._id, { token });

		return res.status(200).send({ message: "Logged in successfully! Your Token will expire in 10 minutes.", token });
	} catch (error) {
		next(error);
	}
}

export async function logOutUser(req, res, next) {
	try {
		await userModel.findByIdAndUpdate(req.user.id, { token: null });
		res.send({ message: "Logged out successfully!" });
	} catch (error) {
		next(error);
	}
}

export async function getCurrentUser(req, res, next) {
	try {
		const { name, email, subscription, avatar } = req.user;
		res.status(200).send({ user: { name, email, subscription, avatar } });
	} catch (error) {
		next(error);
	}
}

export async function changeAvatar(req, res, next) {
	const user = await userModel.findById(req.user.id).exec();
	if (user === null) {
		return res.status(404).send({ message: "User is not found!" });
	}

	if (!req.file) {
		return res.status(400).send({ message: "Avatar file is required!" });
	}

	try {
		const oldFilePath = req.file.path;
		const newFilePath = path.join(__dirname, "..", "public", "avatars", req.file.filename);

		await fs.rename(oldFilePath, newFilePath);

		const image = await Jimp.read(newFilePath);
		await image.resize(250, 250).writeAsync(newFilePath);

		const avatarURL = `/avatars/${req.file.filename}`;
		await userModel.findByIdAndUpdate(req.user.id, { avatar: avatarURL }, { new: true }).exec();

		res.status(200).send({
			message: "Your avatar has been updated successfully. Keep in mind that it has been resized to 250x250 px.",
			avatarURL,
		});
	} catch (error) {
		next(error);
	}
}
