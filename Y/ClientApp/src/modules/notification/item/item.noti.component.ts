import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { NotificationsEntity, NotificationService } from '../notification.service';
import { noop } from 'rxjs';
import { SharedService } from 'src/modules/shared/shared.service';

@Component({
    selector: 'app-item-noti',
    templateUrl: 'item.noti.component.html',
    styleUrls: ["./item.noti.component.scss"]
})

export class NotinficationItemComponent implements OnInit {
    @Output()
    public Close: EventEmitter<boolean> = new EventEmitter();

    @Output()
    public SuccessEvent: EventEmitter<boolean> = new EventEmitter();

    @Input()
    public data: NotificationsEntity;

    constructor(private service: NotificationService,
        private sharedService:SharedService) {}

    ngOnInit() { }

    onNoClick(): void {
        if (this.data.id&&!(this.data.data==='cookies')) {
            this.service.readNotification(this.data)
                .then(noop);
        }    
              
        this.Close.emit();
    }
  
    success() {    
        this.Close.emit();
    }
    acceptCokkies(){        
    this.sharedService.AcceptCookieAcceptance().subscribe(noop);
     }
}