import { Component, OnInit, OnDestroy } from "@angular/core";
import { CartStoreService } from "src/store/cartStore.service";

@Component({
  selector: "app-gift-card-checkout",
  templateUrl: "./giftCardCheckout.component.html",
  styleUrls: ["./giftCardCheckout.component.scss"]
})
export class GiftCardCheckoutComponent implements OnInit, OnDestroy {
  public orderAttribute = {
    key: "GiftCardDeliveryOptionSendToBoth",
    value: "true"
  };

  constructor(public cartStore: CartStoreService) {}

  ngOnInit() {
    this.changeOrderAttributeValue();
  }

  changeOrderAttributeValue() {
    this.cartStore.addOrderAttributes(this.orderAttribute);
  }

  ngOnDestroy() {}
}
