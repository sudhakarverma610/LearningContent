import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-share-pop-up',
  templateUrl: './sharePopUp.component.html',
  styleUrls: ['./sharePopUp.component.scss']
})
export class SharePopUpComponent implements OnDestroy, OnInit {
  constructor(
    public dialogRef: MatDialogRef<SharePopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { url: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {}

  ngOnDestroy() {}
}
