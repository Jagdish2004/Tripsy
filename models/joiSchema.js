const Joi = require('joi');

const joiSchema = Joi.object({
    title: Joi.string().required(),
    image: Joi.object({
        filename: Joi.string().required(),
        url: Joi.string().uri().required(),
    }),
    price: Joi.number().required().min(0),
    description: Joi.string().required(),
    country: Joi.string().required(),
    location: Joi.string().required(),
    category: Joi.string().valid("trending", "rooms", "cities", "mountains", "castles", "beach/pools", "camping", "arctic", "farm", "other").required()
});

module.exports = joiSchema;
