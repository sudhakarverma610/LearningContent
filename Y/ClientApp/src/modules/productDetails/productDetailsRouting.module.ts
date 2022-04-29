import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemComponent } from './item/item.component';
import { ProductResolver } from './product.resolver';

const routes: Routes = [
  {
    path: ':category/:product',
    component: ItemComponent,
    resolve: { data: ProductResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductDetailsRoutingModule {}
