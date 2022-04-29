import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { Product } from "src/store/products/products.model";
import { Subject } from 'rxjs';
import { AppService } from 'src/services/app.service';
import { takeUntil } from 'rxjs/operators';
import { SearchService } from '../search.service';

@Component({
  selector: "app-search-listing",
  templateUrl: "./searchListing.component.html",
  styleUrls: ["./searchListing.component.scss"]
})
export class SearchListingComponent implements OnInit, OnDestroy {
  public products: Product[] = [];
  public page = 1;
  public productsGettingLoaded = false;
  public scrollDistance = 2;
  public allFetched = false;
  public unsubscribe = new Subject();
  public listType = "Search Results";
  public searchText="Results";
  constructor(
    private route: ActivatedRoute,
    private service: SearchService,
    private appService: AppService,
    private router: Router
  ) {}

  ngOnInit() {
    this.searchText=this.route.snapshot.queryParams["q"];
    this.route.queryParams.subscribe((query)=>{
      if(query["q"]){
        this.searchText=query["q"];
      }
    });
    this.unsubscribe = new Subject();
    this.products = this.route.snapshot.data.result.list;
    if (this.products.length < 12) {
      this.allFetched = true;
    }
   
    this.router.events.pipe(takeUntil(this.unsubscribe)).subscribe(res => {
      if (res instanceof NavigationEnd) {
        this.products = this.route.snapshot.data.result.list;
        this.sendGTMData(this.products, 0);
        if (this.products.length < 12) {
          this.allFetched = true;
        }
      }
    });
  }

  sendGTMData(items: Product[], index = 0) {
    if (this.appService.isBrowser) {
      try {
        (window as any).dataLayer = (window as any).dataLayer || [];
        let productImpressionArray = items.map((product, index1) => {
          return {
            name: product.name,
            id: product.id,
            price: product.price_model.price_without_formatting,
            brand: "Y",
            category: "",
            position: index + (index1 + 1),
            list: "Search Results"
          };
        });

        const ecommerceObject = {
          ecommerce: {
            impressions: productImpressionArray
          },
          event: "eec.impressionView"
        };
        (window as any).dataLayer.push(ecommerceObject);
      } catch (err) {}
    }
  }

  onScrollDown() {
    if (this.allFetched) {
      return;
    }
    this.page++;
    this.productsGettingLoaded = true;
    this.service
      .searchQuery(this.route.snapshot.queryParams["q"], this.page)
      .subscribe(res => {
        this.sendGTMData(res.list, this.products.length);
        this.products = [...this.products, ...res.list];
        if (res.list.length < 12) {
          this.allFetched = true;
        }
        this.productsGettingLoaded = false;
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
