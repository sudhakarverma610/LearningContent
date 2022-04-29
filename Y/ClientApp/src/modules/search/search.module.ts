import { NgModule } from '@angular/core';
import { SearchListingComponent } from './searchListing/searchListing.component';
import { SearchListingResolver } from './searchListing/searchListing.resolver';
import { SharedImportsModule } from '../sharedImports/sharedImports.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxJsonLdModule } from '@ngx-lite/json-ld';
import { MatChipsModule } from '@angular/material/chips';
import { SharedModule } from '../shared/shared.module';
import { SearchRoutingModule } from './searchRouting.module';
import { SearchService } from './search.service';


@NgModule({
    imports: [
        SharedImportsModule, 
        InfiniteScrollModule,
        NgxJsonLdModule,
        MatChipsModule, 
        SharedModule,
        SearchRoutingModule
    ],
    exports: [],
    declarations: [SearchListingComponent],
    providers: [SearchListingResolver, SearchService],
})
export class SearchModule { }
