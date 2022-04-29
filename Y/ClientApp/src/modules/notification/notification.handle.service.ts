import { Injectable } from '@angular/core';
import { NotificationService, NotificationsEntity } from './notification.service';
import { Subject } from 'rxjs/Subject';
import {  BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MatDialog } from '@angular/material/dialog';
import { NotificationComponent } from './notification.component';
import { SwPush } from '@angular/service-worker';
import { AppService } from 'src/services/app.service';
import { SharedService } from '../shared/shared.service';

@Injectable({
    providedIn: 'root'
})
export class NotificationHandlerService {
    panelOpen = false;

    openPopUp: Subject<boolean> = new Subject();

    newNotification: Subject<NotificationsEntity> = new Subject();
    public newNotificationView: BehaviorSubject<number> = new BehaviorSubject(0);

    getNotificationData = false;
    getNotificationDataLoading = false;

    constructor(
        private notificationStore: NotificationService,
        public dialog: MatDialog, 
        private appService: AppService,
        private swPush: SwPush,
        private sharedService:SharedService
    ) {
        if (this.appService.isBrowser) {
            this.setUpOneSignal();
            if (!this.getNotificationData && !this.getNotificationDataLoading) {
                this.getNotificationDataLoading = true;
                this.notificationStore.getNotifications(false, 1).then((result: any) => {
                    this.notificationStore.notifications = result.notifications || [];
                    this.notificationStore.totalNotifications = result.total || 0;
                    this.getNotificationData = true;
                });
            }
            this.sharedService
                .getCookieAcceptanceStatus()
                .subscribe((value: { status: boolean }) => {
                    if (!value.status) {
                        //this.showPopUpBool = true;
                        //call here open api 
                        let cookiedata:NotificationsEntity=
                            {
                            id:'cookie-1223',
                            notification_id:'cookie-1223',
                            heading:'🍪 Everybody loves Cookies! 🍪',
                            content:'Cookies help us deliver our services. By using our services, you agree to our use of cookies policy.',
                            url:'/info/privacy',
                            icon:null,
                            data:'cookies',
                            read:false,
                            created_at:new Date(),
                            CustomerId:0
                        };                
                    let arrCokkies=[];
                    arrCokkies.push(cookiedata);   
                        const dialogCokkiesRef = this.dialog.open(NotificationComponent, {
                            width: "280px",
                            data: arrCokkies
                        });
                        this.panelOpen = true;        
                        dialogCokkiesRef.afterClosed().subscribe(result2 => {
                            this.panelOpen = false;
                        });            
                    }
                });
            this.openPopUp.subscribe(value => {
                if (!this.panelOpen) {
                    const dialogRef = this.dialog.open(NotificationComponent, {
                        width: "280px",
                        data:this.notificationStore.notifications
                    });
                    this.panelOpen = true;
        
                    dialogRef.afterClosed().subscribe(result2 => {
                        this.panelOpen = false;
                     });
                }
            });
    
            this.newNotification.subscribe((value: NotificationsEntity) => {
                if(!this.notificationStore.notifications.some(a => a.notification_id === value.notification_id)) {
                    this.notificationStore.notifications.unshift(value);
                    this.newNotificationView.next(this.newNotificationView.value + 1);
                    this.openPopUp.next(true);
                    this.notificationStore.insertNotification(value).then(result => {
                        if (!result.success) {
                            console.log(result.message);
                        }
                    }).catch(err => {});
                }
            });
        }
    }

    setUpOneSignal() {
        const OneSignal = window["OneSignal"];
        const self = this;
        if(!OneSignal) {
            setTimeout(() => {
                this.setUpOneSignal();
            }, 500);
            return;
        }
        OneSignal.push(() => {
            try {
                OneSignal.on("notificationDisplay", function(event) {
                    const data = new NotificationsEntity();
                    data.notification_id = event.id;
                    data.heading = event.heading;
                    data.content = event.content;
                    data.data = event.data;
                    data.url = event.url;
                    data.icon = event.icon;
                    self.newNotification.next(data);
                });
            } catch(err) {
                setTimeout(() => {
                    self.setUpOneSignal();
                }, 500)
            }
        });

        window.document.addEventListener("focus_item", (e: any) => {
            console.log(e);
            self.newNotification.next(e.detail);
        }, false);
    }
    
}