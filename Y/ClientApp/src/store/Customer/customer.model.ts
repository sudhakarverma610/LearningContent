export class Customer {
  public billing_address: Billing_address;
  public shipping_address: Shipping_address;
  public addresses: AddressesItem[];
  public id: string;
  public username: string;
  public email: string;
  public first_name: string;
  public last_name: string;
  public language_id: string;
  public date_of_birth: string;
  public gender: string;
  public admin_comment: string;
  public is_tax_exempt: boolean;
  public has_shopping_cart_items: boolean;
  public active: boolean;
  public deleted: boolean;
  public is_system_account: boolean;
  public system_name: string;
  public last_ip_address: string;
  public created_on_utc: string;
  public last_login_date_utc: string;
  public last_activity_date_utc: string;
  public registered_in_store_id: number;
  public subscribed_to_newsletter: boolean;
  public role_ids: number[];
  public isActive: boolean;
  public mobile: string;

  constructor() {
    this.shipping_address = new Shipping_address();
    this.billing_address = new Billing_address();
  }
}

export class Billing_address {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  country_id: number;
  country: string;
  state_province_id: number;
  city: string;
  address1: string;
  address2: string;
  zip_postal_code: string;
  phone_number: string;
  fax_number: string;
  customer_attributes: any;
  created_on_utc: string;
  province: string;
}

export class Shipping_address {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  country_id: number;
  country: string;
  state_province_id: number;
  city: string;
  address1: string;
  address2: string;
  zip_postal_code: string;
  phone_number: string;
  fax_number: string;
  customer_attributes: any;
  created_on_utc: string;
  province: string;
}

export class AddressesItem {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  country_id: number;
  country: string;
  state_province_id: number;
  city: string;
  address1: string;
  address2: string;
  zip_postal_code: string;
  phone_number: string;
  fax_number: string;
  customer_attributes: any;
  created_on_utc: string;
  province: string;
}

export class State {
  id: number;
  name: string;
  Form: any;
  CustomProperties: any;
}

export class AddressFormValidation {
  public firstnameFormAddressError: boolean;
  public nameFormAddressError: boolean;
  public townFormAddressError: boolean;
  public postcodeFormAddressError: boolean;
  public mobileFormAddressError: boolean;
  public addressFormAddressError: boolean;
  public stateFormAddressError: boolean;

  constructor() {}
}
