import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product.component';
import { SeNameResolver } from './seName.resolver';
import { NewInGuard } from './product.gaurd';

const routes: Routes = [
  {
    path: ':category/:sename',
    component: ProductComponent,
    resolve: { data: SeNameResolver }
  },
  {
    path: ':sename',
    component: ProductComponent,
    resolve: { data: SeNameResolver },
    canActivate: [NewInGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule {}
