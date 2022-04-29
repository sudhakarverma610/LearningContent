import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProfileService } from '../profile.service';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject, noop } from 'rxjs';
import { ShipmentDetailsModel } from './shipmentDetailsModel';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../../../services/cart.service';
import { AppService } from 'src/services/app.service';
import { TrackComponent } from './track/track.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/modules/shared/Confirmation-dialog/Confirmation-dialog.component';

@Component({
  selector: 'app-myorders',
  templateUrl: './myOrders.component.html',
  styleUrls: ['./myOrders.component.scss']
})
export class MyOrdersComponent implements OnDestroy, OnInit {
  public myOrders = [];
  public totalSpending = 0;
  public showMessageNoOrders = true;
  public trackingDetails: ShipmentDetailsModel;
  public unsubscribeSubject = new Subject();
  public scrollDistance = 2;
  public orderListPage = 1;
  public orderListLimit = 2;
  public fetchingOrder = false;
  public allOrderFetched = false;
  public loader = false;
  public trackLoading = false;
  public scrollyPosition=0;
  public success =
    'https://files.y.jewelry/assets/img/icons/rounded_tick_icon.svg';
  public error = 'https://files.y.jewelry/assets/img/exclamation.png';
  public symbolMsg =
    'https://files.y.jewelry/assets/img/icons/rounded_tick_icon.svg';
  public message = '';
  public showMessage = false;
  constructor(
    private profileService: ProfileService,
    private cartService: CartService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    private appService: AppService
  ) {}

  ngOnInit() {
    this.unsubscribeSubject = new Subject();
    this.route.url
      .pipe(
        takeUntil(this.unsubscribeSubject),
        tap(value => this.InitData())
      )
      .subscribe(noop);
  }

  InitData() {
    this.appService.loader.next(true);
    this.profileService
      .getMyOrders(this.orderListPage, this.orderListLimit)
      .subscribe(value => {
        this.myOrders = [];
        this.totalSpending = 0;

        if ((value as any).orders) {
          (value as any).orders.forEach(order => {
            const tempObj = { ...order };
            tempObj.active = false;
            tempObj.isTracking = false;
            this.totalSpending = this.totalSpending + order.order_total;
            this.myOrders.push(tempObj);
          });
        } else {
          this.myOrders = [];
        }

        if ((value as any).orders.length === 0) {
          this.showMessageNoOrders = true;
        } else {
          this.showMessageNoOrders = false;
        }

        if ((value as any).orders.length < this.orderListLimit) {
          this.allOrderFetched = true;
        }
        this.fetchingOrder = false;
        this.appService.loader.next(false);
      });
    this.fetchingOrder = true;
  }

  track(id: number) {
    this.trackLoading = true;
    this.profileService
      .track(id)
      .pipe(takeUntil(this.unsubscribeSubject))
      .subscribe((valuec: ShipmentDetailsModel[]) => {
        this.trackLoading = false;
        const dialogRef = this.dialog.open(TrackComponent, {
          width: '800px',
          data: { value : valuec }
        });

        dialogRef.afterClosed().subscribe(result => {});
      });
  }

  Cancel(item) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { text: 'Cancel' }
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      // console.log('The dialog was closed'+result);
       if (result) {
          this.profileService.orderCancel(item.id).subscribe(value => {
            if (value.success) {
              this.message = value.message;
              this.symbolMsg = this.success;
              if (item.order_status) {
                item.order_status = 'Cancelled';
              }
              this.showMessage = true;
              this.scrollyPosition =  window.screenY;
              window.scrollTo(0, 0);
              setTimeout(() => {
                this.showMessage = false;
                this.message = value.message;
                window.scrollTo(0, this.scrollyPosition);
               }, 5000);
            } else {
              this.message = value.message + '( Due to Your Order Not in Cancellation State for More Information Contact Admin)';
              this.symbolMsg = this.error;
              this.showMessage = true;
              this.scrollyPosition =  window.screenY;
              window.scrollTo(0, 0);
              setTimeout(() => {
                this.showMessage = false;
                window.scrollTo(0, this.scrollyPosition);
              }, 5000);
            }
          });
       } else {

      }
    });
  }
  ReturnReplace(id) {
    this.navigateToOrder(id);

  }

  onScrollDown() {
    if (!this.fetchingOrder && !this.allOrderFetched) {
      this.loader = true;
      this.orderListPage++;
      this.profileService
        .getMyOrders(this.orderListPage, this.orderListLimit)
        .subscribe(value => {
          if ((value as any).orders) {
            (value as any).orders.forEach(order => {
              const tempObj = { ...order };
              tempObj.active = false;
              tempObj.isTracking = false;
              this.totalSpending = this.totalSpending + order.order_total;
              this.myOrders.push(tempObj);
            });
          }
          if ((value as any).orders.length < this.orderListLimit) {
            this.allOrderFetched = true;
          }
          this.fetchingOrder = false;
          this.loader = false;
        });
      this.fetchingOrder = true;
    }
  }

  reorder(orderId) {
    this.profileService
      .reorder(orderId)
      .subscribe((value: { status: string }) => {
        if (value && value.status === 'OK') {
          this.cartService.getCart(true).subscribe(result => {
            this.router.navigate(['/', 'cart']);
          });
        }
      });
  }
  navigateToOrder(id) {
    this.router.navigate(['account/orders/orderDetails/' + id]);
  }
  ngOnDestroy() {}
}
