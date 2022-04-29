import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  EventEmitter,
  Output
} from "@angular/core";
import { AddressesItem } from "src/store/Customer/customer.model";
import { CartService } from "../../../services/cart.service";
import { noop, Subject } from "rxjs";
import { AddAddressCartComponent } from "../addAddress/addCartAddress.component";
import { MatDialog } from "@angular/material/dialog";
import { CartStoreService } from 'src/store/cartStore.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: "app-billing-address",
  templateUrl: "./billingAddress.component.html",
  styleUrls: ["./billingAddress.component.scss"]
})
export class BillingAddressComponent implements OnInit, OnDestroy {
  @Input()
  public addresses: AddressesItem[] = [];

  @Input()
  public billingAddress: AddressesItem = new AddressesItem();

  @Input()
  public useSameAddress: boolean;

  @Output()
  public useSameSelectedEvent = new EventEmitter<boolean>();

  public giftCardInCart = false;

  unSubscribeSubject = new Subject();

  constructor(private cartService: CartService, public dialog: MatDialog, private cartStore: CartStoreService) {}

  ngOnInit() {
    this.cartStore.orderTotalUpdated
      .pipe(takeUntil(this.unSubscribeSubject))
      .subscribe(item => {
        if (item.orderTotals.RequiresShipping) {
          this.giftCardInCart = false;
        } else {
          this.giftCardInCart = true;
        }
      });
  }

  useSameSelected() {
    this.useSameSelectedEvent.next(this.useSameAddress);
  }

  openAddressFrom() {
    const dialogRef = this.dialog.open(AddAddressCartComponent, {
      width: "500px",
      data: { address: new AddressesItem(), type: 2, isBilling: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.cartService.getAccountDetails(true).subscribe(noop);
    });
  }

  selectedBillingAddress(address: AddressesItem) {
    this.cartService
      .setAsBilling(address)
      .subscribe(it =>
        this.cartService.getAccountDetails(true).subscribe(noop)
      );
  }

  editAddress(address: AddressesItem) {
    const dialogRef = this.dialog.open(AddAddressCartComponent, {
      width: "500px",
      data: { type: 1, isBilling: true, address }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.cartService.getAccountDetails(true).subscribe(noop);
    });
  }

  ngOnDestroy() {
    this.unSubscribeSubject.next();
    this.unSubscribeSubject.complete();
  }
}
