import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Optional,
  Inject,
  ViewChild,
  AfterContentChecked,
  ChangeDetectorRef
} from '@angular/core';
import {
  Router,
  ActivatedRoute,
  RouterEvent,
  NavigationEnd,
  NavigationStart
} from '@angular/router';
import { ProductListingService } from '../productListing.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MetaService } from 'src/services/meta.service';
import { LocationStrategy, PathLocationStrategy, APP_BASE_HREF, Location } from '@angular/common';
import { Product, ProductDTO } from 'src/store/products/products.model';
import { CategoryModel, CategoryPriceRanges, CategoriesListModel } from 'src/store/categories/categories.model';
import { Subject } from 'rxjs';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { FilterComponent } from '../filters/filter.component';
import { breadcrumb } from 'src/modules/shared/breadcrumb/breadcrumb.model';
import { AppService } from 'src/services/app.service';
import { ScrollStoreService } from 'src/services/scrollStore.service';
import { CustomerStoreService } from 'src/store/customerStore.service';
import { ProductStoreService } from 'src/store/productsStore.service';
import { MatDialog } from '@angular/material';
import { NotificationHandlerService } from 'src/modules/notification/notification.handle.service';
import { NotificationService } from 'src/modules/notification/notification.service';
import { takeUntil } from 'rxjs/operators';
import { SortingComponent } from '../sorting/sorting.component';

