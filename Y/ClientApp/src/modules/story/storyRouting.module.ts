import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { StoryComponent } from './story.component';
import { StoryResolver } from './story.resolver';

const routes: Routes = [
  {
    path: ":id",
    component: StoryComponent,
    resolve: { result: StoryResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoryRoutingModule {}
