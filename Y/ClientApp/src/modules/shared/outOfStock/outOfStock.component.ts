import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-out-of-stock',
  templateUrl: './outOfStock.component.html',
  styleUrls: ['./outOfStock.component.scss']
})
export class OutOfStockComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<OutOfStockComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { item: {message: string} }
  ) {
    this.data = data;
  }

  ngOnInit() {
    this.dialogRef.updatePosition({ top: '80px', right: '10px' });
    this.dialogRef.addPanelClass('bg-white');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
