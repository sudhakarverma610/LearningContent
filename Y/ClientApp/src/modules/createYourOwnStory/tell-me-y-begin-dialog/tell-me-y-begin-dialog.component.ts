import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-tell-me-y-begin-dialog',
  templateUrl: './tell-me-y-begin-dialog.component.html',
  styleUrls: ['./tell-me-y-begin-dialog.component.scss']
})
export class TellMeYBeginDialogComponent implements OnInit, OnDestroy {

  constructor(public dialogRef: MatDialogRef<TellMeYBeginDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

            const css =
            '.mat-dialog-container { padding: 0px !important;background:transparent !important;  border-radius: 10px !important;}';
            const head = document.getElementsByTagName('head')[0];
            const style = document.createElement('style');
            style.id = 'custom-cdk-overlay-pane';
            // tslint:disable-next-line: deprecation
            style.type = 'text/css';
            style.appendChild(document.createTextNode(css));
            head.appendChild(style);
 }


  ngOnInit() {
  }
  closeBegin(id) {
    this.dialogRef.close(id);

  }
  ngOnDestroy() {
    const styleEl = document.getElementById('custom-cdk-overlay-pane');
    if (styleEl) {
      styleEl.remove();
    }
  }
}
