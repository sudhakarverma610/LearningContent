import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { StatusCodeService } from 'src/services/statusCode.service';

@Injectable()
export class NewInGuard implements CanActivate {
  constructor(private statusCodeServie: StatusCodeService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    // tslint:disable-next-line: no-string-literal
    if (next.params['params'] === 'new-in') {
        this.statusCodeServie.usage = 'Slug id not found';
        this.statusCodeServie.statusCode = 302;
        this.statusCodeServie.url = '/';
        this.router.navigateByUrl('/');
        return false;
    }
    return true;
  }
}
