import { hubspot } from "../clients/hubspot.client.js";

export const createProperty = async (objectType, groupName, property) => {
  try {
    await hubspot.post(
      `/crm/v3/properties/${objectType}`,
      {
        ...property,
        groupName,
      }
    );
    console.log(`✅ Created property: ${property.name}`);
  } catch (err) {
    if (err.response?.data?.status === "error") {
      console.log(`⚠️ Skipped existing property: ${property.name}`);
    } else {
      throw err;
    }
  }
};
