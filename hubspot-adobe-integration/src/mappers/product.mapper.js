export const mapAdobeProductToHubSpot = (product) => ({
  properties: {
    name: product.name,
    sku: product.sku,
    qty_available: product.qty_available,
    incoming_qty: product.incoming_qty,
    incoming_date: product.incoming_date,
    uom: product.uom,
    category_l1: product.category_l1,
    category_l2: product.category_l2,
    category_l3: product.category_l3,
    dnp: product.dnp,
  },
});

