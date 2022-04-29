import { NgModule } from '@angular/core';
import { ProfileService } from './profile/profile.service';
import { ProfileComponent } from './profile/profile.component';
import { MyOrdersComponent } from './profile/myOrders/myOrders.component';
import { MyAddressesComponent } from './profile/myAddresses/myAddresses.component';
import { AddAddressComponent } from './profile/myAddresses/addAddress/addAddress.component';
import { AccountDetailsComponent } from './profile/accountDetails/accountDetails.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MyCreditsComponent } from './profile/mycredits/mycredits.component';
import { SharedModule } from '../shared/shared.module';
import { AccountRoutingModule } from './accountRouting.module';
import { GdprPopUpComponent } from './profile/accountDetails/gdprPopUp/gdprPopUp.component';
import { EditDetailsComponent } from './profile/accountDetails/editDetails/editDetails.component';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS
} from '@angular/material-moment-adapter';
import { SharedImportsModule } from '../sharedImports/sharedImports.module';
import { CustomerVerificationModule } from '../customerVerfication/customerVerification.module';
import { NotificationListComponent } from './profile/notificationList/notificationList.component';
import { TrackComponent } from './profile/myOrders/track/track.component';
import { MatTabsModule } from '@angular/material/tabs';
import { OrderDetailsComponent } from './profile/orderDetails/orderDetails.component';
import { OrderItemRatingResolver, ProfileResolver, ReturnResolver } from './profile/profile.resolver';
import { OrderReturnComponent } from './profile/orderReturn/orderReturn.component';
import { MatCheckboxModule  } from '@angular/material/checkbox';
import { MatFormFieldModule  } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { OrderComponent } from './profile/order/order.component';
import {PipeModule} from 'src/pipes/pipe.module';
import { OrderRatingsComponent } from './profile/orderRatings/orderRatings.component';
@NgModule({
  declarations: [
    ProfileComponent,
    MyOrdersComponent,
    MyAddressesComponent,
    AddAddressComponent,
    EditDetailsComponent,
    AccountDetailsComponent,
    MyCreditsComponent,
    GdprPopUpComponent,
    NotificationListComponent,
    TrackComponent,
    OrderComponent,
    OrderDetailsComponent,
    OrderReturnComponent,
    OrderRatingsComponent
  ],
  imports: [
    MatTabsModule,
    SharedImportsModule,
    InfiniteScrollModule,
    SharedModule,
    AccountRoutingModule,
    CustomerVerificationModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    PipeModule
  ],
  entryComponents: [
    GdprPopUpComponent,
    EditDetailsComponent,
    AddAddressComponent,
    TrackComponent
  ],
  providers: [
    ProfileService,
    ProfileResolver,
    ReturnResolver,
    OrderItemRatingResolver,
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ],
  exports: [MatCheckboxModule]
})
export class AccountModule {}
