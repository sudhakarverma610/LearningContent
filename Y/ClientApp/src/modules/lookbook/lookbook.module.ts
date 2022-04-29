import { NgModule } from '@angular/core';
import { LookbookComponent } from './lookbook.component';
import { IbizaLookbookComponent } from './ibiza/ibiza.component';
import { LookbookService } from './lookbook.service';
import { IbizaResolver } from './ibiza/ibiza.resolver';
import { ParisResolver } from './paris/paris.resolver';
import { ParisComponent } from './paris/paris.component';
import { SharedImportsModule } from '../sharedImports/sharedImports.module';
import { LookbookRoutingModule } from './lookbookRouting.module';
import { PipeModule } from 'src/pipes/pipe.module';
import { InViewportModule } from 'ng-in-viewport';
import { ProductListComponent } from './ibiza/productList/productList.component';
import { DeferLoadModule } from '@trademe/ng-defer-load';
import { LookbookladningComponent } from './lookbookladning/lookbookladning.component';
import { TestlookbookComponent } from './testlookbook/testlookbook.component';


@NgModule({
    imports: [SharedImportsModule, LookbookRoutingModule, InViewportModule, PipeModule, DeferLoadModule],
    exports: [],
    declarations: [TestlookbookComponent,LookbookComponent,LookbookladningComponent, IbizaLookbookComponent, ParisComponent, ProductListComponent],
    providers: [LookbookService, IbizaResolver, ParisResolver],
})
export class LookbookModule { }
