export class PaymentMethodsDTO {
  payment_methods: PaymentMethod[];
  display_reward_points: boolean;
  reward_points_balance: number;
  reward_points_amount: null | string;
  rewardpoints_enough: boolean;
  use_rewardpoints: boolean;
}
export class PaymentMethod {
  systemname: string;
  name: string;
  description: string;
  fee: null | string;
  selected: boolean;
  logourl: string;
  skipPaymentInfo: boolean;
  type: number;
}
