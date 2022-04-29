import { Component, OnDestroy, OnInit, Input } from "@angular/core";
import { Customer } from "src/store/Customer/customer.model";
import { CustomerStoreService } from "src/store/customerStore.service";
import { OrderRootObject } from "src/store/order.model";
import { CartService } from "../../../services/cart.service";
import { AppService } from 'src/services/app.service';

@Component({
  selector: "app-orderplacementfailure",
  templateUrl: "./orderPlacementFailure.component.html",
  styleUrls: ["./orderPlacementFailure.component.scss"]
})
export class OrderPlacementFailureComponent implements OnDestroy, OnInit {
  public orderId;
  public paymentFailed = false;
  public customer: Customer = new Customer();
  constructor(
    private cartService: CartService,
    private appService: AppService,
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
    this.appService.loader.next(true);
    if (this.appService.isBrowser) {
      this.cartService.getMyOrders(1, 1).subscribe((value: OrderRootObject) => {
        if (value.orders && value.orders.length > 0) {
          const order = value.orders[0];
          if (
            order.order_status === "Pending" &&
            order.payment_status === "Pending"
          ) {
            this.orderId = order.id;
            this.paymentFailed = true;
          }
        }
        this.appService.loader.next(false);
      });
    }
  }

  ngOnDestroy() {}
}
