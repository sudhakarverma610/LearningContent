import { Injectable } from '@angular/core';

import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { CategoriesListModel } from 'src/store/categories/categories.model';
import { LookbookService } from '../lookbook.service';

@Injectable()
export class ParisResolver implements Resolve<any> {
  constructor(private lookbookService: LookbookService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<CategoriesListModel> {
    return this.lookbookService.getLookbookData();
  }
}
