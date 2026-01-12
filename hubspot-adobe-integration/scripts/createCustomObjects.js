import dotenv from "dotenv";
dotenv.config();

import { hubspot } from "../src/clients/hubspot.client.js";

const objects = [
  {
    name: "stores",
    labels: { singular: "Store", plural: "Stores" },
    primaryDisplayProperty: "store_name",
    requiredProperties: ["store_name", "store_id"],
  },
  {
    name: "orders",
    labels: { singular: "Order", plural: "Orders" },
    primaryDisplayProperty: "adobe_order_number",
    requiredProperties: ["adobe_order_number"],
  },
];

(async () => {
  for (const obj of objects) {
    try {
      await hubspot.post("/crm/v3/schemas", obj);
      console.log(`✅ Created object: ${obj.name}`);
    } catch {
      console.log(`⚠️ Object exists: ${obj.name}`);
    }
  }
})();
