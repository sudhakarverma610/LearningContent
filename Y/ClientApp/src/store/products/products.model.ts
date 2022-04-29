export class ProductDTO {
  products: Product[];
  alreadyFilteredItems: FilteredItem[];
  notFilteredItems: FilteredItem[];
  filter: { name: string; list: FilteredItem[] };
  bestSellerTotalPage: number;
  page_size: number;
  count: number;
  page: number;
  totalPages: number;
  imageUrl:string;
  promotional:any
  constructor(private input) {
    if (input) {
      Object.assign(this, input);
    }
  }
}

export class ProductList {
  products: Product[];

  constructor(private input) {
    this.products = input.products;
  }
}

export interface FilteredItem {
  attribute_option_id: number;
  attribute_name: string;
  attribute_option_name: string;
  custom_value: any;
  position: number;
  attribute_option_color_rgb: any;
  attribute_filterIds: string;
  selected: boolean;
}

export class Product {
  id: string;
  visible_individually: boolean;
  name: string;
  localized_names: LocalizedName[];
  short_description: string;
  full_description: string;
  show_on_home_page: boolean;
  meta_keywords: string;
  meta_description: string;
  meta_title: string;
  allow_customer_reviews: boolean;
  approved_rating_sum: number;
  not_approved_rating_sum: number;
  approved_total_reviews: number;
  not_approved_total_reviews: number;
  sku: string;
  manufacturer_part_number: any;
  gtin: any;
  is_gift_card: boolean;
  require_other_products: boolean;
  automatically_add_required_products: boolean;
  is_download: boolean;
  unlimited_downloads: boolean;
  max_number_of_downloads: number;
  download_expiration_days: any;
  has_sample_download: boolean;
  has_user_agreement: boolean;
  is_recurring: boolean;
  recurring_cycle_length: number;
  recurring_total_cycles: number;
  is_rental: boolean;
  rental_price_length: number;
  is_ship_enabled: boolean;
  is_free_shipping: boolean;
  ship_separately: boolean;
  additional_shipping_charge: number;
  is_tax_exempt: boolean;
  is_telecommunications_or_broadcasting_or_electronic_services: boolean;
  use_multiple_warehouses: boolean;
  manage_inventory_method_id: number;
  stock_quantity: number;
  display_stock_availability: boolean;
  display_stock_quantity: boolean;
  min_stock_quantity: number;
  notify_admin_for_quantity_below: number;
  allow_back_in_stock_subscriptions: boolean;
  order_minimum_quantity: number;
  order_maximum_quantity: number;
  allowed_quantities: any;
  allow_adding_only_existing_attribute_combinations: boolean;
  disable_buy_button: boolean;
  disable_wishlist_button: boolean;
  available_for_pre_order: boolean;
  pre_order_availability_start_date_time_utc: string;
  call_for_price: boolean;
  price: number;
  old_price: number;
  product_cost: number;
  special_price: number;
  special_price_start_date_time_utc: string;
  special_price_end_date_time_utc: string;
  customer_enters_price: boolean;
  minimum_customer_entered_price: number;
  maximum_customer_entered_price: number;
  baseprice_enabled: boolean;
  baseprice_amount: number;
  baseprice_base_amount: number;
  has_tier_prices: boolean;
  has_discounts_applied: boolean;
  weight: number;
  length: number;
  width: number;
  height: number;
  available_start_date_time_utc: string;
  available_end_date_time_utc: string;
  display_order: number;
  published: boolean;
  deleted: boolean;
  created_on_utc: string;
  updated_on_utc: string;
  price_model: PriceModel;
  product_type: string;
  parent_grouped_product_id: number;
  role_ids: any[];
  discount_ids: any[];
  store_ids: any[];
  manufacturer_ids: any[];
  images: Image[];
  attributes: Attribute[];
  associated_product_ids: any[];
  tags: string[];
  vendor_id: number;
  se_name: string;
  specification_attributes: FilteredItem[];
  dimension_units: string;
  attributeCombinations: AttributeCombination[];
  categoryId: number;
  category_sename: string;
  dimensionUnits: string;
  attributeDetails: AttributeDetailsModel[];
  isSet: boolean;
  productSpecs: { name: string; list: FilteredItem[] };
  navAttributes: Attribute;
}

export interface AttributeDetailsModel {
  name: string;
  src: string;
  type: number;
}

export interface AttributeCombination {
  id: number;
  attribute_value_id: string;
  attribute_id: string;
  attributeXml: string;
  stock: number;
  allow_out_of_stock_orders: boolean;
  sku: string;
  manufacturer_part_number: any;
  gtin: any;
  overriddenPrice: number;
}

export interface Attribute {
  id: number;
  product_attribute_id: number;
  product_attribute_name: string;
  text_prompt: any;
  is_required: boolean;
  attribute_control_type_id: number;
  display_order: number;
  default_value: any;
  attribute_control_type_name: string;
  attribute_values: AttributeValue[];
  validationMinLength: number;
  validationMaxLength: number;
  textBoxInput: string;
  active: boolean;
  attributeInputSelected: AttributeValue;
}

export interface AttributeValue {
  id: number;
  type_id: number;
  associated_product_id: number;
  name: string;
  color_squares_rgb: any;
  image_squares_image: any;
  price_adjustment: number;
  weight_adjustment: number;
  cost: number;
  quantity: number;
  is_pre_selected: boolean;
  display_order: number;
  product_image_id: any;
  type: string;
  imageSrc: string;
}

export class Image {
  public id: number;
  public position: number;
  public src: string;
  public alt: string;
  public title: string;
  public attachment: string;
  public altSrc: string;

  constructor(input) {
    this.id = input.id || 0;
    this.src = input.src || "https://files.y.jewelry/assets/img/Logo.svg";
    this.title = input.title || "Image_not_available";
    this.position = input.position || 0;
    this.attachment = input.attachment || "";
    this.alt = input.alt || "Image_not_available";
  }
}

export interface LocalizedName {
  language_id: number;
  localized_name: string;
}

export interface PriceModel {
  currency_code: string;
  old_price: any;
  price: string;
  price_with_discount: string;
  price_value: number;
  customer_enters_price: boolean;
  price_without_formatting: number;
  price_with_discount_without_formatting: number;
  call_for_price: boolean;
  product_id: number;
  hide_prices: boolean;
  IsRental: boolean;
  RentalPrice: any;
  DisplayTaxShippingInfo: boolean;
  BasePricePAngV: any;
}

export interface RelatedProducts {
  alt: string;
  id: number;
  src: string;
  title: string;
  price: number;
  se_name: string;
  category_sename: string;
  price_model: PriceModel;
  tags: string[];
}
