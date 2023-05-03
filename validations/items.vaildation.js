const Joi = require('joi');

const createItem = {

  body: Joi.object().keys({
    name  :  Joi.string().optional(),
    category : Joi.number().required(),
    price :Joi.number().required()
  }),
};

const updateItem = {

  body: Joi.object().keys({
    name  :  Joi.string().optional(),
    category : Joi.number().required(),
    price :Joi.number().required()
  }),
};



module.exports = {
	createItem,
  updateItem
  };
  