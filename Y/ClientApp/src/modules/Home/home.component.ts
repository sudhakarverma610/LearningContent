import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MetaService } from '../../services/meta.service';
import { BannersModel } from 'src/store/yjStoreModels/banners.model';
import { FeaturedProductData, FeaturedBestSellers } from 'src/store/yjStoreModels/featuredBestsellers.model';
import { TopicModel } from 'src/store/yjStoreModels/topic.model';
import { TestimonialModel, TestimonialResponse } from 'src/store/yjStoreModels/testimonials.model';
import { AppService } from 'src/services/app.service';
import { MatDialog } from '@angular/material/dialog';
import { StoreService } from 'src/store/store.service';
import { NotificationHandlerService } from '../notification/notification.handle.service';
import { HomeService } from './home.service';
import { ScrollStoreService } from 'src/services/scrollStore.service';
import { NotificationsEntity } from '../notification/notification.service';
import { CategoryModel } from 'src/store/categories/categories.model';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  providers: [MetaService]
})
export class HomeComponent implements OnInit, OnDestroy {
  public banners: BannersModel;
  public featuredBestSellers: FeaturedProductData[] = [];
  public categories: homeCategoriesModel[] = [];
  public aboutUs: TopicModel;
  public testimonials: TestimonialModel[] = [];
  public schema = {
    "@context": "http://schema.org",
    "@type": "Organization",
    legalName: "RIPOPS INDIA JEWELERY PVT LTD",
    url: this.appService.baseUrl,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+9810230784",
        contactType: "customer service"
      }
    ],
    logo: "https://files.y.jewelry/assets/img/Logo.svg",
    sameAs: [
      "https://www.facebook.com/yjewelryindia/",
      "https://www.instagram.com/yjewelryindia/"
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private metaService: MetaService,
    private appService: AppService,
    public dialog: MatDialog,
    private router: Router,
    private store: StoreService,
    private notificationHandler: NotificationHandlerService,
    private service: HomeService,
    private scrollService: ScrollStoreService
  ) {}

  ngOnInit() {
    if (this.appService.isBrowser) {
      this.service.getFetauredAndBestSellersByCat().subscribe(result => {
        this.featuredBestSellers = result.productData.map(item => {
          return {
            ...item,
            products: item.products.map(a => {
              return { ...a, images: a.images };
            })
          };
        });
      });
    }
    this.metaService.setMeta();
    const result: [
      BannersModel,
      FeaturedBestSellers,
      TopicModel,
      TestimonialResponse
    ] = this.route.snapshot.data.homeData;
    this.banners = result[0];
    this.featuredBestSellers = result[1].productData.map(item => {
      return {
        ...item,
        products: item.products.map(a => {
          return { ...a, images: a.images };
        })
      };
    });
    // this.categories = this.prepareCategoriesForHomeView(result[2]);
    this.aboutUs = result[2];
    this.testimonials = result[3].testimonials.map((item, index) => {
      return { ...item, id: index.toString() };
    });
    this.scrollService.restoreScroll("home");
    this.route.queryParams.subscribe(params => {
      const errors = params["error"];
      if (errors && errors !== "," && this.appService.isBrowser) {
        const data = new NotificationsEntity();
        data.notification_id = "default_6";
        data.url = "/";
        data.heading = decodeURIComponent(errors);
        data.content =  "";
        this.notificationHandler.newNotification.next(data);
      }
      if (
        params["authType"] === "external"
      ) {
        this.store.setLoginToken();
        if (params["returnUrl"]) {
          this.router.navigateByUrl(params["returnUrl"]);
        }
      }
    });
  }

  ngOnDestroy() {
    this.scrollService.saveScrollPostion("home");
  }
}

export class homeCategoriesModel extends CategoryModel {
  public active = false;
  constructor(input) {
    super(input);
    this.active = input.active;
  }
}
