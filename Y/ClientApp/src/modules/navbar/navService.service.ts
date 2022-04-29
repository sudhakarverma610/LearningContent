import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable, noop } from 'rxjs';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { CategoryStoreService, NavSubCategories } from 'src/store/categoriesStore.service';
import { map, catchError } from 'rxjs/operators';
import { CategoriesListModel } from 'src/store/categories/categories.model';
import { FooterService } from '../footer/footer.service';
import { SharedService } from '../shared/shared.service';

const CATEGORIES_NAV_HOME_KEY = makeStateKey('categories_nav_home');
const CATEGORIES_HOME_KEY = makeStateKey('categories_home');
const TAGS_FETCHED = makeStateKey('tagsfetched');
const TAGS = makeStateKey('tags');

@Injectable()
export class NavService {
  searchTerms: string[] = [];
  public tagsFetched = false;


  constructor(
    private http: HttpClient,
    private categoryStore: CategoryStoreService,
    private footerService: FooterService,
    private sharedService: SharedService,
    private state: TransferState
  ) {
    this.getCat().subscribe(noop);
  }

  getCategories(): Observable<{ homeSubCategories: NavSubCategories }> {
    if (this.state.get(CATEGORIES_NAV_HOME_KEY, null as any)) {
      this.categoryStore.setNavCategoriesList(
        this.state.get(CATEGORIES_NAV_HOME_KEY, null as any)
      );
      return new Observable<{ homeSubCategories: NavSubCategories }>(
        observer => {
          observer.next(this.state.get(CATEGORIES_NAV_HOME_KEY, null as any));
          observer.complete();
        }
      );
    }

    if (this.categoryStore.getNavCategoriesListLoadedStatus()) {
      return new Observable<{ homeSubCategories: NavSubCategories }>(
        observer => {
          observer.next(this.categoryStore.getNavCategoriesList());
          observer.complete();
        }
      );
    }

    return this.http
      .get<{ homeSubCategories: NavSubCategories }>(`/api/navSubCategories`)
      .pipe(
        map((response: { homeSubCategories: NavSubCategories }) => {
          this.state.set(CATEGORIES_NAV_HOME_KEY, response);
          this.categoryStore.setNavCategoriesList(response);
          return response;
        }),
        catchError(err => {
          console.log(err);
          return of({ homeSubCategories: new NavSubCategories() });
        })
      );
  }
  /////////
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

  getSearchTerms() {
    return this.searchTerms;
  }

  setSearchterms(input: string[]) {
    this.tagsFetched = true;
    this.searchTerms = input;
  }
  getProductTags(): Observable<{ list: string[] }> {
    // checks if data has been set on server with ssr
    if (this.state.get(TAGS_FETCHED, null as any)) {
      return new Observable(observer => {
        observer.next(this.state.get(TAGS, null as any));
        observer.complete();
      });
    }
    if (this.tagsFetched) {
      return new Observable(observer => {
        observer.next({ list: this.searchTerms });
        observer.complete();
      });
    }
    return this.sharedService.IntialStoreSetting().pipe(
      map(it => {
            const temp = {
              list: it.ProductTags.list.filter(
                // tslint:disable-next-line: no-shadowed-variable
                it =>
                  it !== 'banner' &&
                  it !== 'banner1' &&
                  it !== 'hide' &&
                  it !== 'base' &&
                  it !== 'slowmover'
              )
            };
            this.setSearchterms(temp.list);
            this.state.set(TAGS_FETCHED, true);
            this.state.set(TAGS, temp);
            return temp;
          })
    );

    // return this.http.get<{ list: string[] }>('/api/getproducttags').pipe(
    //   map(it => {
    //     const temp = {
    //       list: it.list.filter(
    //         // tslint:disable-next-line: no-shadowed-variable
    //         it =>
    //           it !== 'banner' &&
    //           it !== 'banner1' &&
    //           it !== 'hide' &&
    //           it !== 'base' &&
    //           it !== 'slowmover'
    //       )
    //     };
    //     this.setSearchterms(temp.list);
    //     this.state.set(TAGS_FETCHED, true);
    //     this.state.set(TAGS, temp);
    //     return temp;
    //   })
    // );
  }
}
