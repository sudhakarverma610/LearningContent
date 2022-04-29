import { Injectable } from '@angular/core';

import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { GiftCardService } from './giftCard.service';
import { Observable } from 'rxjs';
import { CategoriesListModel } from '../../store/categories/categories.model';

@Injectable()
export class GiftCardResolver implements Resolve<any> {
  constructor(private giftCardService: GiftCardService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<CategoriesListModel> {
    return this.giftCardService.getCat();
  }
}
