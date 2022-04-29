import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Attribute } from 'src/store/products/products.model';

@Component({
  selector: 'app-size-selection',
  templateUrl: './sizeSelectionDailog.component.html',
  styleUrls: ['./sizeSelectionDailog.component.scss']
})
export class SizeSelectionDailogComponent implements OnInit, OnDestroy {
  public selectedAttrValue = null;
  constructor(
    public dialogRef: MatDialogRef<SizeSelectionDailogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { attributes: Attribute }
  ) {
    this.selectedAttrValue = this.data.attributes.attribute_values[0].id;
        const css =
      // tslint:disable-next-line: max-line-length
      '.mat-dialog-container {padding: 24px !important;background: #fcf4f0 !important;border: none !important;}';
    const head = document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.id = 'custom-cdk-overlay-pane';
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    head.appendChild(style); 
  }

  ngOnInit() {}

  submit() {
    this.dialogRef.close({
      selected: true,
      value: {
        id: this.data.attributes.id,
        value: this.selectedAttrValue.toString()
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close({ selected: false, value: undefined });
  }

  ngOnDestroy() {
    const styleEl = document.getElementById('custom-cdk-overlay-pane');
    if (styleEl) {
    styleEl.remove();
    }
  }
}
