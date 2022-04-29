import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LookbookComponent } from './lookbook.component';
import { IbizaLookbookComponent } from './ibiza/ibiza.component';
import { ParisResolver } from './paris/paris.resolver';
import { IbizaResolver } from './ibiza/ibiza.resolver';
import { ParisComponent } from './paris/paris.component';
import { LookbookladningComponent } from './lookbookladning/lookbookladning.component';
import { TestlookbookComponent } from './testlookbook/testlookbook.component';

const routes: Routes = [
  {
    path: '',
    component: LookbookComponent,
    children: [
        {
          path: '',
          component: LookbookladningComponent

        },
        {
          path: 'paris',
          component: ParisComponent,
          resolve: { data: ParisResolver }
        },
        {
          path: 'ibiza',
          component: IbizaLookbookComponent,
          resolve: { products: IbizaResolver }
        }
      ,
      {
        path: 'test',
        component: TestlookbookComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LookbookRoutingModule {}
