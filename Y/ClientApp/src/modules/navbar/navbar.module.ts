import { NgModule } from '@angular/core';
import { NavbarComponent } from './navbar.component';
import { SearchComponent } from './search/search.component';
import { AddToCartComponent } from './addedToCart/addedToCart.component';
import { SharedImportsModule } from '../sharedImports/sharedImports.module';
import { NavService } from './navService.service';
import { NavResolver } from './navbar.resolver';
import { MatChipsModule } from '@angular/material/chips';
import { PipeModule } from 'src/pipes/pipe.module';
import { InViewportModule } from 'ng-in-viewport';
import { AddToCuratorComponent } from './addToCurator/addToCurator.component';

@NgModule({
    imports: [
        SharedImportsModule,
        MatChipsModule,
        PipeModule,
        InViewportModule
    ],
    exports: [NavbarComponent, AddToCartComponent,  AddToCuratorComponent],
    declarations: [NavbarComponent, SearchComponent, AddToCartComponent, AddToCuratorComponent],
    providers: [NavService, NavResolver],
    entryComponents: [AddToCartComponent, AddToCuratorComponent]
})
export class NavbarModule { }
