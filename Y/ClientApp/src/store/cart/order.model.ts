export interface PreOrderPushDTO {
  billing_id: string;
  shipping_id: string;
  payment_name: string;
  order_attributes: { key: string; value: string }[];
}

export interface PreOrderResponseDTO {
  orderComplete: boolean;
  paymentInfoNeeded: boolean;
  form: string;
  error: string;
}
