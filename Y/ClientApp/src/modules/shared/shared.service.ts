import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { StoreSettingsResponse } from 'src/store/yjStoreModels/StoreSettings';
import { SocialLinks } from '../footer/footer.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators';
const INTIAL_STORESETTING =  makeStateKey('IntialStoreSetting');
const INTIAL_STORESETTING_FETCHED = makeStateKey('socialsettingsfetched');
@Injectable()
export class SharedService {
  endPoint: string;
  constructor(
    private http: HttpClient,
    private state: TransferState,
    ) {
  }
  IntialStoreSetting(): Observable<{
    currentStoreSettings: StoreSettingsResponse;
    SocialLinksSettings: SocialLinks;
    DiscountBannerSettings: { banner: string, view: boolean };
    ProductTags: { list: string[] }
  }> {
    if (this.state.get(INTIAL_STORESETTING_FETCHED, null as any)) {
      return new Observable(observer => {
        observer.next(this.state.get(INTIAL_STORESETTING, null as any));
        observer.complete();
      });
    }
    return this.http
      .get<{
        currentStoreSettings: StoreSettingsResponse;
        SocialLinksSettings: SocialLinks;
        DiscountBannerSettings: { banner: string, view: boolean };
        ProductTags: { list: string[] }
      }>(`/api/IntialStoreSetting`)
      .pipe(
        map(item => {
          this.state.set(INTIAL_STORESETTING_FETCHED, true);
          this.state.set(INTIAL_STORESETTING, item);
          return item;
        })
      );

}
  getCookieAcceptanceStatus() {
    return this.http.get('/api/getCookieAcceptanceStatus');
  }

  AcceptCookieAcceptance() {
    return this.http.post('/api/acceptCookieAcceptance', {});
  }

  getUserByGUID(guid) {
    return this.http.get('/api/getCustomerFromGUID/' + guid);
  }

  changePassword(data) {
    return this.http.post('/api/forgotpassword/', data);
  }
  getAllPromotional() {
    return {src:'https://yjewelry.s3.ap-south-1.amazonaws.com/assets/img/2020/promotionalimages/01-push-ratings+1.jpg',
            link:'',
            heading:'',
            subheading:'',
          }
  }
}
