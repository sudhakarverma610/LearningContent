import { NgModule } from '@angular/core';
import { CreateYourOwnStoryService } from './createYourOwnStory.service';
import { CreateYourOwnStoryComponent } from './createYourOwnStory.component';
import { InviteComponent } from './invite/invite.component';
import { ResultComponent } from './result/result.component';
import { PollingComponent } from './polling/polling.component';
import { CreateYourOwnStoryRoutingModule } from './createYourOwnStoryRouting.module';
import { MatCardModule } from '@angular/material/card';
import { SharePopUpComponent } from './result/sharePopUp/sharePopUp.component';
import { SharedImportsModule } from '../sharedImports/sharedImports.module';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { TellMeYBeginDialogComponent } from './tell-me-y-begin-dialog/tell-me-y-begin-dialog.component';
import { TellMeLoginComponent } from './tell-meLogin/tell-meLogin.component';
import { AuthModule } from '../auth/auth.module';
import { CreateYourStoryResolver } from './createYourOwnStory.resolver';
import { PipeModule } from 'src/pipes/pipe.module';

@NgModule({
  declarations: [
    CreateYourOwnStoryComponent,
    InviteComponent,
    ResultComponent,
    PollingComponent,
    SharePopUpComponent,
    TellMeYBeginDialogComponent,
    TellMeLoginComponent
  ],
  imports: [
    SharedImportsModule,
    CreateYourOwnStoryRoutingModule,
    MatCardModule,
    MatProgressBarModule,
    AuthModule,
    PipeModule
  ],
  entryComponents: [SharePopUpComponent, TellMeYBeginDialogComponent],
  providers: [CreateYourOwnStoryService, CreateYourStoryResolver]
})
export class CreateYourOwnStoryModule {}
