import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { StoreService } from 'src/store/store.service';
import { StoreSettings, StoreSettingsResponse } from 'src/store/yjStoreModels/StoreSettings';
import { of } from 'rxjs/internal/observable/of';
import { SharedService } from '../shared/shared.service';

const SOCIAL_SETTINGS_FETCHED = makeStateKey('socialsettingsfetched');
const SOCIAL_SETTINGS = makeStateKey('socialsettings');
const STORE_SETTINGS = makeStateKey('store-settings');

@Injectable()
export class FooterService {
    public socialLinks: Subject<SocialLinks> = new Subject();
    public footerShow;
    constructor(
      private state: TransferState,
      private http: HttpClient,
      private storeService: StoreService,
      private shareService: SharedService
    ) {
    }

    getDeliveryStatus(pincode): Observable<DeliveryStatus> {
      return this.http.get<DeliveryStatus>('/api/servicesbypin/' + pincode);
    }
    getSocialLinks(): Observable<SocialLinks> {
      // this.shareService.IntialStoreSetting().pipe
      // if(this.shareService.IntialStoreSetting().pipe)
      // checks if data has been set on server with ssr
      if (this.state.get(SOCIAL_SETTINGS_FETCHED, null as any)) {
        return new Observable(observer => {
          observer.next(this.state.get(SOCIAL_SETTINGS, null as any));
          observer.complete();
        });
      }
      return this.shareService.IntialStoreSetting().pipe(
        map(item => {
        this.state.set(SOCIAL_SETTINGS_FETCHED, true);
        this.state.set(SOCIAL_SETTINGS, item.SocialLinksSettings);
        return item.SocialLinksSettings;
        })
      );

      // return this.http
      //   .get<SocialLinks>(`/api/social_settings`)
      //   .pipe(
      //     map(item => {
      //       this.state.set(SOCIAL_SETTINGS_FETCHED, true);
      //       this.state.set(SOCIAL_SETTINGS, item);
      //       return item;
      //     })
      //   );
    }

  subscribeToNewsletters(email) {
      return this.http.get('/api/subscribeToNewsletter/' + email);
    }
    getCurrentStore(): Observable<StoreSettings> {
      const currentStore = this.storeService.getCurrentStore();
      if (currentStore) {
        return of(currentStore);
      } else {
        if (this.state.get(SOCIAL_SETTINGS_FETCHED, null as any)) {
          return new Observable(observer => {
            observer.next(this.state.get(STORE_SETTINGS, null as any));
            observer.complete();
          });
        }
        return this.shareService.IntialStoreSetting().pipe(
          map(item => {
            this.state.set(STORE_SETTINGS, item.currentStoreSettings.stores[0]);
            this.state.set(SOCIAL_SETTINGS_FETCHED, true);
            this.storeService.setCurrentStore(item.currentStoreSettings.stores[0]);
            return item.currentStoreSettings.stores[0];
          })
        );
        // return this.http
        //   .get<StoreSettingsResponse>(`/api/current_store`)
        //   .pipe(
        //     map(item => {
        //        this.state.set(STORE_SETTINGS, item.stores[0]);
        //        this.state.set(SOCIAL_SETTINGS_FETCHED, true);
        //        this.storeService.setCurrentStore(item.stores[0]);
        //        return item.stores[0];
        //     })
        //   );
       // this.http.get('/api/current_store');
      }
    }
}

export interface SocialLinks {
  facebook: string;
  instegram: string;
  twitter: string;
  pinterest: string;
  roposo: string;
}
export interface DeliveryStatus {
  AirValueLimit: number;
  AirValueLimiteTailPrePaid: number;
  ApexEconomyInbound: string;
  ApexEconomyOutbound: string;
  ApexInbound: string;
  ApexOutbound: string;
  ApexTDD: string;
  AreaCode: string;
  DPDutsValueLimit: string;
  DomesticPriorityInbound: string;
  DomesticPriorityOutbound: string;
  DomesticPriorityTDD: string;
  EDLAddDays: string;
  EDLDist: string;
  EDLProduct: string;
  Embargo: string;
  GroundInbound: string;
  GroundOutbound: string;
  GroundValueLimit: number;
  GroundValueLimiteTailPrePaid: number;
  PincodeDescription: string;
  ServiceCenterCode: string;
  ETailCODAirInbound: string;
  ETailCODAirOutbound: string;
  ETailCODGroundInbound: string;
  ETailCODGroundOutbound: string;
  ETailExpressCODAirInbound: string;
  ETailExpressCODAirOutbound: string;
  ETailExpressPrePaidAirInbound: string;
  ETailExpressPrePaidAirOutound: string;
  ETailPrePaidAirInbound: string;
  ETailPrePaidAirOutound: string;
  ETailPrePaidGroundInbound: string;
  ETailPrePaidGroundOutbound: string;
}
