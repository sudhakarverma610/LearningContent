import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CreateYourOwnStoryComponent } from "./createYourOwnStory.component";
import { ResultComponent } from "./result/result.component";
import { InviteComponent } from "./invite/invite.component"; 
import { CreateYourStoryResolver } from "./createYourOwnStory.resolver";

const routes: Routes = [
  {
    path: "",
    component: CreateYourOwnStoryComponent,
    resolve:{story:CreateYourStoryResolver},
     children: [ 
      { path: "result", component: ResultComponent },
      { path: "sendInvite", component: InviteComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateYourOwnStoryRoutingModule {}
