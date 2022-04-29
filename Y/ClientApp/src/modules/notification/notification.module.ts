import { NgModule } from '@angular/core';
import { NotificationComponent } from './notification.component';
import { NotinficationItemComponent } from './item/item.noti.component';
import { SharedImportsModule } from '../sharedImports/sharedImports.module'; 
@NgModule({
    imports: [SharedImportsModule],
    exports: [NotificationComponent],
    declarations: [NotificationComponent, NotinficationItemComponent],
    providers: [],
    entryComponents: [NotificationComponent]
})
export class NotificationModule { }
