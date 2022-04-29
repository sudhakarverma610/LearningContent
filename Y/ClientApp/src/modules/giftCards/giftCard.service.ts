import { Injectable, Optional, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin, of } from "rxjs";
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { StatusCodeService } from 'src/services/statusCode.service';
import { CategoryStoreService } from 'src/store/categoriesStore.service';
import { ProductStoreService } from 'src/store/productsStore.service';
import { Router } from '@angular/router';
import { ProductDTO, Product } from 'src/store/products/products.model';
import { tap, map, mergeMap, catchError } from 'rxjs/operators';
import { CategoriesListModel } from 'src/store/categories/categories.model';

const CATEGORY_SLUG_KEY = makeStateKey("categorySlug");
const CATEGORY_ROUTE_CATEGORY_LIST = makeStateKey("categoryList");
const CATEGORY_ROUTE_PRODUCT_LIST = makeStateKey("productList");
const PRODUCT_SLUG_KEY = makeStateKey("productSlug");
const PRODUCT_DATA = makeStateKey("productData");

@Injectable()
export class GiftCardService {
  constructor(
    private statusCodeService: StatusCodeService,
    private http: HttpClient,
    private state: TransferState,
    private categoryStore: CategoryStoreService,
    private productStore: ProductStoreService,
    private router: Router
  ) {}

  loadProducts(
    categorySlug,
    category,
    filter,
    page,
    limit,
    bestSellerTotalPage = -1
  ) {
    const orderBy = 15;
    return this.http.get(
      // tslint:disable-next-line:max-line-length
      `/api/products?page=${page}&limit=${limit}&category_ids=${category}&orderBy=${orderBy}&bestSellerTotalPage=${bestSellerTotalPage}`
    );
  }

  getProductsFromCategorySlug(slug): Observable<ProductDTO> {
    if (this.state.get(CATEGORY_SLUG_KEY, null as any) === slug) {
      this.productStore.setCategoryProducts(
        slug,
        this.state.get(CATEGORY_ROUTE_PRODUCT_LIST, null as any),
        1
      );
      return new Observable(observer => {
        observer.next(this.state.get(CATEGORY_ROUTE_PRODUCT_LIST, null as any));
        observer.complete();
      });
    }

    const tempObj = this.productStore.getProductsByCategorySlug(slug);
    if (tempObj) {
      return new Observable(observer => {
        observer.next(tempObj);
        observer.complete();
      });
    }

    return this.http.get("/api/slug_to_id/" + slug).pipe(
      tap((response: any) => {
        if (response && response.id) {
        } else {
          this.router.navigateByUrl("/");
        }
      }),
      map((response: any) => {
        return response ? response.id : "1";
      }),
      mergeMap(id => {
        return this.loadProducts(slug, id, null, 1, 12);
      }),
      tap((response: ProductDTO) => {
        this.state.set(CATEGORY_SLUG_KEY, slug);
        this.state.set(CATEGORY_ROUTE_PRODUCT_LIST, response);
        this.productStore.setCategoryProducts(slug, response, 1);
      }),
      catchError(err => {
        console.log(err);
        this.router.navigateByUrl("/");
        return of(new ProductDTO([]));
      })
    );
  }

  getCat(): Observable<CategoriesListModel> {
    if (this.state.get(CATEGORY_ROUTE_CATEGORY_LIST, null as any)) {
      this.categoryStore.setCategoriesList(
        this.state.get(CATEGORY_ROUTE_CATEGORY_LIST, null as any)
      );
      return new Observable(observer => {
        observer.next(
          this.state.get(CATEGORY_ROUTE_CATEGORY_LIST, null as any)
        );
        observer.complete();
      });
    }

    if (this.categoryStore.getCategoriesListLoadedStatus()) {
      const tempObj1 = this.categoryStore.getCategoriesList();
      return new Observable(observer => {
        observer.next(tempObj1);
        observer.complete();
      });
    }

    return this.http.get("/api/categories").pipe(
      tap((response: CategoriesListModel) => {
        this.state.set(CATEGORY_ROUTE_CATEGORY_LIST, response);
        this.categoryStore.setCategoriesList(response);
      }),
      catchError(err => {
        console.log(err);
        return of(new CategoriesListModel([]));
      })
    );
  }

