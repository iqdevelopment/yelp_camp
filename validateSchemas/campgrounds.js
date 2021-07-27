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
 * validates campgrounds, the error/route next is includes
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

const validateCampground = (req,res,next) =>{
    const CampgroundSchema = Joi.object({
        campground: Joi.object ({
            title: Joi.string().required().escapeHTML(),
            price: Joi.number().required().min(0),
/*             image: Joi.array().items(
                {
                    url: Joi.string(),
                    filename: Joi.string(),
                }
                ).required(), */
            location: Joi.string().required().escapeHTML(),
            description: Joi.string().required().escapeHTML(),
        }).required()
    })
    console.log(req.body)
    const {error} = CampgroundSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next()
    }
}

module.exports = validateCampground