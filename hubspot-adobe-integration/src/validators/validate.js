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
      console.warn(
        `⚠️ ${entityName}: ${invalid.length} invalid records skipped`
      );
    }
  
    return valid;
  };
  