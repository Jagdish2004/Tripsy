const Joi = require('joi');

const joiReview = Joi.object({
    comment: Joi.string().required(),
    rangeInput: Joi.number().required(),
    createdAt: Joi.date().optional(),

});

module.exports = joiReview;