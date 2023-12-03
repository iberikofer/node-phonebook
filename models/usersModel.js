const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
	name: {
		type: String,
	},
	email: {
		type: String,
		unique: true,
	},
	password: {
		type: String,
	},
	subscription: {
		type: String,
		enum: ["starter", "premium", "vip"],
		default: "starter"
	},
	avatar: {
		type: String,
	},
	token: {
		type: String,
		default: null
	},
	verified: {
		type: Boolean,
		default: false,
	},
	verifyToken: {
		type: String,
		default: null
	}
}, { versionKey: false, timestamps: true })

const userModel = mongoose.model("user", userSchema, "users")

module.exports = userModel