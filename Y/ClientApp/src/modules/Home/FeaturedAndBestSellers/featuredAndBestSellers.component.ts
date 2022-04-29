import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FeaturedProductData } from 'src/store/yjStoreModels/featuredBestsellers.model';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Product } from 'src/store/products/products.model';
import { AppService } from 'src/services/app.service';
import { ScrollStoreService } from 'src/services/scrollStore.service';
import { ABTestingService } from 'src/services/abtesting.service';
import { JsonLdProductSchema } from 'src/modules/shared/jsonLd';

@Component({
  selector: 'app-featured-and-bestsellers',
  templateUrl: './featuredAndBestSellers.component.html',
  styleUrls: ['./featuredAndBestSellers.component.scss']
})
export class FeaturedAndBestSellersComponent implements OnInit, OnDestroy {
  public totalProducts: Product[] = [];
  public _products: FeaturedProductData[];
  public moreAvailable = false;
  public schema = [];
  public listType = 'Our Bestsellers';

  @Input()
  set products(Products) {
    if (Products) {
      this._products = Products;
      if (this.scrollService.saveShowMoreForHome) {
        const tempObj = Products.find(
          item =>
            item.category_sename ===
            (this.scrollService.saveShowMoreForHome
              ? this.scrollService.saveShowMoreForHome.category_sename
              : '')
        );
        this.totalProducts = tempObj.products;
        if (this.scrollService.saveShowMoreForHome.showMoreActive) {
          this.visibleCategory = Products[0];
          this.moreAvailable = false;
        } else {
          this.visibleCategory = {
            ...tempObj,
            products: tempObj.products.slice(0, 12)
          };
          this.moreAvailable = true;
        }
      } else {
        const random = Math.floor(Math.random() * (Products.length));
        this.totalProducts = Products[random].products;
        if (Products[random].products.length < 13) {
          this.visibleCategory = Products[random];
          this.moreAvailable = false;
        } else {
          this.visibleCategory = {
            ...Products[random],
            products: Products[random].products.slice(0, 12)
          };
          this.moreAvailable = true;
        }
      }
      try {
        this.sendGTMData(Products);
        this.setSchema(Products);
      } catch (err) {}
    }
  }
  get products() {
    return this._products;
  }
  @Input()
  public ItemsToShow = 4;
  public visibleCategory: FeaturedProductData;

  constructor(
    private router: Router,
    private appService: AppService,
    private scrollService: ScrollStoreService,
    private abTestingService: ABTestingService
  ) {}

  setSchema(items: FeaturedProductData[]) {
    this.schema = [];
    items.forEach(item => {
      this.schema = [
        ...this.schema,
        ...item.products.map(product => {
          return new JsonLdProductSchema(
            product,
            item.category_name,
            item.category_sename
          ).schema;
        })
      ];
    });
  }

  sendGTMData(items: FeaturedProductData[]) {
    if (this.appService.isBrowser) {
      (window as any).dataLayer = (window as any).dataLayer || [];
      let productImpressionArray = [];
      items.forEach(item => {
        const index = productImpressionArray.length;
        productImpressionArray = [
          ...productImpressionArray,
          ...item.products.map((product, index1) => {
            return {
              name: product.name,
              id: product.id,
              price: product.price_model.price_without_formatting,
              brand: 'Y',
              category: item.category_sename,
              position: index + (index1 + 1),
              list: 'Our Bestsellers'
            };
          })
        ];
      });

      const ecommerceObject = {
        ecommerce: {
          impressions: productImpressionArray
        },
        event: 'eec.impressionView'
      };
      (window as any).dataLayer.push(ecommerceObject);
    }
  }

  selectCategory(sename: string) {
    const tempObj = this.products.filter(
      item => item.category_sename === sename
    )[0];
    this.totalProducts = tempObj.products;
    if (tempObj.products.length < 13) {
      this.visibleCategory = tempObj;
      this.moreAvailable = false;
    } else {
      this.visibleCategory = {
        ...tempObj,
        products: tempObj.products.slice(0, 12)
      };
      this.moreAvailable = true;
    }
  }

  showMore() {
    if (this.totalProducts.length > this.visibleCategory.products.length) {
      const change =
        this.totalProducts.length - this.visibleCategory.products.length;
      const length = change > 11 ? 12 : change;
      this.visibleCategory.products.push(
        ...this.totalProducts.slice(
          this.visibleCategory.products.length,
          this.visibleCategory.products.length + length
        )
      );
      this.moreAvailable =
        this.visibleCategory.products.length === this.totalProducts.length
          ? false
          : true;
    }
  }

  showAll() {
    if (this.visibleCategory) {
      this.router.navigate(['/', this.visibleCategory.category_sename]);
    }
  }

  ngOnInit() {
    const abTestingVariable = this.abTestingService.testingVariable;
    this.abTestingService.newStateSet.subscribe(value => {
      if (abTestingVariable === 2) {
        this.selectCategory('charms');
      } else if (abTestingVariable === 3) {
        this.selectCategory('chains');
      }
    });
    if (abTestingVariable === 2) {
      this.selectCategory('charms');
    } else if (abTestingVariable === 3) {
      this.selectCategory('chains');
    }
  }

  ngOnDestroy() {
    this.scrollService.saveShowMoreForHome = {
      category_sename: this.visibleCategory
        ? this.visibleCategory.category_sename
        : '',
      showMoreActive:
        this.totalProducts.length ===
        (this.visibleCategory ? this.visibleCategory.products.length : 13)
    };
  }
}
