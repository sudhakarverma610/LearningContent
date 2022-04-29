import { NgModule } from '@angular/core';
import {
  CommonModule,
  LocationStrategy,
  PathLocationStrategy
} from '@angular/common';
import { ProductComponent } from './product.component';
import { ProductService } from './product.service';
import { SharedModule } from '../shared/shared.module';
import { SeNameResolver } from './seName.resolver';
import { ProductRoutingModule } from './productRouting.module';
import { NewInGuard } from './product.gaurd';
// import { ProductListingModule } from '../productListing/productListing.module';
// import { ProductDetailsModule } from '../productDetails/productDetails.module';
// import { ProductListingService } from '../productListing/productListing.service';
// import { ProductDetailsService } from '../productDetails/productDetails.service';

@NgModule({
  declarations: [
    ProductComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    SharedModule,
    // ProductListingModule,
    // ProductDetailsModule
  ],
  providers: [
    ProductService,
    SeNameResolver,
    NewInGuard,
    // ProductListingService,
    // ProductDetailsService,
    { provide: LocationStrategy, useClass: PathLocationStrategy }
  ]
})
export class ProductModule {}
