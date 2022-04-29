import { NgModule } from "@angular/core";
import { CartComponent } from "./cart.component";
import { PipeModule } from "src/pipes/pipe.module";
import { CurrentAddressComponent } from "./currentAddress/currentAddress.component";
import { CheckoutNavComponent } from "./cartItem/checkoutNav.component";
import { MainCartViewComponent } from "./mainCartView/mainCartView.component";
import { ShipToComponent } from "./shipTo/shipTo.component";
import { OrderSummaryComponent } from "./orderSummary/orderSummary.component";
import { PaymentsComponent } from "./payments/payments.component";
import { PaymentMethodsComponent } from "./paymentMethods/paymentMethods.component";
import { PaymentMethodsResolver } from "./paymentMethods.resolver";
import { OrderPlacementFailureComponent } from "./orderPlacementFailure/orderPlacementFailure.component";
import { OrderPlacementSuccessComponent } from "./orderPlacementSuccess/orderPlacementSuccess.component";
import { CartRoutingModule } from "./cartRouting.module";
import { CartGaurd } from "./cartEmpty.gaurd";
import { AddAddressCartComponent } from "./addAddress/addCartAddress.component";
import { ShippingAddressComponent } from "./shippingAddress/shippingAddress.component";
import { BillingAddressComponent } from "./billingAddress/billingAddress.component";
import { GiftCardCheckoutComponent } from "./giftCardCheckout/giftCardCheckout.component";
import { RetryPaymentComponent } from "./retryPayment/retryPayment.component";
import { RetryPaymentResolver } from "./retryPayment/retryPayment.resolver";
import { SharedModule } from '../shared/shared.module';
import { SharedImportsModule } from '../sharedImports/sharedImports.module';
import { CustomerVerificationModule } from '../customerVerfication/customerVerification.module';
import { CartResolver } from './cart.resolver';
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
  declarations: [
    CartComponent,
    MainCartViewComponent,
    CurrentAddressComponent,
    CheckoutNavComponent,
    ShipToComponent,
    OrderSummaryComponent,
    PaymentMethodsComponent,
    PaymentsComponent,
    OrderPlacementFailureComponent,
    OrderPlacementSuccessComponent,
    AddAddressCartComponent,
    ShippingAddressComponent,
    BillingAddressComponent,
    GiftCardCheckoutComponent,
    RetryPaymentComponent,    
  ],
  imports: [
    SharedImportsModule,
    PipeModule,
    SharedModule,
    CustomerVerificationModule,
    CartRoutingModule,
    MatCheckboxModule
  ],
  entryComponents: [AddAddressCartComponent],
  providers: [PaymentMethodsResolver, RetryPaymentResolver, CartResolver, CartGaurd]
})
export class CartModule {}
