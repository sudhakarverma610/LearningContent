import { Input, Output } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriesListModel, CategoryModel } from 'src/store/categories/categories.model';
import { Product, ProductDTO } from 'src/store/products/products.model';
import { CategoryListingService } from '../category-listing.service';
import { ConfiguratorService } from '../configurator.service';
import { ConfiguratorStoreService } from '../configuratorStore.service';

@Component({
  selector: 'app-category-listing',
  templateUrl: './category-listing.component.html',
  styleUrls: ['./category-listing.component.scss']
})
export class CategoryListingComponent implements OnInit,AfterViewInit   {
  public panelCat = {
    chains: [],
    charms: [],

  };
  // tslint:disable-next-line: variable-name
  private _categoryName: string;
  @Input()
  set categoryName(input: any) {
    this.categoryService.getCategories().subscribe(res => {
      this.panelCat = {
        chains: [...res.homeSubCategories.chains],
        charms: [...res.homeSubCategories.charms]
      };
      this._categoryName = input;
      if (this.panelCat.charms.length > 0 && this.panelCat.charms[0].se_name !== 'new-in') {
          this.panelCat.charms = [{name: 'New In', se_name: 'new-in', image: null}, ...this.panelCat.charms];
     }
      if (this.panelCat.chains.length > 0 && this.panelCat.chains[0].se_name !== 'new-in') {
         this.panelCat.chains = [{name: 'New In', se_name: 'new-in', image: null}, ...this.panelCat.chains];
       }
      if (input === 'chains') {
        this.InitData(this.panelCat.chains[0].se_name, 'chains');
      } else {
        this.InitData(this.panelCat.charms[0].se_name, 'charms');
      }
     });
  }
  get categoryName() {
    return this._categoryName;
  }
  @Output()
  CategoryCloseEvent = new EventEmitter<string>();
  @Output()
  AddToConfiguratorEvent = new EventEmitter<Product>();
  products: Product[];
  productsGettingLoaded = false;
  public category;
  public totalPages = 1;
  public bestSellerTotalPage = -1;
  public productOnPageLimit = 12;
  public totalProducts = 0;
  public page = 1;
  public ishowleft=false;
  public isshowright=true;

  constructor(private categoryService: CategoryListingService,
              private route: ActivatedRoute,
              private configuratorService: ConfiguratorService,
              private configuratorStoreService: ConfiguratorStoreService
    ) { }

  public activeIndex = 0;
   public isShowProducts = true;
  public showSizediv = false;
  public SelectedProduct: Product;
  public previewLoading = false;
  ngOnInit() {
  }
  InitData(slug, parentCategory) {
    this.previewLoading = true;
    this.categoryService
    .getProductsFromCategorySlug(slug, parentCategory)
    .subscribe(
      res => {
        this.products = [...res.products];
        this.previewLoading = false;
      }
    );
  }
  isShowLeftRigthScroll(elmnt: HTMLElement, isleft: boolean= true): boolean {
    if (!elmnt) {
      return false;
    }
    const maxScrollLeft = elmnt.scrollWidth - elmnt.clientWidth;
    if (maxScrollLeft === 0) {
        return false;
      }
    const returnvalue = isleft ? (elmnt.scrollLeft === 0 ? false : true) :
                                 (elmnt.scrollLeft === maxScrollLeft ? false : true);
    return returnvalue;
   }
  scrollRigth(elmnt: HTMLElement)  {
    if (!elmnt) {
      return;
    }
    const maxScrollLeft = elmnt.scrollWidth - elmnt.clientWidth;
    if (maxScrollLeft === 0) {
        return;
      }
    const leftScrollWidth = elmnt.scrollLeft;
    if((leftScrollWidth + 100) >= maxScrollLeft){
      this.isshowright=false;
    }
    elmnt.scrollLeft = (leftScrollWidth + 100) > maxScrollLeft ? maxScrollLeft : (leftScrollWidth + 100);
    if(elmnt.scrollLeft!=0){
      this.ishowleft=true;
    }
  }
  scrollLeft(elmnt: HTMLElement)  {
    if (!elmnt) {
      return;
    }
    const maxScrollLeft = elmnt.scrollWidth - elmnt.clientWidth;
    if (maxScrollLeft === 0) {
        return;
      }
     
    const leftScrollWidth = elmnt.scrollLeft;
    if((leftScrollWidth - 100) <= 0){
      this.ishowleft=false;
    }
    elmnt.scrollLeft = (leftScrollWidth - 100) < 0 ? 0 : (leftScrollWidth - 100);
     if(elmnt.scrollLeft!=maxScrollLeft){
      this.isshowright=true;
    }
  }
  CategoryTabChanged(category, subcategory, categoryTabIndex) {
    this.activeIndex = categoryTabIndex;
    this.InitData(subcategory.se_name, category);
  }
  // tslint:disable-next-line: variable-name
  ONProductClickChanged(index: any, se_name: string, data: Product) {
    if (data.navAttributes && this.categoryName !== 'chains') {
      this.isShowProducts = false;
      this.showSizediv = true;
    } else {
      this.previewLoading = true;
      this.configuratorService
      .addToCompareList(data)
      .subscribe(result => {
        if (!result.success) {
          console.log('Error While Adding to Curator Products=' + result);
        } else {
          this.AddToConfiguratorEvent.emit(data);
        }
        this.previewLoading = false;

        this.CategoryCloseEvent.emit(this.categoryName);
      });
    }
    this.SelectedProduct = data;
     // console.log(eventData);
    }
  selectNavigatingAttrValue(value) {
   // console.log('Selected data color-------------');
    // console.log(value);
    this.previewLoading = true;
    this.categoryService.getProduct(value.associated_product_id)
    .subscribe(res => {
      const associatedproduct = res.products[0];
      // console.log('Associated Product');
      // console.log(associatedproduct);
      this.configuratorService
      .addToCompareList(associatedproduct)
      .subscribe(result => {
        if (!result.success) {
          /// console.log('Error While Adding to Curator Products=');
          console.log('-------error--------');
          console.log(result);
        } else {
          this.AddToConfiguratorEvent.emit(this.SelectedProduct);
        }
        this.previewLoading = false;
        this.CategoryCloseEvent.emit(this.categoryName);
      });
    });
    this.isShowProducts = true;
    this.showSizediv = false;
    }

    BackToChoice() {
    this.isShowProducts = true;
    this.showSizediv = false;
    }
    ngAfterViewInit(): void {
      // throw new Error('Method not implemented.');
    }
}
