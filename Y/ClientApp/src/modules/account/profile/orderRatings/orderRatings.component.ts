import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderItemRating } from '../model';
import { ProfileService } from '../profile.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-orderRatings',
  templateUrl: './orderRatings.component.html',
  styleUrls: ['./orderRatings.component.scss']
})
export class OrderRatingsComponent implements OnInit {
  // public order: any = {};
  public dataSource: MatTableDataSource<any> = new MatTableDataSource(
    []
  );
  public  orderItemRating: OrderItemRating[] = [];
  displayedColumnstwo: string[] = ['image', 'product', 'three'];
  trackLoading = false;
  public error: string;
  public alertClass = 'alert-danger';
  public alertShow = false;
  public alertMsg = '';
  constructor(
    private profileService: ProfileService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.orderItemRating = this.route.snapshot.data.ratingItems as OrderItemRating[];
    this.dataSource = new MatTableDataSource(this.orderItemRating);

  }
  RatingChangedEvent($event: number, orderItemRating: OrderItemRating) {
    orderItemRating.rate = $event;
  }
  Hide() {
    this.alertShow = false;
  }
  SubmitRating() {
   // console.log(this.orderItemRating);
    const isAllItemRated = this.orderItemRating.every(it => it.rate > 0);
    if (isAllItemRated) {
      this.trackLoading=true;
      this.profileService.postOrderItemRating(this.orderItemRating).
      // tslint:disable-next-line: deprecation
      subscribe(res => {
        this.trackLoading = false;
        if (res.status) {
          this.error = null;
          this.alertClass = 'alert-success';
          this.alertMsg = 'Your Summited Rate Successfully';
          this.alertShow = true;
          window.scrollTo(0, 0);
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 200);
        } else {
          this.error = res.error;
          this.alertClass = 'alert-danger';
          this.alertMsg = res.error;
          this.alertShow = true;
          window.scrollTo(0, 0);
        }
      });
    } else {
      this.alertClass = 'alert-danger';
      this.alertMsg = 'Please Rate All Item ';
      this.alertShow = true;
      window.scrollTo(0, 0);
    }

  }
 }
