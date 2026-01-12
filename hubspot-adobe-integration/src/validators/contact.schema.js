import Joi from "joi";
import {
  divisionEnum,
  email,
  stringOptional,
} from "./common.schema.js";

export const contactSchema = Joi.object({
  adobe_customer_id: Joi.string().required(),
  email: email.required(),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),

  division: divisionEnum.required(),
  segment: Joi.string().valid(
    "Distributor",
    "Contractor",
    "Designer"
  ).optional(),

  store_id: stringOptional,
  store_name: stringOptional,

  territory: stringOptional,
  region: stringOptional,
}).unknown(false);
