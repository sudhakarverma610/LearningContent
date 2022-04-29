import { Injectable } from "@angular/core";
import { CartService } from "../../../services/cart.service";

import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs";
import { ShoppingCartRootObject } from "src/store/cart/ShoppingCart.model";
import { OrderRootObject } from "src/store/order.model";

@Injectable()
export class RetryPaymentResolver implements Resolve<any> {
  constructor(private cartService: CartService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<OrderRootObject> {
    return this.cartService.getOrder(route.params["orderId"]);
  }
}
