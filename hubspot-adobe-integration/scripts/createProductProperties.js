import dotenv from "dotenv";
dotenv.config();

import { createProperty } from "../src/utils/createProperty.js";

const objectType = "products";
const groupName = "product_information";

const properties = [
  { name: "incoming_qty", label: "Incoming Quantity", type: "number", fieldType: "number" },
  { name: "incoming_date", label: "Incoming Date", type: "date", fieldType: "date" },
  { name: "qty_available", label: "Quantity Available", type: "number", fieldType: "number" },
  { name: "uom", label: "Unit of Measure", type: "string", fieldType: "text" },
  { name: "category_l1", label: "Category Level 1", type: "string", fieldType: "text" },
  { name: "category_l2", label: "Category Level 2", type: "string", fieldType: "text" },
  { name: "category_l3", label: "Category Level 3", type: "string", fieldType: "text" },
  { name: "dnp", label: "Do Not Publish", type: "bool", fieldType: "booleancheckbox" },
];

(async () => {
  for (const property of properties) {
    await createProperty(objectType, groupName, property);
  }
})();
