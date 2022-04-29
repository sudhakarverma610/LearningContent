import {
  Component,
  OnInit,
  OnDestroy,
  Optional,
  Inject,
  AfterContentChecked,
  Input
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetailsService } from '../productDetails.service';
import { MetaService } from 'src/services/meta.service';
import { LocationStrategy, PathLocationStrategy, APP_BASE_HREF, Location } from '@angular/common';
import { Product, ProductDTO } from 'src/store/products/products.model';
import { CategoryModel, CategoriesListModel } from 'src/store/categories/categories.model';
import { Subject, of } from 'rxjs';
import { AppService } from 'src/services/app.service';
import { takeUntil, catchError } from 'rxjs/operators';
import { JsonLdProductSchema } from 'src/modules/shared/jsonLd';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  providers: [
    MetaService,
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy }
  ]
})
export class ItemComponent implements OnInit, AfterContentChecked, OnDestroy {
  public url;
  public product: Product;
  public relatedProducts: {
    category_sename: string;
    product: Product;
  }[] = [];
  public productSlug: string;
  public categorySlug: string;
  public categoryId: string;
  public category: CategoryModel;
  public unsubscribeSubject: Subject<string> = new Subject();
  location: Location;
  public baseUrl = '';
  public listType = 'Related Products';

  public relatedProductLoader = false;
  public schema = {};
  constructor(
    private route: ActivatedRoute,
    private appService: AppService,
    private router: Router,
    private metaService: MetaService,
    private productDetailsService: ProductDetailsService,
    location: Location,
    @Optional()
    @Inject(APP_BASE_HREF)
    origin: string
  ) {
    this.baseUrl = origin ? origin : '';
    this.location = location;
  }

  /******************Start Timmer**********************/
  public slides: any;
  public Vslide: any;
  public intervalId = 0;
  public counterTimmer = 0;
  StartTimmer() {
    // tslint:disable-next-line: variable-name
    const _self = this;
    _self.counterTimmer = 0;
    const intervalId = setInterval(() => {
      if (_self.counterTimmer < 100) {
        _self.counterTimmer = _self.counterTimmer + 1;
      }
      if (_self.counterTimmer === 100) {
        clearInterval(intervalId);
        if (_self.Vslide.id !== _self.slides[_self.slides.length - 1].id) {
            _self.rightSlide();
        }
      }
    }, 300);
  }

  leftSlide() {
    if (this.Vslide.id === 0) {
      this.Vslide = this.slides[this.slides.length - 1];
      return;
    }
    this.Vslide = this.slides[this.Vslide.id - 1];
  }

  rightSlide() {
    if (this.Vslide.id === this.slides[this.slides.length - 1].id) {
      this.Vslide = this.slides[0];
      this.counterTimmer = 0;
      clearInterval(this.intervalId);
      return;
    }
    this.Vslide = this.slides[this.Vslide.id + 1];
    this.StartTimmer();
  }
  /******************Start Timmer**********************/
  ngAfterContentChecked() {}

  ngOnInit() {
    this.unsubscribeSubject = new Subject();
    this.route.params
      .pipe(takeUntil(this.unsubscribeSubject))
      .subscribe(value => {
        this.productSlug = value.product;
        this.categorySlug = value.category;
        /**************************** */

        /**************************** */
        this.initData();
      });
    this.setSchema();
  }

  initData() {
    if (this.appService.isBrowser) {
      this.url = encodeURIComponent(window.location.href);
    }
    const result: [CategoriesListModel, Product] = this.route.snapshot.data.data;

    this.category = result[0].categories.find(
      item => item.se_name === this.categorySlug
    );
    this.categoryId = this.category.id;
    this.product = result[1];
    this.categoryId !== '19'
      ? this.VerifyProductCategory(this.product.se_name, this.categoryId)
      // tslint:disable-next-line: no-unused-expression
      : '';

    // fetchRelatedProducts more personalised for user
    this.fetchRelatedProducts();

    // update meta tags
    this.setMetaData();
    try {
      if (this.product.images) {
        this.slides = [...this.product.images]
          .filter(
            img =>
              img.title !== 'ConfigurationImage' &&
              img.title !== 'ConfigurationImage2' &&
              img.title !== 'CoverImg1'
          )
          .map(it => {
            if (
              it.src.substr(it.src.lastIndexOf('.')) === '.jpeg'
              && it.position < 3
              // tslint:disable-next-line: no-shadowed-variable
              && !this.product.tags.some(it => it === 'base')
              // tslint:disable-next-line: no-shadowed-variable
              && (this.product.tags.some( it => it === 'bead') || this.product.tags.some(it => it === 'hanging'))
            ) {
              const altSrc = this.product.images.find(
                a => a.title === 'ConfigurationImage'
              );
              if (altSrc) {
                it.altSrc = altSrc.src;
              }
            }
            return it;
          });
        this.Vslide = { ...this.slides[0] };
        this.StartTimmer();
      }
      this.sendGTMData3(this.product, this.category.name);
    } catch (err) {}
  }

