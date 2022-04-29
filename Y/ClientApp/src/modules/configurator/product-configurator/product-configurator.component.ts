
import { Component, Input, OnInit, EventEmitter, Output
} from '@angular/core';
import {  Product } from 'src/store/products/products.model';

@Component({
  selector: 'app-product-configurator',
  templateUrl: './product-configurator.component.html',
  styleUrls: ['./product-configurator.component.scss']
})
export class ProductConfiguratorComponent implements OnInit {
  @Input()
  products: any;
  @Output() OnProductClick = new EventEmitter<{index: any; category_sename: string, data: Product}>();

  constructor() { }
  OnProductSelected(index: any, item: any) {
    //// { category_sename: item.category_sename, data: item }
    this.OnProductClick.emit({index, category_sename: item.category_sename, data: item});
  }
  ngOnInit() {
  }

}
