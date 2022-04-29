export interface CheckoutAttributeValue {
  Id: number;
  CheckoutAttributeId: number;
  Name: string;
  ColorSquaresRgb?: any;
  PriceAdjustment: number;
  WeightAdjustment: number;
  IsPreSelected: boolean;
  DisplayOrder: number;
}

export interface CheckoutAttribute {
  Id: number;
  CheckoutAttributeValues: CheckoutAttributeValue[];
  Name: string;
  TextPrompt?: any;
  IsRequired: boolean;
  ShippableProductRequired: boolean;
  IsTaxExempt: boolean;
  TaxCategoryId: number;
  AttributeControlTypeId: number;
  DisplayOrder: number;
  LimitedToStores: boolean;
  ValidationMinLength?: any;
  ValidationMaxLength?: any;
  ValidationFileAllowedExtensions?: any;
  ValidationFileMaximumSize?: any;
  DefaultValue?: any;
}

export interface CheckoutAttributes {
  attributes: CheckoutAttribute[];
}

export interface CheckoutAttributeDtoResponse {
  success: string;
  attributes: CheckoutAttributes;
}

export interface SelectedCheckoutAttributesValue {
  id: number;
  value: string;
}
