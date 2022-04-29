import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot} from '@angular/router';
import { Observable } from 'rxjs';
import { ProductService } from './product.service';

@Injectable()
export class SeNameResolver implements Resolve<any> {
  constructor(private productService: ProductService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<{ type: number; categorySename: string; sename: string }> {
    return this.productService.getEntityType(route.params['sename']);
  }
}
