import { Injectable } from '@angular/core';

import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { NavService } from './navService.service';
import { NavSubCategories } from 'src/store/categoriesStore.service';

@Injectable()
export class NavResolver implements Resolve<any> {
  constructor(private navService: NavService) { }

  resolve(): Observable<{ homeSubCategories: NavSubCategories }> {
    return this.navService.getCategories();
  }
}
