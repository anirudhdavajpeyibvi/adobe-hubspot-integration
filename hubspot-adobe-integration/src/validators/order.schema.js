import Joi from "joi";
import {
  dateISO,
  numberOptional,
  booleanOptional,
} from "./common.schema.js";

export const orderSchema = Joi.object({
  adobe_order_number: Joi.string().required(),
  oracle_order_number: Joi.string().optional(),

  adobe_account_id: Joi.string().required(),
  adobe_customer_id: Joi.string().optional(),

  invoice_number: Joi.string().optional(),

  total_amount_paid: numberOptional,

  order_status: Joi.string().valid(
    "Shipped",
    "Invoiced",
    "Delivered",
    "Cancelled"
  ).required(),

  payment_status: Joi.string().valid(
    "Paid",
    "Unpaid",
    "Partially Paid"
  ).required(),

  order_date: dateISO.required(),
  invoice_date: dateISO.optional(),
  payment_date: dateISO.optional(),

  created_by: Joi.string().optional(),
  dnp: booleanOptional,
}).unknown(false);
