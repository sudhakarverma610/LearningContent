import { NgModule } from '@angular/core';
import { MobileInputComponent } from './mobileInput.component';
import { SharedImportsModule } from '../sharedImports/sharedImports.module';
import { MobileInputRoutingModule } from './mobileInputRouting.module';

@NgModule({
    imports: [
        SharedImportsModule,
        MobileInputRoutingModule
    ],
    exports: [],
    declarations: [MobileInputComponent],
    providers: [],
})
export class MobileInputModule { }
