import { Injectable } from '@angular/core';
import { CartService } from '../../services/cart.service';

import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ShoppingCartRootObject } from 'src/store/cart/ShoppingCart.model';

@Injectable()
export class CartResolver implements Resolve<any> {
  constructor(private cartService: CartService) {}

  resolve(): Observable<ShoppingCartRootObject> {
    return this.cartService.getCart(false);
  }
}
