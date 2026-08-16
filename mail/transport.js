import nodemailer from "nodemailer";
import "dotenv/config";

const transport = nodemailer.createTransport({
	host: "sandbox.smtp.mailtrap.io",
	port: 2525,
	auth: {
		user: process.env.MAILTRAP_USER,
		pass: process.env.MAILTRAP_PASSWORD,
	},
});

function sendVerificationEmail(message) {
	message.from = process.env.MAILTRAP_EMAIL;
	return transport.sendMail(message).catch((error) => console.error(error));
}

export default sendVerificationEmail;
