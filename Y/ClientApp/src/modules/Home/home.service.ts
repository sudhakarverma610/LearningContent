import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { CategoryStoreService } from 'src/store/categoriesStore.service';
import { ProductStoreService } from 'src/store/productsStore.service';
import { StoreService } from 'src/store/store.service';
import { ABTestingService } from 'src/services/abtesting.service';
import { noop, Observable, of, forkJoin } from 'rxjs';
import { CategoriesListModel } from 'src/store/categories/categories.model';
import { map, catchError } from 'rxjs/operators';
import { FeaturedBestSellers } from 'src/store/yjStoreModels/featuredBestsellers.model';
import { BannersModel } from 'src/store/yjStoreModels/banners.model';
import { TopicModel } from 'src/store/yjStoreModels/topic.model';
import { TestimonialResponse } from 'src/store/yjStoreModels/testimonials.model';

const CATEGORIES_HOME_KEY = makeStateKey("categories_home");
const FEATURED_AND_BESTSELLERS = makeStateKey("bestSellers");
const BANNERS = makeStateKey("banners");
const ABOUTUS = makeStateKey("aboutUs");
const TESTIMONIALS = makeStateKey("testimonials");

@Injectable()
export class HomeService {
  constructor(
    private http: HttpClient,
    private categoryStore: CategoryStoreService,
    private state: TransferState,
    private productStore: ProductStoreService,
    private store: StoreService,
    private abTestingService: ABTestingService
  ) {
    this.getCat().subscribe(noop);
  }

  getCat(): Observable<CategoriesListModel> {
    if (this.state.get(CATEGORIES_HOME_KEY, null as any)) {
      this.categoryStore.setCategoriesList(
        this.state.get(CATEGORIES_HOME_KEY, null as any)
      );
      return new Observable<CategoriesListModel>(observer => {
        observer.next(this.state.get(CATEGORIES_HOME_KEY, null as any));
        observer.complete();
      });
    }

    if (this.categoryStore.getCategoriesListLoadedStatus()) {
      return new Observable<CategoriesListModel>(observer => {
        observer.next(this.categoryStore.getCategoriesList());
        observer.complete();
      });
    }

    return this.http.get<CategoriesListModel>(`/api/categories`).pipe(
      map((response: CategoriesListModel) => {
        this.state.set(CATEGORIES_HOME_KEY, response);
        this.categoryStore.setCategoriesList(response);
        return response;
      }),
      catchError(err => {
        console.log(err);
        return of(new CategoriesListModel([]));
      })
    );
  }

  getFetauredAndBestSellersByCat() {
    if (this.productStore.getBestSellersStatus()) {
      return new Observable<FeaturedBestSellers>(observer => {
        observer.next(this.productStore.getBestSellers());
        observer.complete();
      });
    }

    return this.http.get<FeaturedBestSellers>(`/api/featured_bestsellers`).pipe(
      map(response => {
        this.productStore.setBestSellers(response);
        return response;
      }),
      catchError(err => {
        console.log(err);
        return new Observable<FeaturedBestSellers>(observer => {
          observer.next(this.state.get(FEATURED_AND_BESTSELLERS, null as any));
          observer.complete();
        });
      })
    );
  }

  getFetauredAndBestSellers(): Observable<FeaturedBestSellers> {
    if (this.productStore.getBestSellersStatus()) {
      return new Observable<FeaturedBestSellers>(observer => {
        observer.next(this.productStore.getBestSellers());
        observer.complete();
      });
    }
    
    if (this.state.get(FEATURED_AND_BESTSELLERS, null as any)) {
      return new Observable<FeaturedBestSellers>(observer => {
        observer.next(this.state.get(FEATURED_AND_BESTSELLERS, null as any));
        observer.complete();
      });
    }

    return this.http
      .get<FeaturedBestSellers>(
        `/api/featured_bestsellers/` + this.abTestingService.testingVariable
      )
      .pipe(
        map(response => {
          this.state.set(FEATURED_AND_BESTSELLERS, response);
          return response;
        }),
        catchError(err => {
          console.log(err);
          return new Observable<FeaturedBestSellers>(observer => {
            observer.next(
              this.state.get(FEATURED_AND_BESTSELLERS, null as any)
            );
            observer.complete();
          });
        })
      );
  }

  getBanners(): Observable<BannersModel> {
    if (this.state.get(BANNERS, null as any)) {
      this.store.setBanners(this.state.get(BANNERS, null as any));
      return new Observable<BannersModel>(observer => {
        observer.next(this.state.get(BANNERS, null as any));
        observer.complete();
      });
    }

    if (this.store.getBannersStatus()) {
      return new Observable<BannersModel>(observer => {
        observer.next(this.store.getBanners());
        observer.complete();
      });
    }

    return this.http.get<BannersModel>(`/api/nivoslider`).pipe(
      map((response: BannersModel) => {
        this.state.set(BANNERS, response);
        this.store.setBanners(response);
        return response;
      }),
      catchError(err => {
        console.log(err);
        return new Observable<BannersModel>(observer => {
          observer.next(this.state.get(BANNERS, null as any));
          observer.complete();
        });
      })
    );
  }

  getAboutUs(): Observable<TopicModel> {
    if (this.state.get(ABOUTUS, null as any)) {
      this.store.setAboutUs(this.state.get(ABOUTUS, null as any));
      return new Observable<TopicModel>(observer => {
        observer.next(this.state.get(ABOUTUS, null as any));
        observer.complete();
      });
    }

    if (this.store.getAboutUsStatus()) {
      return new Observable<TopicModel>(observer => {
        observer.next(this.store.getAboutUs());
        observer.complete();
      });
    }

    return this.http.get<TopicModel>(`/api/topic/about-us-home-1`).pipe(
      map((response: TopicModel) => {
        this.state.set(ABOUTUS, response);
        this.store.setAboutUs(response);
        return response;
      }),
      catchError(err => {
        console.log(err);
        return new Observable<TopicModel>(observer => {
          observer.next(this.state.get(ABOUTUS, null as any));
          observer.complete();
        });
      })
    );
  }

  getTestimonials(): Observable<TestimonialResponse> {
    if (this.state.get(TESTIMONIALS, null as any)) {
      this.store.setTestimonials(this.state.get(TESTIMONIALS, null as any));
      return new Observable<TestimonialResponse>(observer => {
        observer.next(this.state.get(TESTIMONIALS, null as any));
        observer.complete();
      });
    }

    if (this.store.getTestimonialsStatus()) {
      return new Observable<TestimonialResponse>(observer => {
        observer.next(this.store.getTestimonials());
        observer.complete();
      });
    }

    return this.http.get<TestimonialResponse>(`/api/getTestimoniesReview`).pipe(
      map((response: TestimonialResponse) => {
        this.state.set(TESTIMONIALS, response);
        this.store.setTestimonials(response);
        return response;
      }),
      catchError(err => {
        console.log(err);
        return new Observable<TestimonialResponse>(observer => {
          observer.next(this.state.get(TESTIMONIALS, null as any));
          observer.complete();
        });
      })
    );
  }

  getHome(): Observable<
    [BannersModel, FeaturedBestSellers, TopicModel, TestimonialResponse]
  > {
    return forkJoin(
      this.getBanners(),
      this.getFetauredAndBestSellers(),
      this.getAboutUs(),
      this.getTestimonials()
    );
  }
  getCommunityChainLink() {
    return this.http.get("/api/getReferralLink");
  }
}
