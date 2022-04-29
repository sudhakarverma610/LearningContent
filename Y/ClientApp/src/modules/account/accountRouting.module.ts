import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { AccountDetailsComponent } from './profile/accountDetails/accountDetails.component';
import { MyAddressesComponent } from './profile/myAddresses/myAddresses.component';
import { MyOrdersComponent } from './profile/myOrders/myOrders.component';
import { MyCreditsComponent } from './profile/mycredits/mycredits.component';
import { AuthGuard } from 'src/services/auth.gaurd';
import { NotificationListComponent } from './profile/notificationList/notificationList.component';
import { OrderDetailsComponent } from './profile/orderDetails/orderDetails.component';
import { OrderItemRatingResolver, ProfileResolver, ReturnResolver } from './profile/profile.resolver';
import { OrderReturnComponent } from './profile/orderReturn/orderReturn.component';
import { OrderComponent } from './profile/order/order.component';
import { OrderRatingsComponent } from './profile/orderRatings/orderRatings.component';

const routes: Routes = [
  {
   path: 'rating/:orderid',
   component: OrderRatingsComponent,
   resolve: {ratingItems: OrderItemRatingResolver}

  },
  {
    path: '',
    component: ProfileComponent,
    children: [
      { path: 'accountdetails', component: AccountDetailsComponent },
      { path: 'myaddress', component: MyAddressesComponent },
      { path: 'orders', component: OrderComponent,
                    children: [
                      { path: 'myorders', component: MyOrdersComponent } ,
                      {path: 'orderReturn/:id', component: OrderReturnComponent, resolve: {returnRequest: ReturnResolver}},
                      {path: 'orderDetails/:id', component: OrderDetailsComponent, resolve: {order: ProfileResolver}},
                      {path: '', redirectTo: 'myorders', pathMatch: 'full' }
                    ]
                                                       },
      { path: 'myorders', redirectTo: 'orders/myorders'},
      { path: 'mycredits', component: MyCreditsComponent },
      { path: 'mynotifications', component: NotificationListComponent },
      { path: '', redirectTo: 'accountdetails', pathMatch: 'full' }
    ],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {}
