import dotenv from "dotenv";
dotenv.config();

import { createProperty } from "../src/utils/createProperty.js";

const objectType = "contacts";
const groupName = "contact_information";

const properties = [
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
    name: "segment",
    label: "Segment",
    type: "enumeration",
    fieldType: "select",
    options: [
      { label: "Distributor", value: "Distributor" },
      { label: "Contractor", value: "Contractor" },
      { label: "Designer", value: "Designer" },
    ],
  },
  {
    name: "store_name",
    label: "Store Name",
    type: "string",
    fieldType: "text",
  },
  {
    name: "adobe_customer_id",
    label: "Adobe Customer ID",
    type: "string",
    fieldType: "text",
  },
  {
    name: "oracle_customer_id",
    label: "Oracle Customer ID",
    type: "string",
    fieldType: "text",
  },
  {
    name: "territory",
    label: "Territory",
    type: "string",
    fieldType: "text",
  },
];

(async () => {
  for (const property of properties) {
    await createProperty(objectType, groupName, property);
  }
})();
