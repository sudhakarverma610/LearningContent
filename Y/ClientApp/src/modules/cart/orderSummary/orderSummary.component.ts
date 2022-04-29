import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output
} from '@angular/core';
import { CartStoreService } from 'src/store/cartStore.service';
import {
  ShoppingCartRootObject,
  OrderTotalRootObject
} from 'src/store/cart/ShoppingCart.model';
import { CartService } from '../../../services/cart.service';
import { Customer } from 'src/store/Customer/customer.model';
import { Subject, noop } from 'rxjs';
import { StoreService } from 'src/store/store.service';
import { Angulartics2 } from 'angulartics2';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CustomerStoreService } from 'src/store/customerStore.service';
import { takeUntil } from 'rxjs/operators';
import { CouponResponse } from 'src/store/cart/couponModel';
import { VerifyCustomerComponent } from 'src/modules/customerVerfication/verifyCustomer/verifyCustomer.component';
import { NotificationsEntity } from 'src/modules/notification/notification.service';
import { NotificationHandlerService } from 'src/modules/notification/notification.handle.service';
import { CheckoutAttribute, SelectedCheckoutAttributesValue } from 'src/store/cart/CheckoutAttributes';
import { AppService } from '../../../services/app.service';

@Component({
  selector: 'app-order-summary',
  templateUrl: './orderSummary.component.html',
  styleUrls: ['./orderSummary.component.scss']
})
export class OrderSummaryComponent implements OnInit, OnDestroy {
  public cart: ShoppingCartRootObject = new ShoppingCartRootObject();
  public total = 0;
  public IsGiftBoxSelected = false;
  public discountApplied = false;
  public couponInput: string;
  public couponInputError: string;
  public couponInputErrorStatus: boolean;
  public couponInputPlaceholder1 = 'Discount code, Voucher...';
  public couponInputPlaceholder2 = 'more code? more voucher?';
  public redeemRewards: boolean = false;
  public charmingCreditsAvailable = 0;
  public willEarnCharminCredits = 0;
  public summerSale = false;
  public orderTotal: OrderTotalRootObject = new OrderTotalRootObject();
  public button1 = true;
  public button2 = false;
  public customer = new Customer();
  public isGuest = true;
  public notPayments = true;
  public eligibleRewardAmount = '0';
  public isGift = false;
  public scrollY: number = 0;
  public customerStatus: {
    id: number;
    email: string;
    isGuest: boolean;
    isActive: boolean;
    isRegisterred: boolean;
  };
  @Output()
  goPay: EventEmitter<any> = new EventEmitter();
  private unsubscribeSubject = new Subject();
  public checkoutAttribute: CheckoutAttribute[];
  constructor(
    private appService: AppService,
    private cartStore: CartStoreService,
    private cartService: CartService,
    private store: StoreService,
    private angulartics2: Angulartics2,
    private router: Router,
    public dialog: MatDialog,
    private customerStore: CustomerStoreService,
    private notificationHandler: NotificationHandlerService
  ) { }

  ngOnInit() {
    this.unsubscribeSubject = new Subject();
    this.init();
    this.cartService.getAllCheckoutAttributes().subscribe(res => {
      this.checkoutAttribute = res.attributes.attributes;
    });
    this.cartService
      .getRewardPoints()
      .subscribe((value: { points: number }) => {
        if (value.points) {
          this.charmingCreditsAvailable = value.points;
        }
        window.scrollTo(0, 0);
      });
    this.cartStore.cartQuanityUpdated.subscribe(value => {
      this.init();
    });
    this.summerSale = this.store.getDiscountStatus('summer-sale');
    this.store.discountUpdated.subscribe(value => {
      this.summerSale = this.store.getDiscountStatus('summer-sale');
    });
    this.cartStore.orderTotalUpdated
      .pipe(takeUntil(this.unsubscribeSubject))
      .subscribe(item => {
        this.orderTotal = item;
        if (this.orderTotal.orderTotals.total) {
          this.cartService
            .getEligibleRewardAmount(this.orderTotal.orderTotals.total)
            .subscribe(res => {
              this.eligibleRewardAmount = res.amount || '0';
            });
        }
        this.cart = this.cartStore.cart;
        if (!this.orderTotal.orderTotals.appliedDiscount) {
          this.orderTotal.orderTotals.appliedDiscount = [];
        }
        this.orderTotal.orderTotals.appliedDiscount = [
          ...this.orderTotal.orderTotals.appliedDiscount,
          ...this.cart.shopping_carts.reduce((acc, cur) => {
            const temp = cur.appliedDiscount.filter(
              a => !acc.some(b => b === a)
            );
            return [...acc, ...temp];
          }, [])
        ];
        this.total = this.cart.shopping_carts.reduce((acc, cur) => {
          return acc + cur.quantity;
        }, 0);
        if (this.appService.isBrowser) {
          window.scrollTo(0, this.scrollY);
        }
      });
    this.cartStore.getOrderTotal();
    if (this.router.isActive('/cart', false)) {
      this.button1 = true;
      this.button2 = false;
      this.notPayments = true;
    } else if (this.router.isActive('/checkout', false)) {
      this.button1 = false;
      this.button2 = true;
      this.notPayments = true;
    } else if (this.router.isActive('/payments', false)) {
      this.button1 = false;
      this.button2 = false;
      this.notPayments = false;
    } else {
      this.button1 = false;
      this.button2 = false;
      this.notPayments = true;
    }
    this.customerStatus = this.customerStore.getCustomerStatus();
    this.customer = this.customerStore.customer;
    if (!this.customer) {
      this.customer = new Customer();
      this.customer.isActive = this.customerStatus.isActive;
      this.customer.role_ids = [];
    }
    this.isGuest = this.customerStatus.isGuest;
    this.customer.isActive = this.customerStatus.isActive;
    if (
      !this.customer.isActive &&
      this.orderTotal.orderTotals.RedeemedRewardPoints > 0
    ) {
      this.cartService
        .setRewardPointsCheckoutAttribute(false)
        .subscribe(result => {
          this.refreshOrder();
        });
    }
    this.customerStore.customerUpdated.subscribe(res => {
      this.customer = res;
      this.customerStatus = this.customerStore.getCustomerStatus();
      if (!this.customer) {
        this.customer = new Customer();
        this.customer.isActive = this.customerStatus.isActive;
        this.customer.role_ids = [];
      }
      this.isGuest = this.customerStatus.isGuest;
      this.customer.isActive = this.customerStatus.isActive;
    });
  }

