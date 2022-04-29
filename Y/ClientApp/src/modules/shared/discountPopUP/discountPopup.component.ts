import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { StoreService } from 'src/store/store.service';

@Component({
  selector: "app-discount-popup",
  templateUrl: "./discountPopup.component.html",
  styleUrls: ["./discountPopup.component.scss"]
})
export class DiscountPopUpComponent implements OnInit, OnDestroy {
  public showDiscount = false;
  public banner = "";
  public unsubscribeSubject = new Subject();
  constructor(public store: StoreService) {}

  ngOnInit() {
    this.store.showDiscount
      .pipe(takeUntil(this.unsubscribeSubject))
      .subscribe((value: { view: boolean; banner: string }) => {
        this.showDiscount = value.view;
        this.banner = value.banner;
      });
  }

  removeDailog() {
    this.store.showDiscount.next({ view: false, banner: this.banner });
  }

  ngOnDestroy() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }
}
