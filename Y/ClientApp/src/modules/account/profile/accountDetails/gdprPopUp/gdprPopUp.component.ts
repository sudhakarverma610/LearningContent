import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/services/auth.service';
@Component({
  selector: 'app-gdprPopUp',
  templateUrl: './gdprPopUp.component.html',
  styleUrls: ['./gdprPopUp.component.scss']
})
export class GdprPopUpComponent implements OnDestroy, OnInit {
  public selectedAction = 0;

  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<GdprPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    const css =
      // tslint:disable-next-line: max-line-length
      '.mat-dialog-container {padding: 24px !important;background: #fcf4f0 !important;border: none !important;} @media (max-width: 669px) { .cdk-global-overlay-wrapper { bottom: 10px !important; top: unset; align-items: flex-end !important; } .mat-dialog-content{ max-height: calc(65vh - 20px) !important; } .mat-dialog-container { max-height: calc(100vh - 90px) !important;} }';
    const head = document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.id = 'custom-cdk-overlay-pane';
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    head.appendChild(style);
  }

  onNoClick(): void {
    this.dialogRef.close({ success: false });
  }

  result() {
    if (this.selectedAction) {
      this.dialogRef.close({ success: true, action: this.selectedAction });
    }
  }

  ngOnInit() {}

  ngOnDestroy() {
    const styleEl = document.getElementById('custom-cdk-overlay-pane');
    if (styleEl) {
    styleEl.remove();
    }
  }
}
