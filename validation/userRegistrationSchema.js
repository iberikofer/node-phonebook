const Joi = require("joi");

const userRegistrationSchema = Joi.object({
	name: Joi.string().min(2).max(25).required(),
	email: Joi.string().email({ minDomainSegments: 2 }).required(),
	password: Joi.string().min(8).max(20).required(),
	subscription: Joi.string().valid("starter", "premium", "vip"),
});

module.exports = userRegistrationSchema;