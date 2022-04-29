import { NgModule } from '@angular/core';
import { ItemComponent } from './item/item.component';
import { ZoomImageDialog, SingleProductComponent } from './singleProduct/singleProduct.component';
import { SharedModule } from '../shared/shared.module';
import { SharedImportsModule } from '../sharedImports/sharedImports.module';
import { ProductDetailsRoutingModule } from './productDetailsRouting.module';
import { ProductDetailsService } from './productDetails.service';
import { ProductResolver } from './product.resolver';
import { PinchZoomModule } from 'ngx-pinch-zoom';
import { PipeModule } from 'src/pipes/pipe.module';
import { NgxJsonLdModule } from '@ngx-lite/json-ld';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { HomeModule } from '../home/home.module';


@NgModule({
    // tslint:disable-next-line: max-line-length
    imports: [  SharedImportsModule,
                SharedModule,
                PinchZoomModule,
                PipeModule, NgxJsonLdModule,
                MatProgressBarModule,
                ProductDetailsRoutingModule,
                HomeModule
            ],
    exports: [ItemComponent],
    declarations: [ZoomImageDialog, SingleProductComponent, ItemComponent],
    providers: [ProductDetailsService, ProductResolver],
    entryComponents: [ZoomImageDialog]
})
export class ProductDetailsModule { }
