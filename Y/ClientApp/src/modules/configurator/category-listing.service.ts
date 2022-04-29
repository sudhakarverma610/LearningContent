import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { of,  Observable } from 'rxjs';
import { map, catchError, tap, mergeMap } from 'rxjs/operators';
import { StatusCodeService } from 'src/services/statusCode.service';
import { NavSubCategories } from 'src/store/categoriesStore.service';
import { Product, ProductDTO } from 'src/store/products/products.model';
const CATEGORIES_NAV_HOME_KEY = makeStateKey('categories_nav_home');
@Injectable()
export class CategoryListingService {
  public productsList: CategoryModelList[] = [];
    constructor( private http: HttpClient,
                 private state: TransferState,
                 private statusCodeService: StatusCodeService) {

    }
    public GetProductList(totalSlug) {
      if (!this.productsList) {
       return null;
      }
      const returnAbleProduct = this.productsList.find(x => x.seName === totalSlug);
      return returnAbleProduct;
    }
    public SetProductList(totalSlug: string, list1: ProductDTO) {
       const oldList = this.productsList.find(x => x.seName === totalSlug);
       const filterProductByconfigurator = list1.products.filter(product => {
        const result = product.tags.find(
         tag =>
           tag === 'base' ||
           tag === 'bead' ||
           tag === 'hanging'
       )
         ? true
         : false;
        const ishidetag = product.tags.find(tag => tag === 'hide') ? true : false;
        return result && !ishidetag;
       });
       list1.products = [...filterProductByconfigurator];
       if (oldList) {
          oldList.list = list1;
          return;
       }
       const newProduct: CategoryModelList = {
          seName: totalSlug,
          list: list1
        };
       this.productsList = [newProduct, ...this.productsList];
    }
    getCategories(): Observable<{ homeSubCategories: NavSubCategories }> {
        if (this.state.get(CATEGORIES_NAV_HOME_KEY, null as any)) {
            return new Observable<{ homeSubCategories: NavSubCategories }>(
              observer => {
                observer.next(this.state.get(CATEGORIES_NAV_HOME_KEY, null as any));
                observer.complete();
              }
            );
          }
        return this.http
            .get<{ homeSubCategories: NavSubCategories }>(`/api/navSubCategories`)
            .pipe(
              map((response: { homeSubCategories: NavSubCategories }) => {
                this.state.set(CATEGORIES_NAV_HOME_KEY, response);
                return response;
              }),
              catchError(err => {
                console.log(err);
                return of({ homeSubCategories: new NavSubCategories() });
              })
            );

    }
    searchQuery(input: string, page = 1) {
      return this.http.get<{ list: Product[] }>(
        '/api/searchProductsByString?q=' + input + '&page=' + page
      );
    }
    loadProductsCount(
      category,
      filter,
      page,
      limit,
      bestSellerTotalPage = -1,
      priceRangeSelection: string
    ): Observable<{ count: number }> {
      let url;
      const orderBy = 15;

      url = '/api/filterredproducts/count';
      url = `${url}?page=${page}&limit=${limit}&category_ids=${category}&orderBy=${orderBy}&bestSellerTotalPage=${bestSellerTotalPage}`;
      if (filter && filter != null && filter !== '') {
        url = url + '&alreadyfiltered_specoption_ids=' + filter;
      }

      if (priceRangeSelection) {
        url = `${url}&selectedPriceRange=${priceRangeSelection}`;
      }
      return this.http.get<{ count: number }>(url);
    }
    loadProducts(
      categorySlug,
      category,
      parentCatName, // used for new-in product pass parent category for new-in
      filter= null,
      page= 1,
      limit= null,
      bestSellerTotalPage = -1,
      priceRangeSelection: string= '0-max',
      sortby= 0,
      loadPageForOneTime = true
    ) {
      let url;
      let orderBy = 0;
      if (categorySlug === 'new-in') {
        url = '/api/newlyAddedProduct?';
        category = 0;
        if (parentCatName) {
          limit = 99;
          url = url + 'filterSlug=' + parentCatName + '&';
        }
      } else {
        orderBy = -1;
        url = '/api/products?';
      }
      url = `${url}page=${page}`;
      if (limit) {
        url = `${url}&limit=${limit}`;
      }
      if (category !== '0' && category !== 0) {
        url = `${url}&category_ids=${category}`;
      }
      if (filter && filter != null && filter !== '') {
        orderBy = 15;
        url = url + '&alreadyfiltered_specoption_ids=' + filter;
      }

      if (priceRangeSelection !== '0-max') {
        orderBy = 15;
        url = `${url}&selectedPriceRange=${priceRangeSelection}`;
      }

      url = `${url}&orderBy=${orderBy}&bestSellerTotalPage=${bestSellerTotalPage}`;
      if (sortby) {
        url = `${url}&sortBy=${sortby}`;
      }
      if (loadPageForOneTime) {
          url = `${url}&loadPageForOneTime=${loadPageForOneTime}`;
      }
      const totalSlug = categorySlug + '-' + parentCatName;
      return this.http.get(url).pipe(
        tap((response: ProductDTO) => {
            // this.productStore.setCategoryProducts(totalSlug, response, page)
            this.SetProductList(totalSlug, response);
        })
      );
    }
    getProductsFromCategorySlug(slug: any, parentCatName): Observable<ProductDTO> {
      const totalSlug =
      slug +
      '-' +
      parentCatName;

      const tempObj = this.GetProductList(totalSlug);
      if (tempObj) {
      return new Observable(observer => {
        observer.next(tempObj.list);
        observer.complete();
      });
    }
      return this.http.get('/api/slug_to_id/' + slug).pipe(
          tap((response: any) => {
            if (response && response.id) {
            } else {
              this.statusCodeService.usage = 'Slug id not found';
              this.statusCodeService.statusCode = 302;
              this.statusCodeService.url = '/';
            }
          }),
          map((response: any) => {
            return response ? response.id : '1';
          }),
          mergeMap(id => {
            return this.loadProducts(
              slug,
              id,
              parentCatName
            );
          }),
          tap(() => {
            // this.state.set(CATEGORY_SLUG_KEY, totalSlug);
            // this.state.set(CATEGORY_ROUTE_PRODUCT_LIST, response);
          }),
          catchError(err => {
            this.statusCodeService.usage = err;
            this.statusCodeService.statusCode = 302;
            this.statusCodeService.url = '/';
            return of(new ProductDTO([]));
          })
        );
    }
    getProduct(id): Observable<ProductDTO> {
        return this.http.get<ProductDTO>('/api/products/' + id);
     }
}
export interface CategoryModelList {
    seName: string;
    list: ProductDTO;
}
