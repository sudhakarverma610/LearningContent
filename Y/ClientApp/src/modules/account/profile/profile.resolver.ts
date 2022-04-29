import { Injectable } from '@angular/core';
import {  ActivatedRouteSnapshot, Resolve,  RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ProfileService } from './profile.service';

@Injectable()
export class ProfileResolver implements Resolve<any> {
  constructor(private profileService: ProfileService) {}

  resolve( route: ActivatedRouteSnapshot,
           state: RouterStateSnapshot): Observable<any>|Promise<any> | any {
        const orderid = route.paramMap.get('id');
        return this.profileService.getOrder(orderid);
  }
}
@Injectable()
export class ReturnResolver implements Resolve<any> {
  constructor(private profileService: ProfileService) {}

  resolve( route: ActivatedRouteSnapshot,
           state: RouterStateSnapshot): Observable<any>|Promise<any> | any {
        const orderid = route.paramMap.get('id');
        return this.profileService.getReturnRequest(orderid);
  }
}
@Injectable()
export class OrderItemRatingResolver implements Resolve<any> {
  constructor(private profileService: ProfileService) {}

  resolve( route: ActivatedRouteSnapshot,
           state: RouterStateSnapshot): Observable<any>|Promise<any> | any {
        const orderid = route.paramMap.get('orderid');
        return this.profileService.getOrderItemRating(orderid);
  }
}
