import { hubspot } from "../clients/hubspot.client.js";
import logger from "./logger.js";

export const createProperty = async (objectType, groupName, property) => {
  try {
    await hubspot.post(
      `/crm/v3/properties/${objectType}`,
      {
        ...property,
        groupName,
      }
    );
    logger.info(`✅ Created property: ${property.name}`);
  } catch (err) {
    const errorData = err.response?.data;
    const errorMessage = errorData?.message || err.message;
    
    // Check if property already exists
    if (errorData?.status === "error" && errorMessage?.includes("already exists")) {
      logger.info(`⚠️ Skipped existing property: ${property.name}`);
      return;
    }
    
    // Check if property group doesn't exist
    if (errorData?.subCategory === "PropertyGroupError.GROUP_DOES_NOT_EXIST") {
      let standardGroups = "";
      if (objectType === "contacts") {
        standardGroups = "contactinformation, marketinginformation, salesinformation";
      } else if (objectType === "companies") {
        standardGroups = "companyinformation, marketinginformation, salesinformation";
      } else if (objectType === "products") {
        standardGroups = "productinformation, marketinginformation, salesinformation";
      } else if (objectType === "deals") {
        standardGroups = "dealinformation, marketinginformation, salesinformation";
      } else {
        standardGroups = `Check HubSpot documentation for standard property groups for ${objectType}`;
      }
      
      logger.error(`Property group '${groupName}' does not exist for ${objectType}`, {
        groupName,
        objectType,
        standardGroups,
      });
      
      throw new Error(`Property group '${groupName}' does not exist`);
    }
    
    // Check for boolean property validation errors
    if (errorData?.subCategory === "PropertyValidationError.INVALID_BOOLEAN_OPTION") {
      logger.error(`Boolean property '${property.name}' requires exactly two options (true/false)`, {
        propertyName: property.name,
        propertyType: property.type,
        fieldType: property.fieldType,
        error: errorMessage,
        hint: "Boolean properties must have options: [{label: 'Yes', value: 'true'}, {label: 'No', value: 'false'}]",
      });
      throw new Error(`Boolean property '${property.name}' has invalid options`);
    }
    
    // Check for other validation errors
    if (errorData?.status === "error") {
      logger.error(`Failed to create property '${property.name}'`, {
        propertyName: property.name,
        error: errorMessage,
      });
      throw err;
    }
    
    // Re-throw other errors
    throw err;
  }
};
