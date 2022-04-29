import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MobileInputComponent } from './mobileInput.component';

const routes: Routes = [
  {
    path: "",
    component: MobileInputComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MobileInputRoutingModule {}
