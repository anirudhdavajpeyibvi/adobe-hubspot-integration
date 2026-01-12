import Joi from "joi";
import {
  divisionEnum,
  stringOptional,
} from "./common.schema.js";

export const companySchema = Joi.object({
  adobe_account_id: Joi.string().required(),
  company_name: Joi.string().required(),

  account_type: Joi.string().valid(
    "Distributor",
    "Rep Agency",
    "Contractor"
  ).required(),

  division: divisionEnum.required(),

  bill_to_address: stringOptional,
  bill_to_city: stringOptional,
  bill_to_state: stringOptional,
  bill_to_zip: stringOptional,

  territory: stringOptional,
  region: stringOptional,
}).unknown(false);
