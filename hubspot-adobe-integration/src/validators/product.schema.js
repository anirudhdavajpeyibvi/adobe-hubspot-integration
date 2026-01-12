import Joi from "joi";
import {
  dateISO,
  numberOptional,
  booleanOptional,
  stringOptional,
} from "./common.schema.js";

export const productSchema = Joi.object({
  sku: Joi.string().required(),
  name: Joi.string().required(),

  qty_available: numberOptional,
  incoming_qty: numberOptional,
  incoming_date: dateISO.optional(),

  uom: stringOptional,

  category_l1: stringOptional,
  category_l2: stringOptional,
  category_l3: stringOptional,

  dnp: booleanOptional,
}).unknown(false);
