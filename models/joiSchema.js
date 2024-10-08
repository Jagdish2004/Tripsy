const Joi = require('joi');

const joiSchema = Joi.object({
    title: Joi.string().required(),
    image: Joi.optional(), //later need to be changed for now no validation for image
    price: Joi.number().required().min(0),
    description: Joi.string().required(),
    country: Joi.string().required(),
    location: Joi.string().required(),
});

module.exports = joiSchema;
