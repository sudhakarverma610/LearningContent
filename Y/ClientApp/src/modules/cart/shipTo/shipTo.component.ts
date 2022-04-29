import { Component, OnInit, OnDestroy } from "@angular/core";
import { CartService, DeliveryStatus } from "../../../services/cart.service";
import { noop, Subject } from "rxjs";
import { AddressesItem, Customer } from "src/store/Customer/customer.model";
import { CustomerStoreService } from "src/store/customerStore.service";
import { takeUntil } from "rxjs/operators";
import { Router } from "@angular/router";
import { CartStoreService } from "src/store/cartStore.service";
import {
  OrderTotalRootObject,
  ShoppingCartsItem
} from "src/store/cart/ShoppingCart.model";
import { MatDialog } from "@angular/material/dialog";
import { breadcrumb } from 'src/modules/shared/breadcrumb/breadcrumb.model';
import { NotificationsEntity } from 'src/modules/notification/notification.service';
import { NotificationHandlerService } from 'src/modules/notification/notification.handle.service';

@Component({
  selector: "app-ship-to",
  templateUrl: "./shipTo.component.html",
  styleUrls: ["./shipTo.component.scss"]
})
export class ShipToComponent implements OnInit, OnDestroy {
  public unSubscribeSubject = new Subject();
  public breadcrumbList: breadcrumb[] = [
    { title: "Home", link: "/" },
    { title: "Cart", link: "/cart" },
    { title: "Shipping Address", link: "/checkout" }
  ];
  public orderTotal: OrderTotalRootObject = new OrderTotalRootObject();

  public giftCardInCart = false;

  public shippingAddress = new AddressesItem();
  public billingAddress = new AddressesItem();
  public addresses: AddressesItem[] = [];
  public _useSameAddress = false;

  set useSameAddress(input) {
    this._useSameAddress = this.giftCardInCart ? false : input;
  }
  get useSameAddress() {
    return this._useSameAddress;
  }

  public cart: ShoppingCartsItem[] = [];

  constructor(
    private customerStore: CustomerStoreService,
    private router: Router,
    private cartStore: CartStoreService,
    private cartService: CartService,
    public dialog: MatDialog,
    private notificationHandler: NotificationHandlerService
  ) {}

  ngOnInit() {
    this.cartStore.getCart();
    this.unSubscribeSubject = new Subject();
    this.cartStore.orderTotalUpdated
      .pipe(takeUntil(this.unSubscribeSubject))
      .subscribe(item => {
        this.orderTotal = item;
        this.cart = this.cartStore.cart.shopping_carts;
        if (item.orderTotals.RequiresShipping) {
          this.giftCardInCart = false;
        } else {
          this.giftCardInCart = true;
        }
        this.sendGTMTag1();
      });
    const tempCustomer = this.customerStore.getCustomer();
    this.addresses = tempCustomer.addresses.reverse();
    this.shippingAddress = tempCustomer.shipping_address;
    this.billingAddress = tempCustomer.billing_address;
    this.useSameAddress =
      !this.shippingAddress || !this.billingAddress
        ? false
        : this.shippingAddress.id === this.billingAddress.id;
    this.customerStore.customerUpdated
      .pipe(takeUntil(this.unSubscribeSubject))
      .subscribe((value: Customer) => {
        this.addresses = value.addresses.reverse();
        this.shippingAddress = value.shipping_address;
        this.billingAddress = value.billing_address;
        this.useSameAddress =
          !this.shippingAddress || !this.billingAddress
            ? false
            : this.shippingAddress.id === this.billingAddress.id;
      });
  }

  useSameSelectedEvent(value: boolean) {
    if (value && this.shippingAddress) {
      this.cartService
        .setAsBilling(this.shippingAddress)
        .subscribe(it =>
          this.cartService.getAccountDetails(true).subscribe(noop)
        );
    }
  }

  validateAndContinue() {
    if (this.shippingAddress && this.billingAddress) {
      this.cartService.getDeliveryStatus(this.shippingAddress.zip_postal_code).subscribe((value: DeliveryStatus) => {
        let postalCodeInput = false;
        if (value) {
          if (
            value &&
            value.ETailExpressPrePaidAirInbound &&
            value.ETailExpressPrePaidAirInbound.toLowerCase() === 'yes'
          ) {
            postalCodeInput = true;
          }

          if ( !postalCodeInput &&
            value.ETailExpressCODAirInbound &&
            value.ETailExpressCODAirInbound.toLowerCase() === 'yes'
          ) {
            postalCodeInput = true;
          }
        }

        if (postalCodeInput) {
          try {
            this.sendGTMTag();
          } catch (err) {}
          this.router.navigate(["/payments"]);
        } else {
          const data = new NotificationsEntity();
          data.notification_id = "default_10";
          data.url = "/";
          data.heading = "Delivery is not available on the chosen Pincode.";
          data.content =  "";
          this.notificationHandler.newNotification.next(data);
        }
      });
    } else {
      const data = new NotificationsEntity();
      data.notification_id = "default_4"+Math.ceil(Math.random()*1000);;
      data.url = "/";
      data.heading = "Please add both Shipping and billing addresses.";
      data.content =  "";
      this.notificationHandler.newNotification.next(data);
    }
  }

  sendGTMTag1() {
    this.cartService
      .getCartItemCategories()
      .subscribe((value: { List: string[] }) => {
        (window as any).dataLayer = (window as any).dataLayer || [];
        const productCheckoutArray = this.cart.map((it, index) => {
          return {
            name: it.product.name,
            id: it.product.id,
            price: it.subtotal,
            brand: "Y",
            quantity: it.quantity,
            category: value.List[index]
          };
        });

        const ecommerceObject = {
          ecommerce: {
            checkout: {
              products: productCheckoutArray,
              actionField: { step: 1 }
            }
          },
          event: "eec.checkout.step1"
        };

        (window as any).dataLayer.push(ecommerceObject);
      });
  }

  sendGTMTag() {
    this.cartService
      .getCartItemCategories()
      .subscribe((value: { List: string[] }) => {
        (window as any).dataLayer = (window as any).dataLayer || [];
        const productCheckoutArray = this.cart.map((it, index) => {
          return {
            name: it.product.name,
            id: it.product.id,
            price: it.subtotal,
            brand: "Y",
            quantity: it.quantity,
            category: value.List[index]
          };
        });

        const ecommerceObject2 = {
          ecommerce: {
            checkout: {
              products: productCheckoutArray,
              actionField: { step: 2 }
            }
          },
          event: "eec.checkout.step2"
        };

        (window as any).dataLayer.push(ecommerceObject2);
      });
  }

  ngOnDestroy() {
    this.unSubscribeSubject.next();
    this.unSubscribeSubject.complete();
  }
}
