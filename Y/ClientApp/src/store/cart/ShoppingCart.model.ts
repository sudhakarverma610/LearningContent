import { Product, Image } from "../products/products.model";
import { Customer } from "../Customer/customer.model";

export class OrderTotals {
  IsEditable: boolean;
  SubTotal: string;
  SubTotalDiscount: string;
  Shipping: string;
  RequiresShipping: boolean;
  SelectedShippingMethod: string;
  HideShippingTotal: boolean;
  PaymentMethodAdditionalFee: string;
  Tax: string;
  TaxRates: TaxRatesItem[];
  DisplayTax: boolean;
  DisplayTaxRates: boolean;
  GiftCards: any[];
  OrderTotalDiscount: string;
  RedeemedRewardPoints: number;
  RedeemedRewardPointsAmount: string;
  WillEarnRewardPoints: number;
  OrderTotal: string;
  total: string;
  Form: any;
  CustomProperties: any;
  appliedDiscount: AppliedDiscount[];
}

export class AppliedDiscount {
  id: number;
  name: string;
  couponCode: string;
  requiresCouponCode: boolean;
}

export class ShoppingCartRootObject {
  shopping_carts: ShoppingCartsItem[];
}

export class OrderTotalRootObject {
  orderTotals: OrderTotals;
  /**
   *
   */
  constructor() {
    this.orderTotals = new OrderTotals();
  }
}

export class ShoppingCartsItem {
  id: string;
  product_attributes: ProductAttributeInShoppingCart[];
  customer_entered_price: number;
  quantity: number;
  image: Image;
  rental_start_date_utc: string;
  rental_end_date_utc: string;
  created_on_utc: string;
  updated_on_utc: string;
  shopping_cart_type: string;
  product_id: number;
  product: Product;
  discount_coupon: Discount_coupon;
  customer_id: number;
  customer: Customer;
  subtotal: string;
  appliedDiscount: AppliedDiscount[];
}

export class ProductAttributeInShoppingCart {
  id: number;
  value: string;
}

export class Discount_coupon {
  applied_codes: AppliedDiscountWithCodes[];
  display: boolean;
  messages: string[];
  isApplied: boolean;
  Form: any;
  CustomProperties: any;
}

export class AppliedDiscountWithCodes {
  id: number;
  coupon_code: string;
}

export class TaxRatesItem {
  Rate: string;
  Value: string;
  Form: any;
  CustomProperties: any;
}

export class CartPushData {
  gift_card_attributes: any;
  product_id: number;
  cart_type_id: number;
  cart_item_id: number;
  quantity: number;
  updatecartitem: boolean;
  attributes: { id: number; value: String }[];
  customer_entered_price: number;
}
