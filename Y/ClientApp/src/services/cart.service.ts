import { Injectable } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { BehaviorSubject, noop, Observable, forkJoin, of, Subject } from 'rxjs';
import { CustomerStoreService } from 'src/store/customerStore.service';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { CartStoreService } from 'src/store/cartStore.service';
import { StoreService } from 'src/store/store.service';
import { ProductStoreService } from 'src/store/productsStore.service';
import { AppService } from 'src/services/app.service';
import { ShoppingCartRootObject, CartPushData } from 'src/store/cart/ShoppingCart.model';
import { map, mergeMap, tap } from 'rxjs/operators';
import { Product } from 'src/store/products/products.model';
import { CouponResponse } from 'src/store/cart/couponModel';
import { PaymentMethodsDTO } from 'src/store/cart/paymentMethods.model';
import { PreOrderPushDTO, PreOrderResponseDTO } from 'src/store/cart/order.model';
import { State, Customer, AddressesItem } from 'src/store/Customer/customer.model';
import { PincodeDataModel } from 'src/store/yjStoreModels/PincodeData.model';
import { CheckoutAttributeDtoResponse } from 'src/store/cart/CheckoutAttributes';
import { OrderRootObject } from 'src/store/order.model';

const CART_STATE = makeStateKey('cartState');

@Injectable()
export class CartService {
  public location;
  public cartLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public pushToCart: Subject<any> = new Subject();

  constructor(
    private customerStore: CustomerStoreService,
    private http: HttpClient,
    private state: TransferState,
    private cartStore: CartStoreService,
    private storeService: StoreService,
    private productStore: ProductStoreService,
    private appService: AppService,
    location: Location
  ) {
    this.location = location;
    this.storeService.loginStatusSubject.subscribe(value => {
      this.getCart(true).subscribe(noop);
    });

    this.pushToCart.subscribe(data => {
      this.pushCart(data).subscribe(noop);
    });
  }

  getDeliveryStatus(pincode): Observable<DeliveryStatus> {
    return this.http.get<DeliveryStatus>('/api/servicesbypin/' + pincode);
  }

  getCart(update: boolean): Observable<ShoppingCartRootObject> {
    if (update) {
      this.cartLoading.next(true);
    }

    if (!update && this.cartStore.getCartStatus()) {
      return new Observable<ShoppingCartRootObject>(observer => {
        observer.next(this.cartStore.getCart());
        observer.complete();
      });
    }

    if (!this.appService.isBrowser) {
      return new Observable<ShoppingCartRootObject>(observer => {
        observer.next(this.cartStore.getCart());
        observer.complete();
      });
    }
    return this.http
      .get<ShoppingCartRootObject>(`/api/shopping_cart_items/1`)
      .pipe(
        map(item => {
          this.state.set(CART_STATE, item);
          this.cartLoading.next(false);
          return this.cartStore.setCart(item);
        })
      );
  }

  updateCart() {
    this.getCart(true).subscribe(noop);
  }

  pushCart(data: CartPushData) {
    return this.http
      .post<ShoppingCartRootObject>(`/api/shopping_cart_items`, data)
      .pipe(
        map(item => {
          if (!Object.prototype.hasOwnProperty.call(item, 'Error')) {
            this.state.set(CART_STATE, item);
            return this.cartStore.setCart(item);
          }
          return item;
        })
      );
  }

  addToCart(
    product: Product,
    attributes: { id: number; value: String }[],
    giftCardAttributes,
    configurator = true,
    quantity = 1
  ): Observable<ShoppingCartRootObject> {
    this.productStore.addSingleProduct(product);
    this.addToCartAnalytics(product);

    const data = {
      gift_card_attributes: giftCardAttributes,
      product_id: parseInt(product.id, 10),
      cart_type_id: 1,
      cart_item_id: 0,
      updatecartitem: false,
      customer_entered_price: 0,
      attributes,
      quantity
    };
    if (giftCardAttributes) {
      if (giftCardAttributes.customer_entered_price) {
        data.customer_entered_price = giftCardAttributes.customer_entered_price;
        delete data.gift_card_attributes.customer_entered_price;
      }

      if (giftCardAttributes.quantity) {
        data.quantity = giftCardAttributes.quantity;
        delete data.gift_card_attributes.quantity;
      }
    }
    return this.pushCart(data).pipe(
      map(item => {
        if (configurator) {
          this.cartStore.newItemAddedInCart.next(item.shopping_carts);
        }
        return item;
      })
    );
  }

