import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingConfiguratorComponent } from './landingConfigurator/landingConfigurator.component';

const routes: Routes = [
  {
    path: '',
    component: LandingConfiguratorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguratorRoutingModule {}