  setMetaData() {
    this.metaService.setMeta(
      this.product.meta_title,
      this.product.meta_description,
      this.product.meta_keywords,
      this.baseUrl + this.location.path(),
      this.product.images[0].src
    );
  }

  sendGTMData3(product: Product, category: string) {
    if (this.appService.isBrowser) {
      (window as any).dataLayer = (window as any).dataLayer || [];
      const productClickedArray = [
        {
          name: product.name,
          id: product.id,
          price: product.price_model.price_without_formatting,
          brand: 'Y',
          category
        }
      ];
      const ecommerceObject = {
        ecommerce: {
          detail: {
            products: productClickedArray,
            actionField: { action: 'detail' }
          }
        },
        event: 'eec.detail'
      };
      (window as any).dataLayer.push(ecommerceObject);
    }
  }

  sendGTMData2(
    items: {
      category_sename: string;
      product: Product;
    }[],
    index = 0
  ) {
    if (this.appService.isBrowser) {
      try {
        (window as any).dataLayer = (window as any).dataLayer || [];
        const productImpressionArray = items.map((it, index1) => {
          return {
            name: it.product.name,
            id: it.product.id,
            price: it.product.price_model.price,
            brand: 'Y',
            category: it.category_sename,
            position: index + (index1 + 1),
            list: 'Complete the look'
          };
        });

        const ecommerceObject = {
          ecommerce: {
            impressions: productImpressionArray
          },
          event: 'eec.impressionView'
        };
        (window as any).dataLayer.push(ecommerceObject);
      } catch (err) {}
    }
  }

  setSchema() {
    this.schema = [];
    this.schema = new JsonLdProductSchema(
      this.product,
      this.category.name,
      this.category.se_name
    ).schema;
  }

  copyArray(source, array?) {
    let index = -1;
    const length = source.length;

    // tslint:disable-next-line: no-unused-expression
    array || (array = new Array(length));
    while (++index < length) {
      array[index] = source[index];
    }
    return array;
  }

  shuffle(array) {
    const length = array == null ? 0 : array.length;
    if (!length) {
      return [];
    }
    let index = -1;
    const lastIndex = length - 1;
    const result = this.copyArray(array);
    while (++index < length) {
      const rand = index + Math.floor(Math.random() * (lastIndex - index + 1));
      const value = result[rand];
      result[rand] = result[index];
      result[index] = value;
    }
    return result;
  }

  fetchRelatedProducts() {
    this.productDetailsService
      .getProductsBySpecRelation(this.product.id)
      .pipe(
        takeUntil(this.unsubscribeSubject),
        catchError(err => {
          console.log(err);
          return of([[], []]);
        })
      )
      .subscribe((value: ProductDTO) => {
        const tempArray = value.products;

        this.relatedProducts = tempArray.map(item => {
          return {
            category_sename: item.category_sename,
            product: item
          };
        });

        this.relatedProducts.length =
          this.relatedProducts.length > 6 ? 6 : this.relatedProducts.length;
        this.sendGTMData2(this.relatedProducts, 0);
        this.relatedProductLoader = false;
      });
  }

  VerifyProductCategory(productSlug, categoryId) {
    this.productDetailsService
      .productCategoryVerification(productSlug, categoryId)
      .subscribe((result: { success: number }) => {
        if (result.success === 0) {
          this.router.navigateByUrl('/');
        }
      });
  }

  uniqBy(arr, predicate) {
    const cb = typeof predicate === 'function' ? predicate : o => o[predicate];

    return [
      ...arr
        .reduce((map, item) => {
          const key = item === null || item === undefined ? item : cb(item);

          // tslint:disable-next-line: no-unused-expression
          map.has(key) || map.set(key, item);

          return map;
        }, new Map())
        .values()
    ];
  }

  ngOnDestroy() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }
}
