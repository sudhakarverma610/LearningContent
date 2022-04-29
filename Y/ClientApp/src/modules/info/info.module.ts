import { NgModule } from '@angular/core';
import { InfoComponent } from './info.component';
import { CommonModule } from '@angular/common';
import { InfoRoutingModule } from './infoRouting.module';
import { ContentComponent } from './content/content.component';
import { InfoService } from './info.service';
import { CareComponent } from './care/care.component';
import { ContactComponent } from './contact/contact.component';
import { FormsModule } from '@angular/forms';
import { InfoStoreService } from './infoStore.service';
import { InfoResolver } from './info.resolver';
import { CssFlexLayoutModule } from 'angular-css-flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { AboutComponent } from './about/about.component';
// import { AboutService } from './about/about.service';
// import { AboutResolver } from './about/about.resolver';
import { LandingComponent } from './landing/landing.component';
import { SharedModule } from '../shared/shared.module';
import { ReviewComponent } from './review/review.component';
import { ReviewResolver } from './review/review.resolver';
import { SharedImportsModule } from '../sharedImports/sharedImports.module';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import {MatCardModule} from '@angular/material/card';
import { InViewportModule } from 'ng-in-viewport';
import { ForgeryComponent } from './forgery/forgery.component';

@NgModule({
  declarations: [
    InfoComponent,
    ContentComponent,
    CareComponent,
    ContactComponent,
    AboutComponent,
    LandingComponent,
    ReviewComponent,
    ForgeryComponent
  ],
  imports: [
    SharedImportsModule,
    CommonModule,
    FormsModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    CssFlexLayoutModule,
    InfoRoutingModule,
    MatSelectModule,
    MatCardModule,
    InViewportModule,
  ],
  providers: [InfoService, InfoStoreService, InfoResolver/*, AboutService, AboutResolver*/, ReviewResolver,
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }]
})
export class InfoModule {}
