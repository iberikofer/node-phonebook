require("dotenv").config();
const nodemailer = require("nodemailer")

const transport = nodemailer.createTransport({
	host: "sandbox.smtp.mailtrap.io",
	port: 2525,
	auth: {
		user: process.env.MAILTRAP_USER,
		pass: process.env.MAILTRAP_PASSWORD
	}
});

function sendVerificationEmail(message) {
	message.from = process.env.MAILTRAP_EMAIL
	return transport.sendMail(message).catch((error) => console.error(error))
}

module.exports = sendVerificationEmail
