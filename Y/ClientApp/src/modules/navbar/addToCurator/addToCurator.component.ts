import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { Product } from 'src/store/products/products.model';

@Component({
  selector: 'app-addToCurator',
  templateUrl: './addToCurator.component.html',
  styleUrls: ['./addToCurator.component.scss']
})
export class AddToCuratorComponent implements OnInit, OnDestroy {
  constructor(
    public dialogRef: MatDialogRef<AddToCuratorComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: Product
  ) {const css =
    '.mat-dialog-container { padding: 24px !important;}';
     const head = document.getElementsByTagName('head')[0];
     const style = document.createElement('style');
     style.id = 'custom-cdk-overlay-pane';
     style.type = 'text/css';
     style.appendChild(document.createTextNode(css));
     head.appendChild(style);
     this.data = this.setItemImage(this.data);
  }
  setItemImage(input: Product) {
    const item = { ...input };
    item.images = input.images;
    return item;
  }
  ngOnInit() {
    this.dialogRef.updatePosition({ top: '80px', left: '20px' });
    this.dialogRef.addPanelClass('bg-white');
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  openCurator() {
    this.onNoClick();
    this.router.navigateByUrl('/your-set');
  }
  ngOnDestroy() {
    const styleEl = document.getElementById('custom-cdk-overlay-pane');
    if (styleEl) {
      styleEl.remove();
    }
  }
}
