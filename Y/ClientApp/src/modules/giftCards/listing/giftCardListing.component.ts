import { Component, OnInit, OnDestroy, Optional, Inject } from '@angular/core';
import { LocationStrategy, PathLocationStrategy, APP_BASE_HREF, Location } from '@angular/common';
import { GiftCardCategory, GiftCard } from 'src/store/products/giftCard.class';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MetaService } from 'src/services/meta.service';
import { takeUntil } from 'rxjs/operators';
import { CategoriesListModel } from 'src/store/categories/categories.model';
import { ProductDTO } from 'src/store/products/products.model';

@Component({
  selector: 'app-giftcardlisting',
  templateUrl: './giftCardListing.component.html',
  styleUrls: ['./giftCardListing.component.scss'],
  providers: [
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy }
  ]
})
export class GiftCardListingComponent implements OnInit, OnDestroy {
  public categoryId;

  public subCategory: GiftCardCategory;
  public subCategorySlug: string;
  public subCategoryList: GiftCardCategory[] = [];
  public giftCards: GiftCard[] = [];
  public totalPages = 0;

  public page = 1;
  public productOnPageLimit = 20;

  public flexNumber = 1;

  public unsubscribeSubject: Subject<string> = new Subject();
  public baseUrl = '';
  public location;

  constructor(
    private route: ActivatedRoute,
    private metaService: MetaService,
    location: Location,
    @Optional()
    @Inject(APP_BASE_HREF)
    origin: string
  ) {
    this.baseUrl = origin ? origin : '';
    this.location = location;
  }

  ngOnInit() {
    // get category slug from route params
    this.route.params
      .pipe(takeUntil(this.unsubscribeSubject))
      .subscribe(value => {
        if (this.subCategorySlug !== value.category) {
          this.init(value.category);
        }
      });
  }

  setMeta(category) {
    // update meta tags
    let temp = category.image ? category.image.src : '';
    this.metaService.setMeta(
      category.meta_title,
      category.meta_description,
      category.meta_keywords,
      this.baseUrl + this.location.path(),
      temp
    );
  }

  init(catSlug) {
    const result: [CategoriesListModel, ProductDTO] = this.route.snapshot.data
      .giftCards;
    this.subCategorySlug = catSlug;

    const giftVoucherCategory = result[0].categories.find(
      item1 => item1.se_name === 'gift-voucher'
    );
    this.categoryId = giftVoucherCategory.id;
    this.subCategoryList = result[0].categories
      .filter(item => item.parent_category_id.toString() === this.categoryId)
      .map((item, index) => {
        return new GiftCardCategory({ ...item, num: index });
      });
    this.subCategory = this.subCategoryList.find(
      item => item.se_name === this.subCategorySlug
    );
    this.setMeta(this.subCategory);

    this.giftCards = result[1].products.map(item => {
      return new GiftCard(item);
    });

    this.totalPages = Math.ceil(
      this.giftCards.length / this.productOnPageLimit
    );

    if (this.giftCards.length < 5) {
      this.flexNumber = this.giftCards.length;
    } else {
      this.flexNumber = 4;
    }
  }

  ngOnDestroy() {}
}
