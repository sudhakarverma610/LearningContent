import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  NotificationService,
  NotificationsEntity
} from './notification.service'; 
import { AuthService } from 'src/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {

  showAll = false;
  list: NotificationsEntity[] = [];
   constructor(
    public dialogRef: MatDialogRef<NotificationComponent>,
    private notificationService: NotificationService,
    private customerStore: AuthService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA)  public data:NotificationsEntity[] 
  ) {
    this.list = this.data;
  }

  ngOnInit() {
    this.list = this.data;
    this.notificationService.notificationState.next(true);
    const css =
    '.mat-dialog-container { padding: 10px !important;background:white !important;  border-radius: 10px;border: 1px solid #BFD1E8;} ';
  const head = document.getElementsByTagName('head')[0];
  const style = document.createElement('style');
  style.id = 'custom-cdk-overlay-pane';
  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));
  head.appendChild(style);
  this.dialogRef.updatePosition({ bottom: '69px', right: '13px' });
  this.dialogRef.addPanelClass('bg-white');
  }

  ngOnDestroy() {
    this.notificationService.notificationState.next(false);
  }

  onNoClick(): void {
    this.dialogRef.close({ success: false });
  }

  success() {
    this.dialogRef.close({ success: true });
  }

  showAllNotification() {
    if (this.customerStore.loginStatusSubject.value) {
      this.router.navigate(['account', 'mynotifications']);
    } else {
      this.showAll = true;
    }
  }
}
