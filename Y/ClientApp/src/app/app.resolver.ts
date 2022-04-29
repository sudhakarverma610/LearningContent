import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { noop } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppService } from 'src/services/app.service';
import { AuthService } from 'src/services/auth.service';
import { StoreService } from 'src/store/store.service';

@Injectable()
export class APIResolver implements Resolve<any> {
  constructor(
    private appService: AppService,
    private authService: AuthService,
    private storeService: StoreService
  ) {}
  resolve() {
    if (this.appService.isBrowser) {
      // To sync the state of server with browser, checks if token is stored in browser previosly or not
      this.authService
        .customerStatus()
        .subscribe(
          (item: {
            id: number;
            email: string;
            isGuest: boolean;
            isActive: boolean;
            isRegisterred: boolean;
          }) => {
            if (item.isRegisterred) {
              this.authService.loginStatusSetByResolver = true;
              this.storeService.setLoginToken();
            } else {
              this.storeService.loginStatus = false;
            }
          }
        );
    }
    // gets the initial API token from the server before initializind the base component

    return this.authService.customerStatus().pipe(
      map((access_token: any) => {
        this.authService.reAuth().subscribe(noop);
        this.storeService.setToken();
        return access_token;
      })
    );
  }
}
