import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommunityChainComponent } from './communityChain.component';
import { CommunityChainBannerComponent } from './banner/communityChainBanner.component';
import { InviteToChainComponent } from './invite/invite.component';
const routes: Routes = [
    {
        path: '',
        component: CommunityChainComponent,
        children: [
            { path: '', component: CommunityChainBannerComponent },
            { path: 'email', component: InviteToChainComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CommunityChainRoutingModule { }
