import { Component, OnInit, ApplicationRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { noop } from 'rxjs';
import { CustomerStoreService } from 'src/store/customerStore.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { CartService } from 'src/services/cart.service';
import { StoreService } from 'src/store/store.service';
import { AuthService } from 'src/services/auth.service';
import { NotificationService } from 'src/modules/notification/notification.service';
import { NotificationHandlerService } from 'src/modules/notification/notification.handle.service';
import { AppService } from 'src/services/app.service';
@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)', opacity: 1 }),
        animate('500ms', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class BaseComponent implements OnInit {
  public data; // data variable to store data returned by the resolver
  public navOpen = false;
  public notificationState = false;
  public whatsappIconState = false;
  public summerSale = false;
  public customer;
  public isFooterShow = true;
  public newNotification = 0;
  public showNotificationIconAnimation = false;
  constructor(
    private cartService: CartService,
    public store: StoreService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private notificationService: NotificationService,
    private notificationHandler: NotificationHandlerService,
    private customerStore: CustomerStoreService,
    private appService: AppService
  ) { }
  ngOnInit() {
    this.isFooterShow = true;
    this.notificationHandler.newNotificationView.subscribe(res => {
      this.newNotification = res;
      if (res) {
        this.showNotificationIconAnimation = true;
        const self = this;
        setTimeout(() => {
          self.showNotificationIconAnimation = false;
        }, 1500);
        if (window.innerWidth > 969) {
          this.openNotificationPanel();
        }
      }
    });
    this.appService.footerShow.subscribe(value => {
      this.isFooterShow = value;
    });
    this.notificationService.notificationState.subscribe(value => {
      this.notificationState = value;
    });

    this.cartService.getCart(true).subscribe(noop);
    this.data = this.route.snapshot.data;
    this.authService.isNotificationDone.subscribe(res => {
      if (!res && this.customerStore.getCustomerStatus()) {
        this.authService.isNotificationDone.next(true);
        this.customer = res;
        const isGuest = this.customerStore.getCustomerStatus().isGuest;
        if (!isGuest && this.customerStore.getCustomerStatus().isActive) {
          const self = this;
          this.openRegisterPopUp3();
          setTimeout(() => {
            self.openRewardsPoints();
          }, 20000);
        }
        if (!isGuest && !this.customerStore.getCustomerStatus().isActive) {
          this.openRegisterPopUp2();
        }
        if (isGuest) {
          this.openRegisterPopUp();
        }
      }
    });
  }
  openNotificationPanel() {
    this.notificationHandler.openPopUp.next(true);
    this.newNotification = 0;
    this.notificationHandler.newNotificationView.next(0);
  }
  openRewardsPoints() {
    this.notificationService.getRewardPointsUpStatus().subscribe(res => {
      if (res) {
        this.notificationService
          .getRewardPointsPopUpData()
          .subscribe(result => {
            this.notificationHandler.newNotification.next(result);
          });
      }
    });
  }
  openRegisterPopUp() {
    this.notificationHandler.newNotification.next(this.notificationService.getWelcomePopUpData());
  }

  openRegisterPopUp2() {
    this.notificationHandler.newNotification.next(this.notificationService.getWelcomePopUp2Data());
  }

  openRegisterPopUp3() {  }

  closeNavDropPanel() {
    this.store.closeNavDropPanel.next(true);
  }
  // isShowScrollTop() {
  //   return document.scrollingElement.clientHeight < document.scrollingElement.scrollTop;
  // }
  // ScrollTop() {
  //   window.scrollTo(0, 0);
  // }
}
