import { NgModule } from '@angular/core';

import { VerifyCustomerComponent } from './verifyCustomer/verifyCustomer.component';
import { SharedImportsModule } from '../sharedImports/sharedImports.module';

@NgModule({
    imports: [SharedImportsModule],
    exports: [VerifyCustomerComponent],
    declarations: [VerifyCustomerComponent],
    providers: [],
    entryComponents: [VerifyCustomerComponent]
})
export class CustomerVerificationModule { }
