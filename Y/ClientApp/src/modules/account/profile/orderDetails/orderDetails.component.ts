import { Component, OnInit
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/modules/shared/Confirmation-dialog/Confirmation-dialog.component';
import { CartService } from 'src/services/cart.service';
import { ShipmentDetailsModel } from '../myOrders/shipmentDetailsModel';
import { TrackComponent } from '../myOrders/track/track.component';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-orderDetails',
  templateUrl: './orderDetails.component.html',
  styleUrls: ['./orderDetails.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  public order: any = {};
  public orderStatus = [];
  displayedColumnstwo: string[] = ['image', 'product', 'three'];
  public orderreturnLink = '';
  public dataSource: MatTableDataSource<any> = new MatTableDataSource(
    []
  );

  public unsubscribeSubject = new Subject();
  trackLoading = false;
  constructor(private profileService: ProfileService,
              private cartService: CartService,
              private router: Router,
              private route: ActivatedRoute,
              public dialog: MatDialog) {
             }

  ngOnInit() {

    this.order = this.route.snapshot.data.order.orders[0];
    this.orderStatus.push({orderstatus: 'ordered', date: new Date(this.order.orderedDate), isactive: this.order.isOrdered});
    this.orderStatus.push({orderstatus: 'Packed', date: new Date(this.order.packedDate), isactive: this.order.isPacked});
    this.orderStatus.push({orderstatus: 'Shipped', date: new Date(this.order.shipedDate), isactive: this.order.isShiped});
    this.orderStatus.push({orderstatus: 'Delivered', date: new Date(this.order.deliveredDate), isactive: this.order.isDelivered});
    this.orderreturnLink = '/account/orders/orderReturn/' + this.order.id;
    const boolValue = this.order.order_status === 'Complete' || this.order.shipping_status === 'Delivered' && this.order.hasReturnRequest;
    this.dataSource = new MatTableDataSource(this.order.order_items);
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
  track(id: number) {
    this.trackLoading = true;
    this.profileService
      .track(id)
      .pipe(takeUntil(this.unsubscribeSubject))
      .subscribe((value: ShipmentDetailsModel[]) => {
        this.trackLoading = false;
        const dialogRef = this.dialog.open(TrackComponent, {
          width: '800px',
          data: { value }
        });

        dialogRef.afterClosed().subscribe(result => {});
      });
  }
  ReturnOrReplaceOrder(link: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { text: 'Return Or Replace' }
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      // console.log('The dialog was closed'+result);
       if (result) {
        this.router.navigate([link]);
      } else {

      }
    });
    // this.router.navigateByUrl(link);
  }
}
