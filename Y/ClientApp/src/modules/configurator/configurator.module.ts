import { NgModule } from '@angular/core';
import { BaseDailogComponent } from './baseDailog/baseDailog.component';
import { PreviewComponent } from './preview/preview.component';
import { ConfiguratorService } from './configurator.service'; 
import { CharmsListingComponent } from './charmsListing/charmsListing.component';
import { BaseListingComponent } from './baseListing/baseListing.component';
import { IntroComponent } from './intro/intro.component';
import { SizeSelectionDailogComponent } from './sizeSelectionDailog/sizeSelectionDailog.component';
import { SharedImportsModule } from '../sharedImports/sharedImports.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PipeModule } from 'src/pipes/pipe.module';
import { ConfiguratorRoutingModule } from './configuratorRouting.module'; 
import { CategoryListingComponent } from './category-listing/category-listing.component';
import { CategoryListingService } from './category-listing.service';
import { CarouselListingComponent } from './CarouselListing/CarouselListing.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ProductConfiguratorComponent } from './product-configurator/product-configurator.component';
import { LandingConfiguratorComponent } from './landingConfigurator/landingConfigurator.component';
import {MatCardModule} from '@angular/material/card';
import { UserCreationComponent } from './userCreation/userCreation.component';
import { UserCreationService } from './userCreation.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    BaseDailogComponent,
    PreviewComponent,
    CharmsListingComponent,
    BaseListingComponent,
    IntroComponent,
    SizeSelectionDailogComponent,
    LandingConfiguratorComponent,
    CategoryListingComponent,
    CarouselListingComponent,
    ProductConfiguratorComponent,
    UserCreationComponent
  ],
  imports: [
    SharedImportsModule,
    SharedModule,
    DragDropModule,
    PipeModule,
    ConfiguratorRoutingModule,
    CarouselModule,
    MatCardModule
  ],
  entryComponents: [
    PreviewComponent,
    IntroComponent,
    SizeSelectionDailogComponent
  ],
  providers: [CategoryListingService, UserCreationService],
  exports: [
    BaseDailogComponent,
    PreviewComponent,
    IntroComponent
  ]
})
export class ConfiguratorModule {}
