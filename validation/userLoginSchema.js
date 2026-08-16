import Joi from "joi";

const userLoginSchema = Joi.object({
	email: Joi.string().email({ minDomainSegments: 2 }).required(),
	password: Joi.string().min(8).max(20).required(),
});

export default userLoginSchema;