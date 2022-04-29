import { NgModule } from '@angular/core';
import { FooterComponent } from './footer.component';
import { FooterService } from './footer.service';
import { SharedImportsModule } from '../sharedImports/sharedImports.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [SharedImportsModule],
    exports: [FooterComponent],
    declarations: [FooterComponent],
    providers: [FooterService]
})
export class FooterModule { }
