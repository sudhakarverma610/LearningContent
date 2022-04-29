import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  Route
} from '@angular/router';
import { Observable } from 'rxjs';
import { CartStoreService } from 'src/store/cartStore.service';

@Injectable()
export class CartGaurd implements CanActivate {
  constructor(private cartService: CartStoreService, private _router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.cartService.getCartQuanity() > 0) {
      return true;
    }
    // console.log('not logged in gaurd');
    // navigate to login page
    this._router.navigate(['/']);
    // you can save redirect url so after authing we can move them back to the page they requested
    return false;
  }
}