declare global {
  interface Window {
    BackgroundCheck: any;
  }
}

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss'],
  animations: [
    trigger('enterAnimation', [
      state(
        'false',
        style({
          transform: 'translateY(-100%)',
          opacity: 0
        })
      ),
      state(
        'true',
        style({
          transform: 'translateY(0)',
          opacity: 1
        })
      ),
      transition('false => true', [animate('500ms')]),
      transition('true => false', [animate('500ms')])
    ])
  ],
  providers: [
    MetaService,
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy }
  ]
})
export class ListingComponent
  implements OnInit, OnDestroy, AfterViewInit, AfterContentChecked {
  public componentId = 1;
  public elementSelected = [];
  public carouselItems;
  public filters;
  public products: Product[] = [];
  public category: CategoryModel;
  public scrollDistance = 2;
  public totalPages = 1;
  public bestSellerTotalPage = -1;
  public productOnPageLimit = 12;
  public totalProducts = 0;
  public page = 1;
  public appliedFiltersOnProducts;
  public appliedCategoryOnProducts;
  public loadDataAgain = true;

  public categoryId;
  public categorySlug;
  public currentState = 'false';

  public productsGettingLoaded = false;
  public unsubscribeSubject: Subject<string> = new Subject();
  public httpUnsubscribeSubject: Subject<string> = new Subject();

  public baseUrl;
  public location;

  public _showFilters = false;
  public _showSorts = false;
  public filtersAvailable = true;
  imageUrl: string;
  public set showFilters(input) {
    this._showFilters = input;
    this.currentState = input + '';
  }
  public set showSorts(input) {
    this._showSorts = input;
    this.currentState = input + '';
  }
  // tslint:disable-next-line: adjacent-overload-signatures
  public get showFilters() {
    return this._showFilters;
  }
  // tslint:disable-next-line: adjacent-overload-signatures
  public get showSorts() {
    return this._showSorts;
  }

  public categoryPriceRange = new CategoryPriceRanges();

  public selectedPriceRange = '0-';
  public sortBy = 0;
  public infiniteScroll: InfiniteScrollDirective;

  public filterredList = [];

  public isNotificationDone = false;

  public lineProductNumber = 16;

  public backgroundInit = false;
  public backgroundOnceInit = false;

  @ViewChild('filterComponent', { static: false })
  filterComponent: FilterComponent;
  @ViewChild('sortComponent', { static: false })
  sortingComponent: SortingComponent;
  public breadcrumbList: breadcrumb[] = [
    { title: 'Home', link: '/' },
    { title: '', link: '' }
  ];

  public schema = [];
  @ViewChild(InfiniteScrollDirective, { static: false })
  set appScroll(directive: InfiniteScrollDirective) {
    this.infiniteScroll = directive;
  }

// public tempdata={link:'/addtestimony/list',
//                   src:'https://files.y.jewelry/assets/img/2020/promotionalimages/01-push-ratings+1.jpg',
//                   heading: 'Our ratings speak for us',
//                   subheading: 'We are rated 4.6/5 by our last 700 customers'
//                 };
public promotional: any;
  public listType = 'Category Page';
  constructor(
    private productCategoryService: ProductListingService,
    private router: Router,
    private appService: AppService,
    private scrollStoreService: ScrollStoreService,
    private customerStore: CustomerStoreService,
    private productStore: ProductStoreService,
    private metaService: MetaService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public notificationHandler: NotificationHandlerService,
    private notificationService: NotificationService,
    location: Location,
    @Optional()
    @Inject(APP_BASE_HREF)
    origin: string,
    private appRef: ChangeDetectorRef
  ) {
    this.baseUrl = origin ? origin : '';
    this.location = location;
  }


  ngAfterContentChecked() {}

  ngOnInit() {
    // get category slug from route params
    this.unsubscribeSubject = new Subject();
    this.router.events
      .pipe(takeUntil(this.unsubscribeSubject))
      .subscribe(event => {
        if (event instanceof NavigationStart) {
          this.scrollStoreService.previousComponent = this.categorySlug;
          this.scrollStoreService.previousComponentPage = this.page;
          this.scrollStoreService.saveScrollPostion(this.componentId);
          if (this.appService.isBrowser) {
            window.scrollTo(0, 0);
          }
        }
      });
    this.route.params
      .pipe(takeUntil(this.unsubscribeSubject))
      .subscribe(value => {
        this.categorySlug = value.category;
        this.backgroundInit = false;
        this.breadcrumbList[1] = {
          title: value.category,
          link: '/' + value.category
        };
        this.initData();
      });
    this.router.events
      .pipe(takeUntil(this.unsubscribeSubject))
      .subscribe((event: RouterEvent) => {
        if (event instanceof NavigationEnd) {
          this.route.params.subscribe(value => {
            this.categorySlug = value.category;
            this.initData();
          });
        }
      });
    this.setUpFilterData();
    if (this.customerStore.getCustomer()) {
      if (this.customerStore.getCustomer()) {
        const self = this;
        setTimeout(() => {
          self.openCuratorPopUp();
        }, 10000);
      }
    }
    this.customerStore.customerUpdated.subscribe(res => {
      if (res) {
        const self = this;
        setTimeout(() => {
          self.openCuratorPopUp();
        }, 10000);
      }
    });
  }

  openCuratorPopUp() {
    this.notificationService.getCuratorPopUpStatus().subscribe(res => {
      if (res && !this.isNotificationDone) {
        this.notificationHandler.newNotification.next(this.notificationService.getCuratorPopUpData());
      }
    });
  }

  initData() {
    this.showFilters = false;
    this.showSorts = false;
    this.httpUnsubscribeSubject.next();
    this.httpUnsubscribeSubject.complete();
    this.httpUnsubscribeSubject = new Subject();
    this.productsGettingLoaded = false;
    this.httpUnsubscribeSubject.subscribe(value => {
      this.productsGettingLoaded = false;
    });
    if (this.categorySlug === 'sets') {
      this.lineProductNumber = 16;
    } else {
      this.lineProductNumber = 16;
    }
    const result: [CategoriesListModel, ProductDTO] = this.route.snapshot.data
      .data;
    if (result[1].count === 0) {
      this.router.navigateByUrl('/');
    }

    this.bestSellerTotalPage = result[1].bestSellerTotalPage;
    this.promotional = result[1].promotional;
    this.category = result[0].categories.find(
      (item: CategoryModel) => item.se_name === this.categorySlug
    );

    if (!this.category) {
      this.router.navigateByUrl('/');
    }
    this.backgroundInit = false;
    this.checkBackground();

    this.categoryPriceRange = this.category.price_ranges_model;
    this.categoryPriceRange.selectedPriceRange = '0-max';

    this.totalProducts = result[1].count;

    if (this.categorySlug === 'sets') {
      this.productOnPageLimit = 12;
    }

    this.categoryId = this.category.id;
    this.carouselItems = this.category.collections;
    this.totalPages = result[1].totalPages;
    this.filters = result[1].filter;
    this.products = [...result[1].products];
    this.sendGTMData(this.products, 0);
    const totalSlug =
      this.categorySlug +
      '-' +
      this.route.snapshot.queryParams.categoryId +
      '-' +
      this.route.snapshot.queryParams.collection +
      '-' +
      this.route.snapshot.queryParams.specAttr;
    this.page = this.productStore.getCategoryPageBySlug(totalSlug);

    this.setSchema();
    // update meta tags
    this.metaService.setMeta(
      this.category.meta_title,
      this.category.meta_description,
      this.category.meta_keywords,
      this.baseUrl + this.location.path(),
      this.category.image.src
    );

    if (
      this.productCategoryService.StoredFilterEvent &&
      this.productCategoryService.StoredFilterEvent.slug === this.categorySlug
    ) {
      this.fetchFilteredProducts(
        this.productCategoryService.StoredFilterEvent.event
      );
    }
    this.appRef.detectChanges();
  }

  sendGTMData(items: Product[], index = 0) {
    if (this.appService.isBrowser) {
      try {
        (window as any).dataLayer = (window as any).dataLayer || [];
        const productImpressionArray = items.map((product, index1) => {
          return {
            name: product.name,
            id: product.id,
            price: product.price_model.price_without_formatting,
            brand: 'Y',
            category: this.categorySlug,
            position: index + (index1 + 1),
            list: 'Category Page'
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
    //
  }

  changeFilters(filterList) {
    this.filterredList = [...filterList];
  }

  checkBackground() {
    try {
      if (this.appService.isBrowser) {
        if (!this.backgroundInit) {
          window.BackgroundCheck.init({
            targets: '.target',
            images: '.headerImage'
          });
          window.BackgroundCheck.refresh();
          this.backgroundOnceInit = true;
          this.backgroundInit = true;
        }
      }
    } catch (err) {
      this.backgroundInit = false;
      this.backgroundOnceInit = false;
      const self = this;
      setTimeout(() => {
        self.checkBackground();
      }, 500);
    }
  }

  ngAfterViewInit() {
    if (this.appService.isBrowser) {
      const self = this;
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://files.y.jewelry/assets/js/backgroundCheck3.js';
      script.onload = () => {
        self.checkBackground();
      };
      (window as any).document.getElementsByTagName('head')[0].appendChild(script);
      if (this.categorySlug === this.scrollStoreService.previousComponent) {
        this.scrollStoreService.restoreScroll(this.componentId);
      }
    }
  }

  loadProductsCount(event) {
    this.page = 1;
    this.bestSellerTotalPage = -1;
    this.appliedCategoryOnProducts =
      event.category !== '0' ? event.category : this.categoryId;
    this.appliedFiltersOnProducts = event.filter;
    this.categoryPriceRange.selectedPriceRange = event.selectedPriceRange;
    this.productCategoryService
      .loadProductsCount(
        this.categorySlug,
        this.appliedCategoryOnProducts,
        this.appliedFiltersOnProducts,
        this.page,
        this.productOnPageLimit,
        -1,
        this.categoryPriceRange.selectedPriceRange
      )
      .subscribe(result => {
        this.totalProducts = result.count;
      });
  }

  setUpFilterData() {
    if (this.categorySlug === 'new-in') {
      return;
    }
    const event = {
      category: this.route.snapshot.queryParams.collection || '0',
      filter: this.route.snapshot.queryParams.specAttr
    };
    this.productCategoryService.StoredFilterEvent = {
      slug: this.categorySlug,
      event
    };
    this.appliedCategoryOnProducts =
      event.category !== '0' ? event.category : this.categoryId; // category filter
    this.appliedFiltersOnProducts = event.filter; // spec filters
  }

  fetchFilteredProducts(event) {
    if (event.category === '0' && !event.filter && !event.selectedPriceRange) {
      return;
    }
    this.productCategoryService.StoredFilterEvent = {
      slug: this.categorySlug,
      event
    };
    this.httpUnsubscribeSubject.next();
    this.httpUnsubscribeSubject.complete();
    this.products = [];
    this.productsGettingLoaded = true;
    this.page = 1;
    this.bestSellerTotalPage = -1;
    this.appliedCategoryOnProducts =
      event.category !== '0' ? event.category : this.categoryId; // category filter
    this.appliedFiltersOnProducts = event.filter; // spec filters

    // let url = `/${this.categorySlug}?`;
    // url = event.category !== '0' ? url + 'collection=' + event.category : url;
    // url = event.category !== '0' && event.filter ? url + '&' : url;
    // url = event.filter ? url + event.filter : url;
    let queryParam;
    if (event.category !== '0') {
      queryParam = {};
      queryParam.collection = event.category;
    }
    if (event.filter) {
      queryParam = queryParam ? queryParam : {};
      queryParam.specAttr = event.filter;
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParam,
      queryParamsHandling: 'merge'
    });

    this.carouselItems = event.filterCategories || this.carouselItems;
    this.categoryPriceRange.selectedPriceRange = event.selectedPriceRange;
    this.httpUnsubscribeSubject = new Subject();
    this.productCategoryService
      .loadProducts(
        this.categorySlug,
        this.appliedCategoryOnProducts,
        this.appliedFiltersOnProducts,
        this.page,
        this.productOnPageLimit,
        -1,
        this.categoryPriceRange.selectedPriceRange,
        this.sortBy
      )
      .pipe(takeUntil(this.httpUnsubscribeSubject))
      .subscribe((value: ProductDTO) => {
        this.showFilters = false;
        this.totalProducts = value.count;
        if (value.count === 0) {
          this.products = [];
        } else {
          this.imageUrl = value.imageUrl;
          this.totalPages = Math.ceil(value.count / this.productOnPageLimit);
          this.products = value.products;
          this.sendGTMData(this.products, 0);
        }
        this.productsGettingLoaded = false;
      });
  }

  sortSelectedValueChange(selectedValue) {
    // console.log(selectedValue);
    this.sortBy = selectedValue;
    this.showSorts = false;
      // this.appService.loader.next(true);
    if ((this.categorySlug === 'new-in' && this.products.length >= 60) || (this.showFilters && this.filtersAvailable)) {
        return;
      }
    this.httpUnsubscribeSubject.next();
    this.httpUnsubscribeSubject.complete();
    this.products = [];
    this.productsGettingLoaded = true;
    this.page = 1
    this.httpUnsubscribeSubject = new Subject();
    this.productCategoryService
          .loadProducts(
            this.categorySlug,
            this.appliedCategoryOnProducts,
            this.appliedFiltersOnProducts,
            this.page,
            this.productOnPageLimit,
            this.bestSellerTotalPage,
            this.categoryPriceRange.selectedPriceRange,
            this.sortBy,
            this.route.snapshot
          )
          .pipe(takeUntil(this.httpUnsubscribeSubject))
          .toPromise()
          .then((value: ProductDTO) => {
            this.productsGettingLoaded = false;
            // this.appService.loader.next(false);
            this.infiniteScroll.ngOnDestroy();
            this.infiniteScroll.setup();
            this.bestSellerTotalPage = value.bestSellerTotalPage;
            if (this.appliedCategoryOnProducts === this.categoryId) {
              if (!this.appliedFiltersOnProducts) {
                this.productStore.setCategoryProducts(
                  this.categorySlug,
                  value,
                  this.page
                );
              }
            }
            if (value.count > 0) {
              this.totalProducts = value.count;
              this.products = [...value.products];
              this.imageUrl = value.imageUrl;
              this.promotional = value.promotional;
              this.totalPages = Math.ceil(value.count / this.productOnPageLimit);
              this.sendGTMData(value.products, this.products.length);
            }
          });
    }
  toProduit(name) {
    this.router.navigate([name]);
  }

  onScrollDown() {
    if ((this.categorySlug === 'new-in' && this.products.length >= 60) || (this.showFilters && this.filtersAvailable)) {
      return;
    }
    let morePagesAvailable = true;
    if (
      (this.appliedFiltersOnProducts &&
        this.appliedFiltersOnProducts != null &&
        this.appliedFiltersOnProducts !== '') ||
        this.categoryPriceRange.selectedPriceRange != '0-max'
    ) {
      morePagesAvailable = this.page < this.totalPages;
    } else {
      morePagesAvailable = this.page < this.totalPages + 1;
    }
    if (morePagesAvailable && !this.productsGettingLoaded) {
      this.page++;
      this.productsGettingLoaded = true;
      this.httpUnsubscribeSubject = new Subject();
      this.productCategoryService
        .loadProducts(
          this.categorySlug,
          this.appliedCategoryOnProducts,
          this.appliedFiltersOnProducts,
          this.page,
          this.productOnPageLimit,
          this.bestSellerTotalPage,
          this.categoryPriceRange.selectedPriceRange,
          this.sortBy,
          this.route.snapshot
        )
        .pipe(takeUntil(this.httpUnsubscribeSubject))
        .toPromise()
        .then((value: ProductDTO) => {
          this.productsGettingLoaded = false;
          this.infiniteScroll.ngOnDestroy();
          this.infiniteScroll.setup();
          this.bestSellerTotalPage = value.bestSellerTotalPage;
          if (this.appliedCategoryOnProducts === this.categoryId) {
            if (!this.appliedFiltersOnProducts) {
              this.productStore.setCategoryProducts(
                this.categorySlug,
                value,
                this.page
              );
            }
          }
          if (value.count > 0) {
            this.totalProducts = value.count;
            this.imageUrl = value.imageUrl;
            this.promotional = value.promotional;
            this.totalPages = Math.ceil(value.count / this.productOnPageLimit);
            this.sendGTMData(value.products, this.products.length);
            Array.prototype.push.apply(this.products, value.products);
          }
        });
    }
  }

  toggleFilters(event) {
    if (typeof event.stopPropagation !== 'undefined') {
      event.stopPropagation();
    }
    window.scrollTo({
      top: 0,
      left: 0
    });
    this.showFilters = true;
  }
  toggleSorts(event) {
    if (typeof event.stopPropagation !== 'undefined') {
      event.stopPropagation();
    }
    window.scrollTo({
      top: 0,
      left: 0
    });
    this.showSorts = true;
  }

  showProducts() {
    this.filterComponent.count();
    this.filterComponent.show();
  }
  closeSortBy() {
    this.sortingComponent.show();
  }
  clearSelection() {
    this.filterComponent.clear();
  }

  removeFilter(item) {
    this.filterComponent.removeItem(item);
  }
  // RandomPromotionalsNumber(){
  //   //this.promotionals.length
  //   var random= Math.floor(Math.random() * this.promotionals.length);
  //   return this.promotionals[random];
  // }

  ngOnDestroy() {
    this.appService.footerShow.next(true);
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }
}
