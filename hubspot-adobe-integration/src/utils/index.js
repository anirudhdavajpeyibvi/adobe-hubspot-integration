/**
 * Indexes an array of objects by a specific property
 * @param {Array} array - Array of objects to index
 * @param {string} keyProperty - Property name to use as the key
 * @returns {Object} Indexed object with property values as keys
 */
export const indexByAdobeId = (array, keyProperty) => {
  if (!Array.isArray(array)) return {};
  
  return array.reduce((acc, item) => {
    const key = item.properties?.[keyProperty] || item[keyProperty];
    if (key) {
      acc[key] = {
        ...item,
        hubspotId: item.id,
      };
    }
    return acc;
  }, {});
};

/**
 * Indexes stores by store_id
 * @param {Array} stores - Array of store objects
 * @returns {Object} Indexed object with store_id as keys
 */
export const indexByStoreId = (stores) => {
  if (!Array.isArray(stores)) return {};
  
  return stores.reduce((acc, store) => {
    const storeId = store.properties?.store_id || store.store_id;
    if (storeId) {
      acc[storeId] = {
        ...store,
        hubspotId: store.id,
      };
    }
    return acc;
  }, {});
};

/**
 * Indexes orders by order number
 * @param {Array} orders - Array of order objects
 * @returns {Object} Indexed object with order numbers as keys
 */
export const indexByOrderNumber = (orders) => {
  if (!Array.isArray(orders)) return {};
  
  return orders.reduce((acc, order) => {
    const orderNumber = order.properties?.adobe_order_number || order.adobe_order_number;
    if (orderNumber) {
      acc[orderNumber] = {
        ...order,
        hubspotId: order.id,
      };
    }
    return acc;
  }, {});
};

