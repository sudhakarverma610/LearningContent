import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of, Observable } from 'rxjs';
import { ProductDTO, Product } from '../../store/products/products.model';
import { CategoriesListModel } from 'src/store/categories/categories.model';
import { CartStoreService } from 'src/store/cartStore.service';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { tap, catchError, map } from 'rxjs/operators';
import { StatusCodeService } from 'src/services/statusCode.service';
import { ProductStoreService } from 'src/store/productsStore.service';
import { Router } from '@angular/router';
import { CategoryStoreService } from 'src/store/categoriesStore.service';

const CATEGORY_ROUTE_CATEGORY_LIST = makeStateKey('categoryList');
const PRODUCT_SLUG_KEY = makeStateKey('productSlug');
const PRODUCT_DATA = makeStateKey('productData');

@Injectable()
export class ProductDetailsService {
  constructor(
      private http: HttpClient,
      private router: Router,
      private state: TransferState,
      private statusCodeService: StatusCodeService,
      private productStore: ProductStoreService,
      private categoryStore: CategoryStoreService
    ) {}

  getProductsBySpecRelation(productId): Observable<ProductDTO> {
    return this.http.get<ProductDTO>('/api/relatedProducts/' + productId);
  }

  SaveRecentProduct(productId): Observable<any> {
    return this.http.get<ProductDTO>('/api/RecentViewProduct/' + productId);
  }
  getProductCategory(input: Product): Observable<CategoriesListModel> {
    return this.http.get<CategoriesListModel>('/api/category/' + input.se_name);
  }

  getProduct(id) {
    return this.http.get('/api/products/' + id);
  }

  getProductBySlug(slug) {
    return this.http.get('/api/product_by_sename/' + slug);
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
        this.router.navigate(['/', product.se_name]);
        return new Observable(observer => {
          observer.next(product);
          observer.complete();
        });
      }

      return this.getProduct(productDetail).pipe(
        tap((response: { products: Product[] }) => {
          if (!response.products[0]) {
            this.statusCodeService.usage = 'Products not found in category';
            this.statusCodeService.statusCode = 302;
            this.statusCodeService.url = '/';
            this.router.navigateByUrl('/');
          } else {
            this.productStore.addSingleProduct(response.products[0]);
            this.router.navigate(['/', response.products[0].se_name]);
          }
        }),
        catchError(err => {
          this.statusCodeService.usage = err;
          this.statusCodeService.statusCode = 302;
          this.statusCodeService.url = '/';
          this.router.navigateByUrl('/');
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
          this.statusCodeService.usage = 'Products not found';
          this.statusCodeService.statusCode = 302;
          this.statusCodeService.url = '/';
          this.router.navigateByUrl('/');
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
        this.statusCodeService.url = '/';
        this.router.navigateByUrl('/');
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

    return this.http.get('/api/categories').pipe(
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

  productCategoryVerification(
    productSlug,
    categoryId
  ): Observable<{ success: number }> {
    const body = {
      productSlug,
      categoryId
    };
    return this.http
      .post<{ success: number }>('/api/productCategoryVerification', body)
      .pipe(
        catchError(err => {
          console.log(err);
          return of({ success: 0 });
        })
      );
  }
}