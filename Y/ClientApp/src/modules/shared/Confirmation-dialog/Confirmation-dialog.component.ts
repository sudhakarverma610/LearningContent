import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-Confirmation-dialog',
  templateUrl: './Confirmation-dialog.component.html',
  styleUrls: ['./Confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {
  public title = 'Please confirm...';
  public content = 'Do you really want to';
  public okaytext = 'ok';
  public cancelText = 'Cancel';
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
   const css =
      '.mat-dialog-container { padding: 0px !important;background:white !important } ';
   const head = document.getElementsByTagName('head')[0];
   const style = document.createElement('style');
   style.id = 'custom-cdk-overlay-pane';
   style.type = 'text/css';
   style.appendChild(document.createTextNode(css));
   head.appendChild(style);
   this.data = data;
   if (this.data.title) {
      this.title = this.data.title;
    }
   if (this.data.content) {
      this.content = this.data.content;
    }
   if (this.data.okText) {
      this.okaytext = this.data.okText;
    }
   if (this.data.cancelText) {
      this.cancelText = this.data.cancelText;
    }

   }

  ngOnInit() {
  }
  // CloseClick(){
  //   console.log('Close Click')
  // }
  // OkClick(){
  //   console.log('Ok click')
  // }
  closeBegin(status: boolean) {
    this.dialogRef.close(status);

  }
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    const styleEl = document.getElementById('custom-cdk-overlay-pane');
    if (styleEl) {
      styleEl.remove();
    }
  }
}
