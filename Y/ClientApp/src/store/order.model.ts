import { Customer } from './Customer/customer.model';
import { Product } from './products/products.model';

export interface OrderRootObject {
  orders: Order[];
}

export interface Order {
  id: string;
  store_id: number;
  shipmentId: null;
  pick_up_in_store: boolean;
  payment_method_system_name: string;
  customer_currency_code: string;
  currency_rate: number;
  customer_tax_display_type_id: number;
  vat_number: null;
  order_subtotal_incl_tax: number;
  order_subtotal_excl_tax: number;
  order_sub_total_discount_incl_tax: number;
  order_sub_total_discount_excl_tax: number;
  order_shipping_incl_tax: number;
  order_shipping_excl_tax: number;
  payment_method_additional_fee_incl_tax: number;
  payment_method_additional_fee_excl_tax: number;
  tax_rates: string;
  order_tax: number;
  order_discount: number;
  order_total: number;
  refunded_amount: number;
  reward_points_were_added: null;
  checkout_attribute_description: string;
  customer_language_id: number;
  affiliate_id: number;
  customer_ip: string;
  authorization_transaction_id: null;
  authorization_transaction_code: null;
  authorization_transaction_result: null;
  capture_transaction_id: null;
  capture_transaction_result: null;
  subscription_transaction_id: null;
  paid_date_utc: null;
  shipping_method: string;
  shipping_rate_computation_method_system_name: string;
  custom_values_xml: null;
  deleted: boolean;
  created_on_utc: Date;
  customer: Customer;
  customer_id: number;
  billing_address: IngAddress;
  shipping_address: IngAddress;
  order_items: OrderItem[];
  order_status: string;
  payment_status: string;
  shipping_status: string;
  customer_tax_display_type: string;
}

export interface IngAddress {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company: null;
  country_id: number;
  country: string;
  state_province_id: number;
  city: string;
  address1: string;
  address2: null;
  zip_postal_code: string;
  phone_number: string;
  fax_number: null;
  customer_attributes: null;
  created_on_utc: Date;
  province: string;
}

export interface OrderItem {
  id: string;
  product_attributes: any[];
  quantity: number;
  unit_price_incl_tax: number;
  unit_price_excl_tax: number;
  price_incl_tax: number;
  price_excl_tax: number;
  discount_amount_incl_tax: number;
  discount_amount_excl_tax: number;
  original_product_cost: number;
  attribute_description: string;
  download_count: number;
  isDownload_activated: boolean;
  license_download_id: number;
  item_weight: number;
  rental_start_date_utc: null;
  rental_end_date_utc: null;
  product: Product;
  product_id: number;
}

export interface OrderSettings {
ActivateGiftCardsAfterCompletingOrder: boolean;
AllowAdminsToBuyCallForPriceProducts: boolean;
AnonymousCheckoutAllowed: boolean;
AttachPdfInvoiceToOrderCompletedEmail: boolean;
AttachPdfInvoiceToOrderPaidEmail: boolean;
AttachPdfInvoiceToOrderPlacedEmail: boolean;
AutoUpdateOrderTotalsOnEditingOrder: boolean;
CheckoutDisabled: boolean;
CompleteOrderWhenDelivered: boolean;
CustomOrderNumberMask: string;
DeactivateGiftCardsAfterCancellingOrder: boolean;
DeactivateGiftCardsAfterDeletingOrder: boolean;
DeleteGiftCardUsageHistory: boolean;
DisableBillingAddressCheckoutStep: boolean;
DisableOrderCompletedPage: boolean;
DisplayPickupInStoreOnShippingMethodPage: boolean;
ExportWithProducts: boolean;
GeneratePdfInvoiceInCustomerLanguage: boolean;
IsReOrderAllowed: boolean;
MinOrderSubtotalAmount: number;
MinOrderSubtotalAmountIncludingTax: boolean;
MinOrderTotalAmount: number;
MinimumOrderPlacementInterval: number;
NumberOfDaysReturnRequestAvailable: number;
OnePageCheckoutDisplayOrderTotalsOnPaymentInfoTab: boolean;
OnePageCheckoutEnabled: boolean;
ReturnRequestNumberMask: string;
ReturnRequestsAllowFiles: boolean;
ReturnOrReplaceCharged: number;
ReturnRequestsEnabled: boolean;
ReturnRequestsFileMaximumSize: number;
TermsOfServiceOnOrderConfirmPage: boolean;
TermsOfServiceOnShoppingCartPage: boolean;
}
