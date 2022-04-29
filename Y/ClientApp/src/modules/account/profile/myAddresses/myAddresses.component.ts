import { Component, OnDestroy, OnInit } from "@angular/core";
import { ProfileService } from "../profile.service";
import { AddAddressComponent } from "./addAddress/addAddress.component";
import { AddressesItem } from "src/store/Customer/customer.model";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-myaddresses",
  templateUrl: "./myAddresses.component.html",
  styleUrls: ["./myAddresses.component.scss"]
})
export class MyAddressesComponent implements OnDestroy, OnInit {
  public allAddresses;

  constructor(
    private profileService: ProfileService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.profileService.fetchAccountDetails();
    this.profileService.myDetailsSubject.subscribe(value => {
      this.allAddresses = value.addresses;
    });
    this.profileService.addressSubject.subscribe(value => {
      if (value) {
        this.profileService.fetchAccountDetails();
      }
    });
    this.profileService.deleteAddressSubject.subscribe(value => {
      if (value) {
        this.profileService.fetchAccountDetails();
      }
    });
  }

  editAddress(item: any) {
    const dialogRef = this.dialog.open(AddAddressComponent, {
      width: "500px",
      data: { type: 1, address: item }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.profileService.fetchAccountDetails();
    });
  }

  addAddress() {
    const dialogRef = this.dialog.open(AddAddressComponent, {
      width: "500px",
      data: { address: new AddressesItem(), type: 2 }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.profileService.fetchAccountDetails();
    });
  }

  deleteAddress(item: any) {
    this.profileService.deleteAddress(item.id);
  }

  ngOnDestroy() {}
}
