import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 10,
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		status: "fail",
		code: 429,
		message: "Too many requests from this IP, please try again after 15 minutes",
	},
});

export const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 100,
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		status: "fail",
		code: 429,
		message: "Too many requests from this IP, please try again later",
	},
});
