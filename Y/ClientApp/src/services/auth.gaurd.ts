import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  Route
} from '@angular/router';
import { Observable } from 'rxjs';
import { StoreService } from 'src/store/store.service';

@Injectable()
export class AuthGuard implements CanActivate {
  // tslint:disable-next-line: variable-name
  constructor(private _storeService: StoreService, private _router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this._storeService.getLoginStatus()) {
      return true;
    }
    console.log('not logged in gaurd');
    // navigate to login page
    this._router.navigateByUrl(
      '/auth/login?returnUrl=' + encodeURIComponent(state.url)
    );
    // you can save redirect url so after authing we can move them back to the page they requested
    return false;
  }
}
