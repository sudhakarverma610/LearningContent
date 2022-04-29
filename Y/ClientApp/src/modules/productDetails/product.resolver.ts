import { Injectable } from '@angular/core';

import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { CategoriesListModel } from 'src/store/categories/categories.model';
import { Product } from 'src/store/products/products.model';
import { ProductDetailsService } from './productDetails.service';

@Injectable()
export class ProductResolver implements Resolve<any> {
  constructor(private productCategoryService: ProductDetailsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<[CategoriesListModel, Product]> {
    return this.productCategoryService.getProductData(
      route.params['category'],
      route.params['product'],
      route.queryParams.isId
    );
  }
}
