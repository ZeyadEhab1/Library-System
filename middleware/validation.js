export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    let data;
    if (source === 'query') {
      data = req.query;
    } else if (source === 'params') {
      data = req.params;
    } else {
      data = req.body;
    }

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    if (source === 'query') {
      req.validatedQuery = value;
    } else if (source === 'params') {
      req.validatedParams = value;
    } else {
      req.body = value;
    }

    next();
  };
};

export default validate;
