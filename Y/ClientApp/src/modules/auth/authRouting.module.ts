import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecoverPasswordResolver } from './recoverPassword/recoverPassword.resolver';
import { RecoverPasswordComponent } from './recoverPassword/recoverPassword.component';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth.component';

const routes: Routes = [
    {
      path: '',
      component: AuthComponent,
      children: [
        {
          path: 'signup',
          component: LoginComponent
        },
        {
          path: 'login',
          component: LoginComponent
        },
        {
          path: 'Cutomer/Login',
          component: LoginComponent
        },
        {
          path: 'otpInput',
          component: LoginComponent
        },
        {
          path: 'passwordrecovery/confirm',
          component: RecoverPasswordComponent,
          resolve: { recovery: RecoverPasswordResolver }
        },
        { path: '', redirectTo: 'login', pathMatch: 'full' }
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