  init() {
    this.cart = this.cartStore.getCart();
    this.isGift = !this.cartStore.orderTotal.orderTotals.RequiresShipping;
    this.willEarnCharminCredits = this.cartStore.orderTotal.orderTotals.WillEarnRewardPoints;
  }

  GiftBoxValueChanged(eventdata, id, value) {
    let data: SelectedCheckoutAttributesValue = {
      id: id,
      value: value
    };
    data.value = eventdata ? '1' : '0';

    this.cartService.saveCheckoutAttributes(data).subscribe(res => {
      this.cartService.getAllCheckoutAttributes().subscribe(res1 => {
        this.checkoutAttribute = res1.attributes.attributes;
        this.refreshOrder();
       });
    });

  }

  refreshOrder() {
    this.scrollY = window.pageYOffset;
    this.cartStore.getOrderTotal();
    this.willEarnCharminCredits = this.cartStore.orderTotal.orderTotals.WillEarnRewardPoints;
  }

  setRewardPointsCheckoutAttribute() {
    const newStatus =
      this.cartStore.orderTotal.orderTotals.RedeemedRewardPoints === 0;
    this.cartService
      .setRewardPointsCheckoutAttribute(newStatus)
      .subscribe(result => {
        this.redeemRewards = newStatus;
        this.refreshOrder();
      });
  }

  verifyUser() {
    const dialogRef = this.dialog.open(VerifyCustomerComponent, {
      width: '250px',
      data: { customer: this.customer }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.success) {
        this.cartService.getAccountDetails(true).subscribe(noop);
      }
    });
  }

  applyDiscount() {
    if (this.couponInput) {
      this.couponInputErrorStatus = false;
      this.cartService
        .applyDiscountCode(this.couponInput)
        .subscribe((response: [CouponResponse, ShoppingCartRootObject]) => {
          this.couponInput = undefined;
          if (response[0].isApplied) {
            this.discountApplied = response[0].discount;
            this.refreshOrder();
          } else {
            this.couponInputError =
              response[0].message.length > 0
                ? response[0].message
                : 'This Coupon code is not valid for your cart.';
            this.couponInputErrorStatus = true;
          }
        });
    } else {
      this.couponInputError = 'Invalid coupon';
      this.couponInputErrorStatus = true;
    }
  }

  removeGiftVoucher(id) {
    this.cartService.removeGiftCard(id).subscribe(value => {
      this.refreshOrder();
    });
  }

  removeDiscounts() {
    this.cartService.removeDiscount().subscribe(value => {
      this.refreshOrder();
      this.discountApplied = false;
    });
  }

  removeDiscountsById(item: string) {
    this.cartService.removeDiscountsById(item).subscribe(value => {
      this.refreshOrder();
    });
  }

  goToPay() {
    this.goPay.emit();
  }

  showStudError() {
    const data = new NotificationsEntity();
    data.notification_id = 'default_1';
    data.url = '/';
    data.heading = 'You can not place order without adding additional products(other than stud) in cart.';
    data.content = '';
    this.notificationHandler.newNotification.next(data);
  }

  checkoutAnalytics() {
    if (this.orderTotal.orderTotals.SubTotal === '₹ 0') {
      this.showStudError();
      return;
    }
    this.cartService
      .getCartItemCategories()
      .subscribe((value: { List: string[] }) => {
        this.angulartics2.eventTrack.next({
          // action: 'Adding product to cart',
          properties: {
            event: 'checkout',
            gtmCustom: {
              ecommerce: {
                currencyCode: 'INR',
                add: {
                  products: this.cart.shopping_carts.map((item, index) => {
                    return {
                      id: item.product_id,
                      name: item.product.name,
                      price: item.product.price_model.price_without_formatting,
                      quantity: item.quantity.toString(),
                      category: value.List[index]
                    };
                  })
                }
              }
            }
          }
        });
        if (this.isGuest) {
          this.customerStore.isCheckout = true;
          this.router.navigate(['/auth/login'], {
            queryParams: { returnUrl: '/cart', type: 2 }
          });
          return;
        }
        this.router.navigate(['/checkout']);
      });
  }

  ngOnDestroy() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }
}
