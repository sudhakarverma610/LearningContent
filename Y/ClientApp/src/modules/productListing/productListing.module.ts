import { NgModule } from '@angular/core';
import { ProductListingService } from './productListing.service';
import { ListingComponent } from './listing/listing.component';
import { FilterComponent } from './filters/filter.component';
import { ProductListingResolver } from './listing/productListing.resolver';
import { SharedImportsModule } from '../sharedImports/sharedImports.module';
import { ProductListingRoutingModule } from './productListingRouting.module';
import { SharedModule } from '../shared/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxJsonLdModule } from '@ngx-lite/json-ld';
import {  MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { PipeModule } from 'src/pipes/pipe.module';
import { Ng5SliderModule } from 'ng5-slider';
import { MMxYComponent } from './mmxy/mmxy.component';
import { InViewportModule } from 'ng-in-viewport';
import { SortingComponent } from './sorting/sorting.component';


@NgModule({
    imports: [
        SharedImportsModule,
        InfiniteScrollModule,
        NgxJsonLdModule,
        MatChipsModule,
        MatCheckboxModule,
       ProductListingRoutingModule,
        SharedModule,
        PipeModule,
        InViewportModule,
        Ng5SliderModule
    ],
    exports: [ListingComponent],
    declarations: [ListingComponent, FilterComponent, SortingComponent, MMxYComponent],
    providers: [ProductListingResolver, ProductListingService],
})
export class ProductListingModule { }
