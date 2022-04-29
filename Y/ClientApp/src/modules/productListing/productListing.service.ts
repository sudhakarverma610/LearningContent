import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product, ProductDTO } from 'src/store/products/products.model';
import { CategoryPriceRanges, CategoriesListModel } from 'src/store/categories/categories.model';
import { Observable, forkJoin, of } from 'rxjs';
import { tap, catchError, mergeMap, map } from 'rxjs/operators';
import { ProductStoreService } from 'src/store/productsStore.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryStoreService } from 'src/store/categoriesStore.service';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { StatusCodeService } from 'src/services/statusCode.service';

const CATEGORY_SLUG_KEY = makeStateKey("categorySlug");
const CATEGORY_ROUTE_CATEGORY_LIST = makeStateKey("categoryList");
const CATEGORY_ROUTE_PRODUCT_LIST = makeStateKey("productList");

@Injectable()
export class ProductListingService {
    public StoredFilterEvent: { slug: string; event: any };
    constructor(
        private http: HttpClient,
        private route: ActivatedRoute,
        private productStore: ProductStoreService,
        private categoryStore: CategoryStoreService,
        private state: TransferState,
        private router: Router,
        private statusCodeService: StatusCodeService
    ) { }

    searchQuery(input: string, page = 1) {
      return this.http.get<{ list: Product[] }>(
        "/api/searchProductsByString?q=" + input + "&page=" + page
      );
    }

    loadProductsCount(
      categorySlug,
      category,
      filter,
      page,
      limit,
      bestSellerTotalPage = -1,
      priceRangeSelection: string
    ): Observable<{ count: number }> {
      let url;
      let orderBy = 15;
  
      url = "/api/filterredproducts/count";
      url = `${url}?page=${page}&limit=${limit}&category_ids=${category}&orderBy=${orderBy}&bestSellerTotalPage=${bestSellerTotalPage}`;
      if (filter && filter != null && filter !== "") {
        url = url + "&alreadyfiltered_specoption_ids=" + filter;
      }
  
      if (priceRangeSelection) {
        url = `${url}&selectedPriceRange=${priceRangeSelection}`;
      }
      return this.http.get<{ count: number }>(url);
    }

    loadProducts(
      categorySlug,
      category,
      filter,
      page,
      limit,
      bestSellerTotalPage = -1,
      priceRangeSelection: string,
      sortby=0,
      route = this.route.snapshot
    ) {
      let url;
      let orderBy = 0;
      if (categorySlug === "new-in") {
        url = "/api/newlyAddedProduct?";
        category = 0;
        if (route.params["parent"]) {
          url = url + "filterSlug=" + route.params["parent"] + "&";
        }
      } else {
        orderBy = -1;
        url = "/api/products?";
      }
      url = `${url}page=${page}&limit=${limit}`;
      if (category !== "0" && category !== 0) {
        url = `${url}&category_ids=${category}`;
      }
      if (filter && filter != null && filter !== "") {
        orderBy = 15;
        url = url + "&alreadyfiltered_specoption_ids=" + filter;
      }
  
      if (priceRangeSelection != '0-max') {
        orderBy = 15;
        url = `${url}&selectedPriceRange=${priceRangeSelection}`;
      }
      
      url = `${url}&orderBy=${orderBy}&bestSellerTotalPage=${bestSellerTotalPage}`;
      if(sortby){
        url=`${url}&sortBy=${sortby}`;
      }
      const totalSlug =
        categorySlug +
        "-" +
        route.queryParams.categoryId +
        "-" +
        route.queryParams.collection +
        "-" +
        route.queryParams.specAttr;
      return this.http.get(url).pipe(
        tap((response: ProductDTO) => {
          this.productStore.setCategoryProducts(totalSlug, response, page);
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
  

    getProductsFromCategorySlug(slug, route): Observable<ProductDTO> {
        const totalSlug =
          slug +
          "-" +
          route.queryParams.categoryId +
          "-" +
          route.queryParams.collection +
          "-" +
          route.queryParams.specAttr;
    
        const tempObj = this.productStore.getProductsByCategorySlug(totalSlug);
        if (tempObj) {
          return new Observable(observer => {
            observer.next(tempObj);
            observer.complete();
          });
        }
    
        if (
          this.state.get(CATEGORY_SLUG_KEY, null as any) === totalSlug &&
          slug !== "new-in"
        ) {
          if (route.queryParams.categoryId) {
            this.productStore.setCategoryProducts(
              totalSlug,
              this.state.get(CATEGORY_ROUTE_PRODUCT_LIST, null as any),
              1
            );
          } else {
            this.productStore.setCategoryProducts(
              slug,
              this.state.get(CATEGORY_ROUTE_PRODUCT_LIST, null as any),
              1
            );
          }
          return new Observable(observer => {
            observer.next(this.state.get(CATEGORY_ROUTE_PRODUCT_LIST, null as any));
            observer.complete();
          });
        }
    
        return this.http.get("/api/slug_to_id/" + slug).pipe(
          tap((response: any) => {
            if (response && response.id) {
            } else {
              this.statusCodeService.usage = "Slug id not found";
              this.statusCodeService.statusCode = 302;
              this.statusCodeService.url = "/";
              this.router.navigateByUrl("/");
            }
          }),
          map((response: any) => {
            return response ? response.id : "1";
          }),
          mergeMap(id => {
            return this.loadProducts(
              slug,
              route.queryParams.collection ? route.queryParams.collection : id,
              route.queryParams.specAttr,
              1,
              12,
              -1,
              '0-max',
              0,
              route
            );
          }),
          tap((response: ProductDTO) => {
            this.state.set(CATEGORY_SLUG_KEY, totalSlug);
            this.state.set(CATEGORY_ROUTE_PRODUCT_LIST, response);
          }),
          catchError(err => {
            this.statusCodeService.usage = err;
            this.statusCodeService.statusCode = 302;
            this.statusCodeService.url = "/";
            this.router.navigateByUrl("/");
            return of(new ProductDTO([]));
          })
        );
      }

    getFeaturedProduct(id): Observable<ProductDTO> {
      return this.http.get<ProductDTO>("/api/featuredProducts/" + id);
    }

    getCategory(slug, route = {}): Observable<[CategoriesListModel, ProductDTO]> {
      return forkJoin(
        this.fetchCategory(),
        this.getProductsFromCategorySlug(slug, route)
      );
    }
}