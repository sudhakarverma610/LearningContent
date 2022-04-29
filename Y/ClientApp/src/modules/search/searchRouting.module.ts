import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { SearchListingComponent } from './searchListing/searchListing.component';
import { SearchListingResolver } from './searchListing/searchListing.resolver';

const routes: Routes = [
  {
    path: "",
    component: SearchListingComponent,
    resolve: { result: SearchListingResolver },
    runGuardsAndResolvers: "paramsOrQueryParamsChange"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRoutingModule {}
