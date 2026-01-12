import dotenv from "dotenv";
dotenv.config();

import { createProperty } from "../src/utils/createProperty.js";

const objectType = "companies";
const groupName = "company_information";

const properties = [
  {
    name: "account_type",
    label: "Account Type",
    type: "enumeration",
    fieldType: "select",
    options: [
      { label: "Distributor", value: "Distributor" },
      { label: "Rep Agency", value: "Rep Agency" },
      { label: "Contractor", value: "Contractor" },
    ],
  },
  {
    name: "division",
    label: "Division",
    type: "enumeration",
    fieldType: "select",
    options: [
      { label: "ED", value: "ED" },
      { label: "LSH", value: "LSH" },
      { label: "PLX", value: "PLX" },
      { label: "DIY", value: "DIY" },
      { label: "HOME", value: "HOME" },
    ],
  },
  {
    name: "adobe_account_id",
    label: "Adobe Account ID",
    type: "string",
    fieldType: "text",
  },
  {
    name: "oracle_account_id",
    label: "Oracle Account ID",
    type: "string",
    fieldType: "text",
  },
  {
    name: "credit_terms",
    label: "Credit Terms",
    type: "enumeration",
    fieldType: "select",
    options: [
      { label: "Net 30", value: "Net 30" },
      { label: "Net 60", value: "Net 60" },
      { label: "Prepaid", value: "Prepaid" },
    ],
  },
];

(async () => {
  for (const property of properties) {
    await createProperty(objectType, groupName, property);
  }
})();
