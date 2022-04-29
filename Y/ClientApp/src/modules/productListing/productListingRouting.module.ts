import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListingComponent } from './listing/listing.component';
import { ProductListingResolver } from './listing/productListing.resolver';

const routes: Routes = [
  {
    path: ':parent/:category',
    component: ListingComponent,
    resolve: { data: ProductListingResolver }
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductListingRoutingModule {}
