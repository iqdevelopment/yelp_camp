const BaseJoi = require('joi')
const ExpressError = require('./../utils/ExpressError')
const sanitizeHtml = require('sanitize-html')


/**
 * creates new method escape(html), that we can chain to and check if users are not inputting some scripts
 * @param {*} joi 
 * @returns 
 */
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)


/**
 * validates reviews, the error/route next is includes
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
 const validateReview = (req,res,next) =>{
    const ReviewSchema = Joi.object({
        review: Joi.object ({
            rating: Joi.number().required().min(0).max(5),
            body: Joi.string().required().escapeHTML(),
        }).required()
    })
    const {error} = ReviewSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next()
    }
}

module.exports = validateReview