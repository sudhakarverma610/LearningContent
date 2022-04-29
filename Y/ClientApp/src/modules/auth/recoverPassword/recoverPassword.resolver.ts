import { Injectable } from '@angular/core';

import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/services/auth.service';

@Injectable()
export class RecoverPasswordResolver implements Resolve<any> {
  constructor(private service: AuthService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<{ success: boolean; error: string }> {
    return this.service.passwordRecoveryValidation(
      route.queryParams["token"],
      route.queryParams["guid"]
    );
  }
}
