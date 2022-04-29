import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/services/auth.gaurd";
import { AddTestimonialsComponent } from './addTestimonials.component'; 
import { TestimonialListComponent } from './testimonialList/testimonialList.component';
import { TestimonialListResolver } from "./testimonialList/testimonialList.resolver";

const routes: Routes = [

  {    
    path: "list",
    component: TestimonialListComponent,
    resolve:{ data: TestimonialListResolver}
  }, 
  {
    path: "add",
    component: AddTestimonialsComponent,
    canActivate:[AuthGuard]
  },
   {
    path: "",
    component: TestimonialListComponent,
    resolve:{ data: TestimonialListResolver}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestimonialsRoutingModule {}
