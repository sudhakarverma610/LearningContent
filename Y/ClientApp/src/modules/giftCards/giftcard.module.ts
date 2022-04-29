import { NgModule } from '@angular/core';
import { GiftCardMainComponent } from './main/giftCardMain.component';
import { GiftCardListingComponent } from './listing/giftCardListing.component';
import { GiftCardDetailsComponent } from './item/giftCardDetails.component';
import { GiftCardResolver } from './giftCard.resolver';
import { GiftCardListingResolver } from './listing/giftCardListing.resolver';
import { GiftCardForDetailResolver, GiftCardItemResolver } from './item/giftcarditem.resolver';
import { GiftCardService } from './giftCard.service';
import { SharedImportsModule } from '../sharedImports/sharedImports.module';
import { GiftCardRoutingModule } from './giftcardRouting.module';
import { SharedModule } from '../shared/shared.module';
import { PipeModule } from 'src/pipes/pipe.module'; 
@NgModule({
    imports: [SharedImportsModule, GiftCardRoutingModule, SharedModule, PipeModule],
    exports: [],
    declarations: [GiftCardMainComponent, GiftCardListingComponent, GiftCardDetailsComponent],
    providers: [GiftCardService,GiftCardForDetailResolver, GiftCardResolver, GiftCardListingResolver, GiftCardItemResolver],
})
export class GiftcardModule { }
