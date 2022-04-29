import { Injectable, Optional, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { FormObject } from './review/mauticForm.model';
import { StoreSettings, StoreSettingsResponse } from 'src/store/yjStoreModels/StoreSettings';
import { map } from 'rxjs/operators';
import { StoreService } from 'src/store/store.service';
import { SharedService } from '../shared/shared.service';

@Injectable()
export class InfoService {
  public successMessageSubject: Subject<boolean> = new Subject();
  public baseUrl = '/api/topic';
  constructor(private http: HttpClient,
              private router: Router,
              private storeService: StoreService,
              private sharedService: SharedService) {
    this.baseUrl = `${this.baseUrl}`;
  }

  getData(url: string) {
    return this.http.get(this.baseUrl + url);
  }

  getMauticFormData(id: number) {
    return this.http.get<FormObject>(`/api/getformfields?id=${id}`);
  }

  getRouteData(route) {
    switch (route) {
      case 'return':
        return this.getData('/delivery1');
      case 'forgery':
        return this.getData('/warningaboutforgery1');
      case 'forgery1':
        return this.getData('/warningaboutforgery1');
      case 'faq':
        return this.getData('/faq1');
      case 'care':
        return this.getData('/care1');
      case 'sizeguide':
        return this.getData('/size-guide1');
      case 'privacy':
        return this.getData('/privacy-policy');
      case 'shipping':
        return this.getData('/shipping1');
      case 'service':
        return this.getData('/service1');
      case 'terms':
        return this.getData('/terms1');
      case 'terms-gift-voucher':
        return this.getData('/terms-gift-voucher1');
      case 'preorder-terms':
        return this.getData('/preorder-terms');
      default:
        this.router.navigateByUrl('/');
    }
  }

  fetchCare() {
    const url = '/care';
    return this.getData(url);
  }
  getCurrentStore(): Observable<StoreSettings> {
    const currentStore = this.storeService.getCurrentStore();
    if (currentStore) {
      return of(currentStore);
    } else {
      return this.sharedService.IntialStoreSetting().pipe(
        map(item => {
                 this.storeService.setCurrentStore(item.currentStoreSettings.stores[0]);
                 return item.currentStoreSettings.stores[0];
              })
      );
      // return this.http
      //   .get<StoreSettingsResponse>(`/api/current_store`)
      //   .pipe(
      //     map(item => {
      //        this.storeService.setCurrentStore(item.stores[0]);
      //        return item.stores[0];
      //     })
      //   );
    }
  }
  sendContactUsMessage(data) {
    return this.http.post('/api/contact_us', data);
  }
}
