import { Injectable, Optional, Inject } from '@angular/core';
import {
  CheckoutAttribute,
  SelectedCheckoutAttributesValue
} from './cart/CheckoutAttributes';
import {
  ShoppingCartRootObject,
  ShoppingCartsItem,
  OrderTotalRootObject
} from './cart/ShoppingCart.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { PaymentMethod } from './cart/paymentMethods.model';
import { HttpClient } from '@angular/common/http';
import { ProductStoreService } from './productsStore.service';

@Injectable()
export class CartStoreService {
  public checkoutAttributes: CheckoutAttribute[];
  public checkoutAttributesFetched: boolean;

  public selectedAttributeValues: SelectedCheckoutAttributesValue[] = [];

  public cart: ShoppingCartRootObject = new ShoppingCartRootObject();
  public cartFetched: boolean;
  public cartQuantity = 0;
  public cartQuanityUpdated = new BehaviorSubject<boolean>(false);

  public orderAttributes: { key: string; value: string }[] = [];

  public choosenPaymentMethod = new PaymentMethod();

  public newItemAddedInCart = new Subject<ShoppingCartsItem[]>();

  public orderTotal: OrderTotalRootObject = new OrderTotalRootObject();
  public orderTotalUpdated = new BehaviorSubject<OrderTotalRootObject>(
    this.orderTotal
  );

  constructor(
    private http: HttpClient,
    private productStore: ProductStoreService
  ) {}

  getCheckoutAttributes() {
    return this.checkoutAttributes;
  }

  getCheckoutAttributesfetchingStatus() {
    return this.checkoutAttributesFetched;
  }

  saveCheckoutAttributes(input: CheckoutAttribute[]) {
    this.checkoutAttributes = input;
    this.checkoutAttributesFetched = true;
  }

  getSelectedCheckoutAttributeValue(checkoutAttributeId: number) {
    const selectedValueObj = this.selectedAttributeValues.filter(
      item => item.id === checkoutAttributeId
    );
    if (selectedValueObj.length > 0) {
      return this.checkoutAttributes
        .filter(item => item.Id === checkoutAttributeId)[0]
        .CheckoutAttributeValues.filter(
          item => item.Id.toString() === selectedValueObj[0].value
        )[0];
    }
    return null;
  }

  selectAttributeValue(id, value) {
    const attributeIndex = this.selectedAttributeValues
      .map(function(x) {
        return x.id;
      })
      .indexOf(id);
    if (attributeIndex >= 0) {
      this.selectedAttributeValues[attributeIndex].value = value.toString();
    } else {
      this.selectedAttributeValues.push({ id, value: value.toString() });
    }
  }

  getAllSelectedAttributeValues() {
    return { checkoutAttributes: this.selectedAttributeValues };
  }

  getCart() {
    return this.cart;
  }

  setCart(input: ShoppingCartRootObject): ShoppingCartRootObject {
    this.cart = {
      ...input,
      shopping_carts: input.shopping_carts.map(it => {
        if (it.product) {
          this.productStore.addSingleProduct(it.product);
          return it;
        } else {
          return {
            ...it,
            product: this.productStore.getProductById(it.product_id)
          };
        }
      })
    };
    this.cartFetched = true;
    this.getOrderTotal();
    this.updateCartQuantity();
    return this.cart;
  }

  getOrderTotal() {
    this.http
      .get<OrderTotalRootObject>(`/api/getOrderTotal`)
      .subscribe(result => {
        this.orderTotal = result;
        this.orderTotalUpdated.next(result);
      });
  }

  getCartStatus() {
    return this.cartFetched;
  }

  setCartStatus(input: boolean) {
    this.cartFetched = input;
  }

  updateCartQuantity() {
    if (this.cartFetched) {
      this.cartQuantity = this.cart.shopping_carts.reduce(
        (acc, cur) => acc + cur.quantity,
        0
      );
      this.cartQuanityUpdated.next(true);
    }
  }

  getCartQuanity() {
    return this.cartQuantity;
  }

  addOrderAttributes(input: { key: string; value: string }) {
    const found = this.orderAttributes.findIndex(
      item => item.key === input.key
    );
    if (found > -1) {
      this.orderAttributes[found].value = input.value;
    } else {
      this.orderAttributes.push({ ...input });
    }
  }

  getOrderAttributes() {
    return this.orderAttributes;
  }

  setPaymentMethod(input: PaymentMethod) {
    this.choosenPaymentMethod = input;
  }

  getPaymentMethod(): PaymentMethod {
    return this.choosenPaymentMethod;
  }
}
