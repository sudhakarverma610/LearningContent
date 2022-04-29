import { Injectable } from '@angular/core';

import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { ProductDTO } from 'src/store/products/products.model';
import { GiftCardService } from '../giftCard.service';
import { Observable } from 'rxjs';
import { CategoriesListModel } from 'src/store/categories/categories.model';

@Injectable()
export class GiftCardListingResolver implements Resolve<any> {
  constructor(private giftCardService: GiftCardService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<[CategoriesListModel, ProductDTO]> {
    return this.giftCardService.getGiftCards(route.params['category']);
  }
}
