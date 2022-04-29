import { Component, OnInit, OnDestroy } from "@angular/core";
import { PaymentMethod, PaymentMethodsDTO } from 'src/store/cart/paymentMethods.model';
import { breadcrumb } from 'src/modules/shared/breadcrumb/breadcrumb.model';
import { Subject } from 'rxjs';
import { CartStoreService } from 'src/store/cartStore.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { AppService } from 'src/services/app.service';
import { takeUntil } from 'rxjs/operators';
import { ShoppingCartsItem } from 'src/store/cart/ShoppingCart.model';

@Component({
  selector: "app-payments",
  templateUrl: "./payments.component.html",
  styleUrls: ["./payments.component.scss"]
})
export class PaymentsComponent implements OnInit, OnDestroy {
  public paymentMethods: PaymentMethod[] = [];
  public breadcrumbList: breadcrumb[] = [
    { title: "Home", link: "/" },
    { title: "Cart", link: "/cart" },
    { title: "Shipping Address", link: "/checkout" },
    { title: "Payment Methods", link: "/payments" }
  ];
  public unSubscribeSubject = new Subject();
  constructor(
    private cartStore: CartStoreService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private appService: AppService
  ) {}

  ngOnInit() {
    this.cartStore.getCart();
    this.cartStore.orderTotalUpdated
      .pipe(takeUntil(this.unSubscribeSubject))
      .subscribe(item => {
        try {
          this.sendGTMTag(this.cartStore.cart.shopping_carts);
        } catch (err) {}
      });
    const result: PaymentMethodsDTO = this.route.snapshot.data.paymentMethods;
    this.paymentMethods = result.payment_methods;
  }

  sendGTMTag(cart: ShoppingCartsItem[]) {
    if (this.appService.isBrowser) {
      this.cartService
        .getCartItemCategories()
        .subscribe((value: { List: string[] }) => {
          (window as any).dataLayer = (window as any).dataLayer || [];
          const productCheckoutArray = cart.map((it, index) => {
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
                actionField: { step: 3 }
              }
            },
            event: "eec.checkout.step3"
          };

          (window as any).dataLayer.push(ecommerceObject);
        });
    }
  }

  ngOnDestroy() {
    this.unSubscribeSubject.next();
    this.unSubscribeSubject.complete();
  }
}
