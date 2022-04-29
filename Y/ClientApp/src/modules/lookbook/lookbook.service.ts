import { Injectable, Optional, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CategoryStoreService } from 'src/store/categoriesStore.service';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CategoriesListModel } from 'src/store/categories/categories.model';
import { tap, catchError } from 'rxjs/operators';
import { ProductDTO } from 'src/store/products/products.model';

const CATEGORY_ROUTE_CATEGORY_LIST = makeStateKey('categoryList');

@Injectable()
export class LookbookService {
  public products = [];
  constructor(
    private http: HttpClient,
    private categoryStore: CategoryStoreService,
    private state: TransferState,
    private router: Router
  ) {
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

  getLookbookData() {
    return this.fetchCategory().pipe(
      catchError(err => {
        console.log(err);
        this.router.navigateByUrl('/');
        return of(new CategoriesListModel([]));
      })
    );
  }

  fetchProductsForCategory(categoryId, page = 1, limit = 10): Promise<ProductDTO> {
    let url = '/api/products';
    url = `${url}?category_ids=${categoryId}&page=${page}&limit=${limit}`;
    return this.http.get<ProductDTO>(url).toPromise();
  }
  test(){
    return this.http.get('/api/test');
  }
}
