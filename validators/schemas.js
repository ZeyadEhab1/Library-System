import Joi from "joi";

export const bookSchemas = {
  create: Joi.object({
    title: Joi.string().required().max(255),
    author: Joi.string().required().max(255),
    isbn: Joi.string().required().length(13).pattern(/^[0-9]+$/),
    available_quantity: Joi.number().integer().min(0).default(0),
    shelf_location: Joi.string().required().max(50)
  }),

  update: Joi.object({
    title: Joi.string().max(255),
    author: Joi.string().max(255),
    isbn: Joi.string().length(13).pattern(/^[0-9]+$/),
    available_quantity: Joi.number().integer().min(0),
    shelf_location: Joi.string().max(50)
  }),

  id: Joi.object({
    id: Joi.string().pattern(/^\d+$/).required()
  }),

  pagination: Joi.object({
    page: Joi.string().pattern(/^\d+$/).default('1'),
    limit: Joi.string().pattern(/^\d+$/).default('10')
  })
};

export const authSchemas = {
  register: Joi.object({
    name: Joi.string().required().min(2).max(255),
    email: Joi.string().email().required().max(255),
    password: Joi.string().required().min(6).max(255),
    phone: Joi.string().max(20).optional()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

export const borrowerSchemas = {
  update: Joi.object({
    name: Joi.string().min(2).max(255),
    email: Joi.string().email().max(255),
    password: Joi.string().min(6).max(255),
    phone: Joi.string().max(20).optional()
  })
};

export const checkoutSchemas = {
  checkout: Joi.object({
    isbn: Joi.string().required().length(13).pattern(/^[0-9]+$/)
  }),

  return: Joi.object({
    isbn: Joi.string().required().length(13).pattern(/^[0-9]+$/)
  })
};

export const exportSchemas = {
  period: Joi.object({
    startDate: Joi.string().required().pattern(/^\d{4}-\d{2}-\d{2}$/),
    endDate: Joi.string().required().pattern(/^\d{4}-\d{2}-\d{2}$/)
  })
};
