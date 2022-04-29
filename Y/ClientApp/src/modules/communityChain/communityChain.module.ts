import { NgModule } from '@angular/core';

import { CommunityChainComponent } from './communityChain.component';

import { InviteToChainComponent } from './invite/invite.component';
import { CommunityChainBannerComponent } from './banner/communityChainBanner.component';
import { CommunityChainRoutingModule } from './communityChainRouting.module';
import { SharedImportsModule } from '../sharedImports/sharedImports.module';
import { CommunityChainService } from './communityChain.service';

@NgModule({
  declarations: [
    CommunityChainComponent,
    CommunityChainBannerComponent,
    InviteToChainComponent
  ],
  imports: [
    SharedImportsModule,
    CommunityChainRoutingModule
  ],
  providers: [CommunityChainService]
})
export class CommunityChainModule { }
