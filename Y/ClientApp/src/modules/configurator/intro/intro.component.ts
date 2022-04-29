import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Product } from 'src/store/products/products.model';
import { ConfiguratorService } from '../configurator.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<IntroComponent>,
    private configuratorService: ConfiguratorService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: Product
  ) {
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
   // this.configuratorService.OpenConfigureWindow.next(true);
    this.onNoClick();
    this.router.navigateByUrl('/your-set');
  }
}
