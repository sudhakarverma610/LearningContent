import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CartGaurd } from "./cartEmpty.gaurd";
import { RetryPaymentComponent } from "./retryPayment/retryPayment.component";
import { RetryPaymentResolver } from "./retryPayment/retryPayment.resolver";
import { MainCartViewComponent } from './mainCartView/mainCartView.component';
import { CartResolver } from './cart.resolver';
import { ShipToComponent } from './shipTo/shipTo.component';
import { PaymentsComponent } from './payments/payments.component';
import { PaymentMethodsResolver } from './paymentMethods.resolver';
import { OrderPlacementSuccessComponent } from './orderPlacementSuccess/orderPlacementSuccess.component';
import { OrderPlacementFailureComponent } from './orderPlacementFailure/orderPlacementFailure.component';

const routes: Routes = [
  {
    path: "cart",
    component: MainCartViewComponent,
    resolve: { cart: CartResolver }
  },
  {
    path: "checkout",
    component: ShipToComponent,
    canActivate: [CartGaurd],
    resolve: { cart: CartResolver }
  },
  {
    path: "payments",
    component: PaymentsComponent,
    canActivate: [CartGaurd],
    resolve: { paymentMethods: PaymentMethodsResolver }
  },
  {
    path: "retryPayment/:orderId",
    component: RetryPaymentComponent,
    resolve: { order: RetryPaymentResolver }
  },
  {
    path: "orderplacementsuccess",
    component: OrderPlacementSuccessComponent
  },
  {
    path: "orderplacementfailure",
    component: OrderPlacementFailureComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule {}
