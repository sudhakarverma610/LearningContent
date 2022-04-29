import {
  BrowserModule,
  BrowserTransferStateModule
} from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BaseModule } from './baseComponent/base.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APIResolver } from './app.resolver';
import { CategoryStoreService } from '../store/categoriesStore.service';
import { ProductStoreService } from 'src/store/productsStore.service';
import { CssFlexLayoutModule } from 'angular-css-flex-layout';
import { Angulartics2Module } from 'angulartics2';
import { RouterModule } from '@angular/router';
import {
  HammerGestureConfig,
  HAMMER_GESTURE_CONFIG
} from '@angular/platform-browser';
import { MiscStoreService } from 'src/store/miscStore.service';
import { MatDialogModule } from '@angular/material/dialog';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppService } from 'src/services/app.service';
import { PwaService } from 'src/services/pwa.service';
import { StoreService } from 'src/store/store.service';
import { AuthService } from 'src/services/auth.service';
import { AuthInterceptor } from 'src/services/auth.interceptor';
import { NotificationService } from 'src/modules/notification/notification.service';
import { ConfiguratorStoreService } from 'src/modules/configurator/configuratorStore.service';
import { ConfiguratorService } from 'src/modules/configurator/configurator.service'; 

export class MyHammerConfig extends HammerGestureConfig {
  // custom hammer configuration to allow up/down swipe for scrolling
  options = {
    touchAction: 'pan-y'
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    BrowserTransferStateModule,
    BaseModule,
    CssFlexLayoutModule,
    HttpClientModule,
    RouterModule,
    MatDialogModule,
    Angulartics2Module.forRoot({
      pageTracking: {
        excludedRoutes: ['category/', 'product/']
      }
    }),
    ServiceWorkerModule.register('./ngsw-worker.js', {
      enabled: true
    })
  ],
  providers: [
    AppService,
    PwaService,
    AuthService,
    StoreService,
    NotificationService,
    APIResolver,
    CategoryStoreService,
    ProductStoreService,
    MiscStoreService,
    ConfiguratorStoreService,
    ConfiguratorService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    },
    { provide: 'REQUEST', useValue: {} }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
