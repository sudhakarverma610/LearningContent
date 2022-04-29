import { NgModule } from '@angular/core';
import { RecoverPasswordComponent } from './recoverPassword/recoverPassword.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './login/forgotPassword/forgotPassword.component';
import { RecoverPasswordResolver } from './recoverPassword/recoverPassword.resolver';
import { AuthComponent } from './auth.component';
import { SharedImportsModule } from '../sharedImports/sharedImports.module';
import { AuthRoutingModule } from './authRouting.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
    imports: [SharedImportsModule, AuthRoutingModule, SharedModule],
    exports: [LoginComponent],
    declarations: [AuthComponent, RecoverPasswordComponent, LoginComponent, ForgotPasswordComponent],
    providers: [RecoverPasswordResolver],
    entryComponents: [ForgotPasswordComponent]
})
export class AuthModule { }
