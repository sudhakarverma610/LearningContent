import { NgModule } from "@angular/core";
import { SharedImportsModule } from '../sharedImports/sharedImports.module';
import { HomeComponent } from './home.component';
import { BannersComponent } from './Banners/banners.component';
import { FeaturedAndBestSellersComponent } from './FeaturedAndBestSellers/featuredAndBestSellers.component';
import { TestimonialsComponent } from './Testimonials/testimonials.component';
import { CarouselHolderComponent } from './carouselComponent/carousel.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { PipeModule } from 'src/pipes/pipe.module';
import { InViewportModule } from 'ng-in-viewport';
import { NgxJsonLdModule } from '@ngx-lite/json-ld';
import { SharedModule } from '../shared/shared.module';
import { HomeService } from './home.service';
import { HomeResolver } from './home.resolver';
import { HomeRoutingModule } from './homeRouting.module';
import { HomeLookBookComponent } from './homeLookBook/homeLookBook.component';  
import { HomeAboutUsComponent } from './homeAboutUs/homeAboutUs.component';
import { PagesHomeSliderComponent } from './pagesHomeSlider/pagesHomeSlider.component';
import {MatCardModule} from '@angular/material/card';

@NgModule({
  declarations: [
    HomeComponent, 
    BannersComponent,
    FeaturedAndBestSellersComponent,
    TestimonialsComponent,
    CarouselHolderComponent, 
    HomeLookBookComponent,
    HomeAboutUsComponent,
    PagesHomeSliderComponent
        
  ],
  imports: [
    SharedImportsModule,
    HomeRoutingModule,
    CarouselModule,
    PipeModule,
    InViewportModule,
    NgxJsonLdModule,
    SharedModule,
    MatCardModule
  ],
  exports:[PagesHomeSliderComponent],
  providers: [HomeService, HomeResolver]
})
export class HomeModule {}
