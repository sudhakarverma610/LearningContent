import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { AddressesItem } from "src/store/Customer/customer.model";
import { CartService } from "../../../services/cart.service";
import { noop } from "rxjs";
import { AddAddressCartComponent } from "../addAddress/addCartAddress.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-shipping-address",
  templateUrl: "./shippingAddress.component.html",
  styleUrls: ["./shippingAddress.component.scss"]
})
export class ShippingAddressComponent implements OnInit, OnDestroy {
  @Input()
  public addresses: AddressesItem[] = [];

  @Input()
  public shippingAddress: AddressesItem = new AddressesItem();

  constructor(private cartService: CartService, public dialog: MatDialog) {}

  ngOnInit() {}

  openAddressFrom() {
    const dialogRef = this.dialog.open(AddAddressCartComponent, {
      width: "500px",
      data: { address: new AddressesItem(), isBilling: false, type: 2 }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.cartService.getAccountDetails(true).subscribe(noop);
    });
  }

  selectedShippingAddress(address: AddressesItem) {
    this.cartService
      .setAsShipping(address)
      .subscribe(it =>
        this.cartService.getAccountDetails(true).subscribe(noop)
      );
  }

  editAddress(address: AddressesItem) {
    const dialogRef = this.dialog.open(AddAddressCartComponent, {
      width: "500px",
      data: { type: 1, isBilling: false, address }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.cartService.getAccountDetails(true).subscribe(noop);
    });
  }

  ngOnDestroy() {}
}
