import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import { AddressesItem } from "src/store/Customer/customer.model";
import { CartService } from "../../../services/cart.service";
import { noop } from "rxjs";

@Component({
  selector: "app-current-address",
  templateUrl: "./currentAddress.component.html",
  styleUrls: ["./currentAddress.component.scss"]
})
export class CurrentAddressComponent implements OnInit, OnDestroy {
  public _addresses: AddressesItem[];
  public showMore = 2;

  @Input("addresses")
  set addresses(input: AddressesItem[]) {
    this._addresses = input;
    this.selection();
  }

  get addresses() {
    return this._addresses;
  }


  public _addressSelected;
  @Input("addressSelected")
  set addressSelected(input: AddressesItem) {
    this._addressSelected = input;
    if (input) {
      this.addressSelectedId = input.id;
    }
  }

  get addressSelected() {
    return this._addressSelected;
  }

  public addressSelectedId: string;

  @Output()
  public addressSelectedEvent = new EventEmitter<AddressesItem>();

  @Output()
  public editAddressEvent = new EventEmitter<AddressesItem>();

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.showMore = 2;
    this.selection();
  }

  selection() {    
    if (this.addressSelectedId && this.addresses.length > 1) {
      const selected = this.addresses.find(it => it.id === this.addressSelectedId);
      this.addresses.splice(this.addresses.findIndex(it => it.id === this.addressSelectedId), 1);
      this.addresses.unshift(selected);
    }
  }

  selectAddress() {
    this.addressSelectedEvent.emit(
      this.addresses.find(it => it.id === this.addressSelectedId)
    );
  }

  more() {
    this.showMore += 4;
  }

  less() {
    this.showMore -= 4;
  }

  editAddress(input: AddressesItem) {
    const tempObj: AddressesItem = input;
    this.editAddressEvent.emit(tempObj);
  }

  deleteAddress(id, event) {
    event.stopPropagation();
    this.cartService.deleteAddress(id).subscribe(res => {
      this.cartService.getAccountDetails(true).subscribe(noop);
    });
  }

  ngOnDestroy() {}
}
