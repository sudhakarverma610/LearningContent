import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
// import { GiftCardMainComponent } from './main/giftCardMain.component';
// import { GiftCardResolver } from './giftCard.resolver';
import { GiftCardDetailsComponent } from './item/giftCardDetails.component';
import { GiftCardForDetailResolver } from './item/giftcarditem.resolver';
// import { GiftCardListingComponent } from './listing/giftCardListing.component';
// import { GiftCardListingResolver } from './listing/giftCardListing.resolver';
// import { GiftCardForDetailResolver, GiftCardItemResolver } from './item/giftcarditem.resolver';

const routes: Routes = [
  {
    path:"",
     component:GiftCardDetailsComponent,
    resolve: { giftCards:GiftCardForDetailResolver }
    // path: "",
    // component: GiftCardMainComponent,
    // resolve: { giftCards: GiftCardResolver },
    // children: [
    //   {
    //     path: ":category",
    //     component: GiftCardListingComponent,
    //     resolve: { giftCards: GiftCardListingResolver }
    //   },
    //   {
    //     path: ":category/:product",
    //     component: GiftCardDetailsComponent,
    //     resolve: { giftCards: GiftCardItemResolver }
    //   }
    // ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GiftCardRoutingModule {}
