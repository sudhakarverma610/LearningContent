import { Injectable } from '@angular/core';

import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { CategoriesListModel } from 'src/store/categories/categories.model';
import { Product, ProductDTO } from 'src/store/products/products.model';
import { GiftCardService } from '../giftCard.service';

@Injectable()
export class GiftCardItemResolver implements Resolve<any> {
  constructor(private productCategoryService: GiftCardService) {}

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

@Injectable()
export class GiftCardForDetailResolver implements Resolve<any> {
  constructor(private giftCardService: GiftCardService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<CategoriesListModel> {
    return this.giftCardService.getCat();
  }
}
