import logger from "../utils/logger.js";

export const validateBatch = (schema, records, entityName) => {
    const valid = [];
    const invalid = [];
  
    for (const record of records) {
      const { error, value } = schema.validate(record);
      if (error) {
        invalid.push({ record, error: error.message });
      } else {
        valid.push(value);
      }
    }
  
    if (invalid.length) {
      logger.warn(`${entityName}: ${invalid.length} invalid records skipped`, {
        entityName,
        invalidCount: invalid.length,
        totalRecords: records.length,
        invalidRecords: invalid.map(i => ({ error: i.error })),
      });
    }
  
    return valid;
  };
  