import { Injectable } from '@angular/core';
import { CartService } from '../../services/cart.service';

import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { PaymentMethodsDTO } from 'src/store/cart/paymentMethods.model';

@Injectable()
export class PaymentMethodsResolver implements Resolve<any> {
  constructor(private cartService: CartService) {}

  resolve(): Observable<PaymentMethodsDTO> {
    return this.cartService.getPaymentMethods();
  }
}
