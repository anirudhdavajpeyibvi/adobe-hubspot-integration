import Joi from "joi";
import {
  divisionEnum,
  email,
  stringOptional,
} from "./common.schema.js";

export const storeSchema = Joi.object({
  store_id: Joi.string().required(),
  store_name: Joi.string().required(),

  account_id: Joi.string().required(),
  contact_id: Joi.string().required(),

  ship_to_address: stringOptional,
  city: stringOptional,
  state: stringOptional,
  zip: stringOptional,
  country: stringOptional,

  phone: stringOptional,
  email: email.optional(),

  division: divisionEnum.required(),
}).unknown(false);
