import jwt from "jsonwebtoken";
import userModel from "../models/usersModel.js";

async function auth(req, res, next) {
	const authHeader = req.headers.authorization;
	if (typeof authHeader !== "string") {
		return res.status(401).send({ message: "No token provided!" });
	}

	const [bearer, token] = authHeader.split(" ", 2);
	if (bearer !== "Bearer" || !token) {
		return res.status(401).send({ message: "No token provided!" });
	}

	try {
		const decode = jwt.verify(token, process.env.JWT_SECRET);
		const user = await userModel.findById(decode.id);

		if (!user || user.token !== token) {
			return res.status(401).send({ message: "You are not authorized!" });
		}

		req.user = user;
		next();
	} catch (error) {
		if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
			return res.status(401).send({ message: "Token Error! (Check if it's not expired)" });
		}
		next(error);
	}
}

export default auth;