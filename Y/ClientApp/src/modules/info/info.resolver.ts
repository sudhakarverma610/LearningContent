import { Injectable } from '@angular/core';

import {
  Resolve,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { InfoService } from './info.service';
import { map, catchError } from 'rxjs/operators';
import { InfoStoreService } from './infoStore.service';
import { Observable, of } from 'rxjs';
import { TransferState, makeStateKey } from '@angular/platform-browser';

const INFODATA_KEY = makeStateKey('infoData');
const INFO_URL_KEY = makeStateKey('infoUrlKey');

@Injectable()
export class InfoResolver implements Resolve<any> {
  constructor(
    private infoService: InfoService,
    private router: Router,
    private infoStore: InfoStoreService,
    private state: TransferState
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.infoStore.getData(route.url[0].path)) {
      return new Observable(observer => {
        observer.next(this.infoStore.getData(route.url[0].path).data);
        observer.complete();
      });
    }

    if (
      this.state.get(INFO_URL_KEY, null as any) === route.url[0].path &&
      this.state.get(INFODATA_KEY, null as any)
    ) {
      this.infoStore.setData(
        this.state.get(INFODATA_KEY, null as any),
        route.url[0].path
      );
      return new Observable(observer => {
        observer.next(this.state.get(INFODATA_KEY, null as any));
        observer.complete();
      });
    }

    return this.infoService.getRouteData(route.url[0].path).pipe(
      map((response: any) => {
        this.state.set(INFO_URL_KEY, route.url[0].path);
        this.state.set(INFODATA_KEY, response);
        this.infoStore.setData(route.url[0].path, response);
        return response;
      }),
      catchError(err => {
        console.log(err);
        this.router.navigateByUrl('/');
        return of([]);
      })
    );
  }
}
