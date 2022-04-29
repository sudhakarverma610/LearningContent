import { Component, OnDestroy, OnInit } from "@angular/core";
import { Angulartics2 } from "angulartics2";
import { CartStoreService } from "src/store/cartStore.service";
import { CartService } from "../../../services/cart.service";
import { Router } from "@angular/router";
import { CustomerStoreService } from "src/store/customerStore.service";
import { Customer } from "src/store/Customer/customer.model";
import { AppService } from 'src/services/app.service';

@Component({
  selector: "app-orderplacementsuccess",
  templateUrl: "./orderPlacementSuccess.component.html",
  styleUrls: ["./orderPlacementSuccess.component.scss"]
})
export class OrderPlacementSuccessComponent implements OnDestroy, OnInit {
  public txnId;
  public amount;
  public status;
  public productInfo;
  public orderId;
  public firstname;
  public email;
  public hash;
  public myOrders = [];
  public orderTotal;
  public orderItems;
  public orderTax;
  public orderShipping;
  public payment_method_system_name;
  public customer: Customer = new Customer();


  public loader = false;
  public text: string;
  public rating = 0;
  public errorMsg = false;

  constructor(
    private cartService: CartService,
    private cartStore: CartStoreService,
    private appService: AppService,
    private angulartics2: Angulartics2,
    private router: Router,
    private customerStore: CustomerStoreService
  ) {}

  ngOnInit() {
    this.customer = this.customerStore.customer;
    if (!this.customer) {
      this.customer = new Customer();
      this.customer.isActive = false;
      this.customer.role_ids = [];
    }
    this.customerStore.customerUpdated.subscribe(res => {
      this.customer = res;
      if (!this.customer) {
        this.customer = new Customer();
        this.customer.isActive = false;
        this.customer.role_ids = [];
      }
    });
    this.loader = true;
    if (this.appService.isBrowser) {
      this.cartService.getMyOrders(1, 1).subscribe(value => {
        if ((value as any).orders) {
          (value as any).orders.forEach(order => {
            this.orderTotal = order.order_total;
            this.orderId = order.id;
            this.orderItems = order.order_items;
            this.orderTax = order.order_tax;
            this.orderShipping = order.order_shipping_excl_tax;
            this.payment_method_system_name = order.payment_method_system_name;
            let a = order.transaction_id;
          });
          this.loader = false;
          this.cartService.getEventStatus(this.orderId).subscribe(result => {
            if (result === false) {
              this.cartService
                .getOrderItemCategories(this.orderId)
                .subscribe((result2: any) => {
                  this.sendOrder(result2.List);
                });
            } else {
              this.router.navigate(["/"]);
            }
          });
        }
      });
    }
  }

  review() {
    this.errorMsg = false;
    if (this.rating) {
      this.cartService
        .rateOrder({
          orderId: this.orderId,
          rate: this.rating,
          review: this.text
        })
        .subscribe(res => {
          this.router.navigate(["/"]);
        });
    } else {
      this.errorMsg = true;
    }
  }

  sendOrder(catList: string[]) {
    const productsList = this.orderItems.map((item, index) => {
      return {
        id: item.product.id,
        price:
          item.product.price_model.price_with_discount_without_formatting ||
          item.product.price_model.price_without_formatting,
        quantity: item.quantity,
        category: catList[index],
        name: item.product.name
      };
    });
    this.angulartics2.eventTrack.next({
      // action: '',
      properties: {
        event: "purchaseConfirmation",
        gtmCustom: {
          ecommerce: {
            currencyCode: "INR",
            purchase: {
              orderValue: this.orderTotal,
              actionField: {
                id: this.orderId,
                revenue: this.orderTotal,
                tax: this.orderTax,
                shipping: this.orderShipping
              },
              products: productsList
            }
          }
        }
      }
    });
  }

  ngOnDestroy() {}
}
