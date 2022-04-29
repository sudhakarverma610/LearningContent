import { Injectable } from '@angular/core';

import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from 'src/store/products/products.model';
import { SearchService } from '../search.service';

@Injectable()
export class SearchListingResolver implements Resolve<any> {
  constructor(private service: SearchService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<{ list: Product[] }> {
    return this.service.searchQuery(route.queryParams['q'], 1);
  }
}
