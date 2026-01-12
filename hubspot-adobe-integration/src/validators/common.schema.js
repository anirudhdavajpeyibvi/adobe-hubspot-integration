import Joi from "joi";

export const divisionEnum = Joi.string().valid(
  "ED",
  "LSH",
  "PLX",
  "DIY",
  "HOME"
);

export const email = Joi.string().email().lowercase();

export const dateISO = Joi.date().iso();

export const stringOptional = Joi.string().allow("", null);

export const numberOptional = Joi.number().allow(null);

export const booleanOptional = Joi.boolean().allow(null);
