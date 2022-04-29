import { Injectable } from '@angular/core';

import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { CategoriesListModel } from 'src/store/categories/categories.model';
import { ProductDTO } from 'src/store/products/products.model';
import { ProductListingService } from '../productListing.service';

@Injectable()
export class ProductListingResolver implements Resolve<any> {
  constructor(private productCategoryService: ProductListingService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<[CategoriesListModel, ProductDTO]> {
    return this.productCategoryService.getCategory(
      // tslint:disable-next-line: no-string-literal
      route.params['category'],
      route
    );
  }
}
