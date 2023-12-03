const Joi = require("joi");

const contactSchema = Joi.object({
	name: Joi.string().min(2).max(25).required(),
	email: Joi.string().email({ minDomainSegments: 2 }).required(),
	phone: Joi.string().max(20).required(),
	favorite: Joi.boolean(),
});

module.exports = contactSchema;