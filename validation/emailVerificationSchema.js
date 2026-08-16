import Joi from "joi";

const emailVerificationSchema = Joi.object({
	email: Joi.string().email({ minDomainSegments: 2 }).required(),
});

export default emailVerificationSchema;
