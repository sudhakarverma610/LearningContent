import { NgModule } from '@angular/core';
import { BaseComponent } from './base.component';
import { BaseRoutingModule } from './baseRouting.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { Location } from '@angular/common';
import { InViewportModule } from 'ng-in-viewport';
import { NavbarModule } from 'src/modules/navbar/navbar.module';
import { FooterModule } from 'src/modules/footer/footer.module';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { ScrollStoreService } from 'src/services/scrollStore.service';
import { AuthGuard } from 'src/services/auth.gaurd';
import { CartService } from 'src/services/cart.service';
import { CartStoreService } from 'src/store/cartStore.service';
import { CustomerStoreService } from 'src/store/customerStore.service';
import { NotificationModule } from 'src/modules/notification/notification.module';
import { MetaService } from 'src/services/meta.service';
import { SharedModule } from 'src/modules/shared/shared.module';
import { SharedImportsModule } from 'src/modules/sharedImports/sharedImports.module';
import { SharedService } from 'src/modules/shared/shared.service';
@NgModule({
  declarations: [
    BaseComponent
  ],
  imports: [
    NavbarModule,
    FooterModule,
    BaseRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NotificationModule,
    InViewportModule,
    SharedModule,
    SharedImportsModule
  ],
  providers: [
    ScrollStoreService,
    AuthGuard,
    CartService,
    CartStoreService,
    CustomerStoreService,
    Location,
    SharedService,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    MetaService
  ],
  exports: [BaseComponent]
})
export class BaseModule {}