  removeProduct(cartItemId): Observable<ShoppingCartRootObject> {
    return this.http
      .delete<ShoppingCartRootObject>(`/api/shopping_cart_items/` + cartItemId)
      .pipe(
        map(item => {
          this.state.set(CART_STATE, item);
          return this.cartStore.setCart(item);
        })
      );
  }

  addToCartAnalytics(product: Product) {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: 'addToCart',
      ecommerce: {
        currencyCode: 'INR',
        add: {
          products: [
            {
              id: product.id,
              name: product.name,
              price: product.price_model.price_without_formatting,
              quantity: '1'
            }
          ]
        }
      }
    });
  }

  getRewardPoints(): Observable<{ points: number }> {
    return this.http.get<{ points: number }>('/api/getRewardPoints');
  }

  setRewardPointsCheckoutAttribute(status) {
    const data = { status };
    return this.http.post('/api/setRewardPointsCheckoutAttribute', data);
  }

  applyDiscountCode(
    coupon
  ): Observable<[CouponResponse, ShoppingCartRootObject]> {
    return this.http.get<CouponResponse>(`/api/apply_voucher/` + coupon).pipe(
      mergeMap(response => {
        return forkJoin(of(response), this.getCart(true));
      })
    );
  }

  removeGiftCard(id): Observable<ShoppingCartRootObject> {
    return this.http
      .get<ShoppingCartRootObject>(`/api/remove_giftCard/` + id)
      .pipe(
        map(item => {
          this.state.set(CART_STATE, item);
          return this.cartStore.setCart(item);
        })
      );
  }

  removeDiscount(): Observable<ShoppingCartRootObject> {
    return this.http.get<ShoppingCartRootObject>(`/api/remove_discount`).pipe(
      map(item => {
        this.state.set(CART_STATE, item);
        return this.cartStore.setCart(item);
      })
    );
  }

  removeDiscountsById(item: string) {
    return this.http
      .get<ShoppingCartRootObject>(`/api/remove_discount_by_id/${item}`)
      .pipe(
        map(item => {
          this.state.set(CART_STATE, item);
          return this.cartStore.setCart(item);
        })
      );
  }

  getPaymentMethods(): Observable<PaymentMethodsDTO> {
    return this.http.get<PaymentMethodsDTO>(`/api/payment_methods`);
  }

  postPrePaymentOrderData(
    data: PreOrderPushDTO
  ): Observable<PreOrderResponseDTO> {
    return this.http.post<PreOrderResponseDTO>(
      '/api/prePaymentOrderData',
      data
    );
  }

  processResponse(instrumentString) {
    return this.http.post<{ success: boolean }>(
      '/api/gpayOrderResponse',
      instrumentString
    );
  }

  confirmOrder() {
    return this.http.get(`/api/confirmOrder`).pipe(
      tap((item: any) => {
        if (item.status === 'Order Confirmed') {
          this.getCart(true).subscribe(noop);
          this.cartStore.orderAttributes = [];
        }
      })
    );
  }

  getStates(): Observable<State[]> {
    if (this.customerStore.getStatesStatus()) {
      return of(this.customerStore.getStates());
    }
    return this.http
      .get<State[]>('/country/getstatesbycountryid?countryId=133')
      .pipe(
        tap(item => {
          this.customerStore.setStates(item);
        })
      );
  }

  getPincodeData(pincode): Observable<PincodeDataModel> {
    const data = this.customerStore.getPostalData(pincode);
    if (data) {
      return of(data);
    }
    return this.http
      .get<PincodeDataModel>('/api/pincodeDetails/' + pincode)
      .pipe(
        tap(item => {
          this.customerStore.setPostalData(pincode, item);
        })
      );
  }

  getAccountDetails(freshUpdate = false): Observable<Customer> {
    if (!freshUpdate && this.customerStore.getCustomerFetchedStatus()) {
      return of(this.customerStore.getCustomer());
    }
    return this.http.get<{ customers: Customer[] }>('/api/me').pipe(
      map(item => {
        this.customerStore.setCustomer(item.customers[0]);
        return item.customers[0];
      })
    );
  }

  setAsShipping(address: AddressesItem): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>('/api/setshippingaddressbyid', address)
      .pipe(
        map(item => {
          this.customerStore.setCustomerFetched(false);
          return item;
        })
      );
  }

  setAsBilling(address): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>('/api/setbillingaddressbyid', address)
      .pipe(
        map(item => {
          this.customerStore.setCustomerFetched(false);
          return item;
        })
      );
  }

  addAddress(data: AddressesItem, isBilling: boolean): Observable<{ message: string, id: number }> {
    if (data.id && data.id !== '') {
      return this.http.put<{ message: string, id: number }>('/api/editaddress', data).pipe(
        map(item => {
          this.customerStore.setCustomerFetched(false);
          return item;
        })
      );
    }

    let url = isBilling ? '/api/setbillingaddress' : '/api/setshippingaddress';

    return this.http.post<{ message: string, id: number }>(url, data).pipe(
      map(item => {
        this.customerStore.setCustomerFetched(false);
        return item;
      })
    );
  }

  getAllCheckoutAttributes(): Observable<CheckoutAttributeDtoResponse> {
    return this.http.get<CheckoutAttributeDtoResponse>(
      `/api/getcheckoutattributes`
    );
  }

  saveCheckoutAttributes(data): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(
      `/api/updatecheckoutattributes`,
      data
    );
  }

  getMyOrders(page, limit) {
    const data = {
      page,
      limit
    };
    return this.http.post('/api/orders/customerGTMDetails', data);
  }

  getEventStatus(orderId) {
    return this.http.get('/api/checkAnalyticsStatus/' + orderId);
  }

  getOrderItemCategories(orderId) {
    return this.http.get('/api/getOrderItemCategories/' + orderId);
  }

  getCartItemCategories() {
    return this.http.get('/api/getCartItemCategories');
  }

  pushOrder(data) {
    return this.http.post('/api/setPaymentInfo', data);
  }

  rateOrder(data) {
    return this.http.post('/api/rateOrder', data);
  }

  deleteAddress(id) {
    return this.http.get('/api/deleteaddres/' + id);
  }

  getProductImageById(id): Observable<{ src: string }> {
    return this.http.get<{ src: string }>('/api/product_img_by_picture/' + id);
  }

  getOrder(id): Observable<OrderRootObject> {
    return this.http.get<OrderRootObject>('/api/orders/' + id);
  }

  retryPayment(id, data) {
    return this.http.post('/api/retryPayment/' + id, data, {
      responseType: 'text'
    });
  }

  getEligibleRewardAmount(amount): Observable<{ amount: string }> {
    return this.http.get<{ amount: string }>(
      '/api/getEligibleRewardPoints/' + amount
    );
  }
}

