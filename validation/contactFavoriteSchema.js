import Joi from "joi";

const contactFavoriteSchema = Joi.object({
	favorite: Joi.boolean().required(),
});

export default contactFavoriteSchema;
