const Joi =require('joi');


module.exports.validateCampground = (req, res, next) => {
  const campgroundSchema = Joi.object({
      campground: Joi.object({
          title: Joi.string().required(),
          price: Joi.number().required().min(0),
          description: Joi.string(),
          image: Joi.string(),
          location: Joi.string()
      }).required()
  });

  const { error } = campgroundSchema.validate(req.body);
  if (error) {
      const msg = error.details.map(el => el.message).join(',');
      return res.status(400).send(msg);
  } else {
      next();
  }
};
const reviewSchema = Joi.object({
    review: Joi.object({
      body: Joi.string().required().messages({
        'string.empty': 'Review body cannot be empty.',
        'any.required': 'Review body is required.'
      }),
      rating: Joi.number().min(1).max(5).required().messages({
        'number.base': 'Rating must be a number.',
        'number.min': 'Rating must be at least 1.',
        'number.max': 'Rating must be at most 5.',
        'any.required': 'Rating is required.'
      })
    }).required()
  });
  
  module.exports = { reviewSchema };