export interface DeliveryStatus {
  AirValueLimit: number;
  AirValueLimiteTailPrePaid: number;
  ApexEconomyInbound: string;
  ApexEconomyOutbound: string;
  ApexInbound: string;
  ApexOutbound: string;
  ApexTDD: string;
  AreaCode: string;
  DPDutsValueLimit: string;
  DomesticPriorityInbound: string;
  DomesticPriorityOutbound: string;
  DomesticPriorityTDD: string;
  EDLAddDays: string;
  EDLDist: string;
  EDLProduct: string;
  Embargo: string;
  GroundInbound: string;
  GroundOutbound: string;
  GroundValueLimit: number;
  GroundValueLimiteTailPrePaid: number;
  PincodeDescription: string;
  ServiceCenterCode: string;
  ETailCODAirInbound: string;
  ETailCODAirOutbound: string;
  ETailCODGroundInbound: string;
  ETailCODGroundOutbound: string;
  ETailExpressCODAirInbound: string;
  ETailExpressCODAirOutbound: string;
  ETailExpressPrePaidAirInbound: string;
  ETailExpressPrePaidAirOutound: string;
  ETailPrePaidAirInbound: string;
  ETailPrePaidAirOutound: string;
  ETailPrePaidGroundInbound: string;
  ETailPrePaidGroundOutbound: string;
}

