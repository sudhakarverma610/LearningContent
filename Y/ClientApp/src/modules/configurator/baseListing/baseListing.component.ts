import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from 'src/store/products/products.model';
import { Router } from '@angular/router';
import { noop } from 'rxjs';
import { ConfiguratorStoreService } from '../configuratorStore.service';

@Component({
  selector: 'app-base-listing',
  templateUrl: './baseListing.component.html',
  styleUrls: ['./baseListing.component.scss']
})
export class BaseListingComponent {
  // tslint:disable-next-line: variable-name
  public _products: Product[] = [];

  @Input()
  public set products(input: Product[]) {
    this._products = input.map(a => {
      return {
        ...a,
        images: a.images.filter(b => b.title === 'ConfigurationImage')
      };
    });
  }

  public get products() {
    return this._products;
  }

  @Input()
  public selectedId: string;

  // tslint:disable-next-line: no-output-native
  @Output()
  public close = new EventEmitter();

  @Output()
  public preview = new EventEmitter();
  @Output()
  public OpenChainsPlusClickEvent = new EventEmitter();
  public removeActive = false;
  public removeIndex = 0;

  constructor(
    private router: Router,
    private configuratorStore: ConfiguratorStoreService
  ) {}
  OpenChainsPlusClick() {
    this.OpenChainsPlusClickEvent.emit();
  }
  removeItem(index: number) {
    this.configuratorStore
      .removeProductFromCompareList(this.products[index].id)
      .subscribe(res => {
        if (this.products.length > 0) {
        this.products.splice(index, 1);
        if (this.products.length > 0) {
          this.selectBase(this.products[0].id);
          }
        }
      }
      );
    // if (this.products[index].id === this.selectedId) {
    //   if (this.products.length > 0) {
    //     this.selectBase(this.products[0].id);
    //   }
    // }
    // this.products.splice(index, 1);
  }

  selectBase(id) {
    this.selectedId = id;
    this.configuratorStore.selectedId = id;
    this.preview.emit();
  }

  navigate() {
    this.close.emit();
    this.router.navigate(['/chains']);
  }
}
