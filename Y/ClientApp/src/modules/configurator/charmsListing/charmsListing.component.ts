import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit
} from '@angular/core';
import { Product, Image } from 'src/store/products/products.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { ConfiguratorStoreService } from '../configuratorStore.service';
import { noop } from 'rxjs';
import { AnimationQueryOptions } from '@angular/animations';

@Component({
  selector: 'app-charms-listing',
  templateUrl: './charmsListing.component.html',
  styleUrls: ['./charmsListing.component.scss']
})
export class CharmsListingComponent implements AfterViewInit {
  // tslint:disable-next-line: variable-name
  public _products: Product[] = [];

  @Input()
  public set products(input: Product[]) {
    this._products = input.map(a => {
      return {
        ...a,
        images: a.images
          .filter(
            b =>
              b.title === 'ConfigurationImage2' ||
              b.title === 'ConfigurationImage'
          )
          .sort(this.customSort)
      };
    });
  }

  public get products() {
    return this._products;
  }

  // tslint:disable-next-line: no-output-native
  @Output()
  public close = new EventEmitter();
  @Output()
  public OpenCharmsSelectionEvent = new EventEmitter();
  @Output()
  public clear = new EventEmitter();

  @Output()
  public preview = new EventEmitter();

  public removeActive = false;
  public removeIndex = 55;

  currentScroll = 1000;
  public isSelectedIndex = -1;
  constructor(
    private router: Router,
    private configuratorStore: ConfiguratorStoreService
  ) {}

  drop(event: CdkDragDrop<any>) {
    if (event.previousIndex !== event.currentIndex) {
      // this.products[event.previousContainer.data.index]=event.container.data.item
      // //console.log(event.container.data.item);
      // //console.log(event.previousContainer.data.index)
      // this.products[event.container.data.index]=event.previousContainer.data.item
      moveItemInArray(this.products, event.previousIndex, event.currentIndex);
      this.preview.emit();

    }

  }
  dropList(event: CdkDragDrop<any>) {
    // this.products[event.previousContainer.data.index] = event.container.data.item;
    // this.products[event.container.data.index] = event.previousContainer.data.item;
   // this.moveItemInArray(this.products, event.previousContainer.data.index, event.container.data.index);
   moveItemInArray(this.products, event.previousContainer.data.index, event.container.data.index);
   this.preview.emit();
  }
  moveItemInArray(products: any[] , previousIndex: number, currentIndex: number) {
    if (products.length - 1 === previousIndex) {// means we are on last item
      let allproductslist=[...products];
      let previousItem= products[previousIndex];
      let currentItem=products[currentIndex];
      products[currentIndex] = previousItem;
      products.splice(previousIndex, 1 ); // pop previous item from array
      products = [...products.slice(0, currentIndex + 1), currentItem, ...products.slice(currentIndex + 1)];
    } else {
     let allproductslist=[...products];
     let previousItem= products[previousIndex];
     let currentItem=products[currentIndex];
     products.splice(previousIndex, 1 ); // pop previous item from array
     products[currentIndex] = previousItem;
     products = [...products.slice(0, currentIndex + 1), currentItem, ...products.slice(currentIndex + 1)];
    }
  }
  OpenCharmsSelection() {
    this.OpenCharmsSelectionEvent.emit();
  }
   customSort(a: Image, b: Image) {
    if (a.title === 'ConfigurationImage') {
      return -1;
    }
    if (b.title === 'ConfigurationImage') {
      return 1;
    }
    if (a.title === 'ConfigurationImage2') {
      return -1;
    }
    if (b.title === 'ConfigurationImage2') {
      return 1;
    }
    return 0;
  }

  ngAfterViewInit() {
    const a = document.getElementsByClassName('charmCurator');
    if ( !a) {
      return;
    }
    a[0].scrollTo(a[0].scrollWidth, 0);
    this.currentScroll = a[0].scrollWidth - a[0].clientWidth;
  }

  removeItem(index: number) {
    this.configuratorStore
      .removeProductFromCompareList(this.products[index].id)
      .subscribe(noop);
    this.products.splice(index, 1);
    if (this.products.length === 0) {
      this.clear.emit();
    } else {
      this.preview.emit();
    }
  }

  back() {
    if (this.currentScroll > 0) {
      this.currentScroll = this.currentScroll - 100;
      const a = document.getElementsByClassName('charmCurator');
      a[0].scrollTo(this.currentScroll, 0);
    }
  }

  forward() {
    const a = document.getElementsByClassName('charmCurator');
    if (this.currentScroll < a[0].scrollWidth - a[0].clientWidth) {
      this.currentScroll = this.currentScroll + 100;
      a[0].scrollTo(this.currentScroll, 0);
    }
  }

  navigate() {
    this.close.emit();
    this.router.navigate(['/charms']);
  }
}