  getGiftCards(slug): Observable<[CategoriesListModel, ProductDTO]> {
    return forkJoin(this.getCat(), this.getProductsFromCategorySlug(slug));
  }

  getPriceLimits() {
    return this.http.get("/api/getGiftCardPriceSettings");
  }

  getGiftCardEmailPreview(data) {
    return this.http.post("/api/getGiftCardEmailPreview", data);
  }

  getProduct(id) {
    return this.http.get("/api/products/" + id);
  }

  getProductBySlug(slug) {
    return this.http.get("/api/product_by_sename/" + slug);
  }

  serachProductInServiceOrFetchIt(
    categorySlug,
    productDetail,
    isId
  ): Observable<Product> {
    // if the route gets id for product
    if (isId) {
      const product = this.productStore.getProductById(productDetail);
      if (product) {
        this.router.navigate(["/", product.se_name]);
        return new Observable(observer => {
          observer.next(product);
          observer.complete();
        });
      }

      return this.getProduct(productDetail).pipe(
        tap((response: { products: Product[] }) => {
          if (!response.products[0]) {
            this.statusCodeService.usage = "Products not found in category";
            this.statusCodeService.statusCode = 302;
            this.statusCodeService.url = "/";
            this.router.navigateByUrl("/");
          } else {
            this.productStore.addSingleProduct(response.products[0]);
            this.router.navigate(["/", response.products[0].se_name]);
          }
        }),
        catchError(err => {
          this.statusCodeService.usage = err;
          this.statusCodeService.statusCode = 302;
          this.statusCodeService.url = "/";
          this.router.navigateByUrl("/");
          return of(undefined);
        })
      );
    }

    // checks if data has been set on server with ssr
    if (this.state.get(PRODUCT_SLUG_KEY, null as any) === productDetail) {
      this.productStore.addSingleProduct(
        this.state.get(PRODUCT_DATA, null as any)
      );
      return new Observable(observer => {
        observer.next(this.state.get(PRODUCT_DATA, null as any));
        observer.complete();
      });
    }

    // checks if data has been previously requested
    const tempObj = this.productStore.getProduct(productDetail);
    if (tempObj) {
      return new Observable(observer => {
        observer.next(tempObj);
        observer.complete();
      });
    }

    // requests data from server
    return this.getProductBySlug(productDetail).pipe(
      tap((response: { products: Product[] }) => {
        if (!response.products[0]) {
          this.statusCodeService.usage = "Products not found";
          this.statusCodeService.statusCode = 302;
          this.statusCodeService.url = "/";
          this.router.navigateByUrl("/");
        }
      }),
      map((response: { products: Product[] }) => {
        this.state.set(PRODUCT_SLUG_KEY, productDetail);
        this.state.set(PRODUCT_DATA, response.products[0]);
        return response.products[0];
      }),
      catchError(err => {
        this.statusCodeService.usage = err;
        this.statusCodeService.statusCode = 302;
        this.statusCodeService.url = "/";
        this.router.navigateByUrl("/");
        return of(undefined);
      })
    );
  }

  fetchCategory(): Observable<CategoriesListModel> {
    if (this.state.get(CATEGORY_ROUTE_CATEGORY_LIST, null as any)) {
      this.categoryStore.setCategoriesList(
        this.state.get(CATEGORY_ROUTE_CATEGORY_LIST, null as any)
      );
      return new Observable(observer => {
        observer.next(
          this.state.get(CATEGORY_ROUTE_CATEGORY_LIST, null as any)
        );
        observer.complete();
      });
    }

    if (this.categoryStore.getCategoriesListLoadedStatus()) {
      const tempObj1 = this.categoryStore.getCategoriesList();
      return new Observable(observer => {
        observer.next(tempObj1);
        observer.complete();
      });
    }

    return this.http.get("/api/categories").pipe(
      tap((response: CategoriesListModel) => {
        this.state.set(CATEGORY_ROUTE_CATEGORY_LIST, response);
        this.categoryStore.setCategoriesList(response);
      }),
      catchError(err => {
        console.log(err);
        return of(new CategoriesListModel([]));
      })
    );
  }

  getProductData(
    categorySlug,
    productDetail,
    isId
  ): Observable<[CategoriesListModel, Product]> {
    return forkJoin(
      this.fetchCategory(),
      this.serachProductInServiceOrFetchIt(categorySlug, productDetail, isId)
    );
  }
}
