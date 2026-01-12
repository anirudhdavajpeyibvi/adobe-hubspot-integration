export const mapAdobeCompanyToHubSpot = (company) => ({
  properties: {
    name: company.company_name,
    adobe_account_id: company.adobe_account_id,
    account_type: company.account_type,
    division: company.division,
    bill_to_address: company.bill_to_address,
    bill_to_city: company.bill_to_city,
    bill_to_state: company.bill_to_state,
    bill_to_zip: company.bill_to_zip,
    territory: company.territory,
    region: company.region,
  },
});

