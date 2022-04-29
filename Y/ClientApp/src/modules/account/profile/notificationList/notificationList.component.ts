import { Component, OnInit } from '@angular/core';
import { NotificationsEntity, NotificationService } from 'src/modules/notification/notification.service';
import { NotificationHandlerService } from 'src/modules/notification/notification.handle.service';

@Component({
    selector: 'app-notification-list',
    templateUrl: 'notificationList.component.html',
    styleUrls: ['notificationList.component.scss']
})

export class NotificationListComponent implements OnInit {
    myNotifications: NotificationsEntity[];

    constructor(private notificationStore: NotificationService, private service: NotificationHandlerService) { }

    ngOnInit() {
        this.myNotifications = this.notificationStore.notifications;
        this.service.newNotification.subscribe(res => {
            this.myNotifications = this.notificationStore.notifications;
        });
    }
}