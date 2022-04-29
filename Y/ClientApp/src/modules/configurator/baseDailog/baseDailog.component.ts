import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PreviewComponent } from '../preview/preview.component';
import { ConfiguratorService } from '../configurator.service';
import { ConfiguratorPreviewData } from '../modal/configuratorPreviewData.model';
import { ConfiguratorStoreService } from '../configuratorStore.service';
import { Product, Image } from 'src/store/products/products.model';
import { PreviewImageAPIRequest } from '../modal/PreviewImageAPIRequest.model';
import { IntroComponent } from '../intro/intro.component';
import { Router } from '@angular/router';
import { noop } from 'rxjs';

@Component({
  selector: 'app-base-dailog',
  templateUrl: './baseDailog.component.html',
  styleUrls: ['./baseDailog.component.scss']
})
export class BaseDailogComponent implements OnInit, OnDestroy {
  public windowOpen = false;
  public dailogInstance: MatDialogRef<PreviewComponent>;
  public introDailogInstance: MatDialogRef<IntroComponent>;

  constructor(
    public dialog: MatDialog,
    private configuratorService: ConfiguratorService,
    private configuratorStore: ConfiguratorStoreService,
    private router: Router
  ) {}

  ngOnInit() {
    this.configuratorStore.fetchCompareList().subscribe(noop);
    this.configuratorService.OpenPopUp.subscribe(result => {
      this.openIntro(result);
    });
    this.configuratorService.OpenConfigureWindow.subscribe(response => {
      if (response) {
        Promise.all([
          this.configuratorStore.getSelectedBases(),
          this.configuratorStore.getSelectedCharms()
        ]).then((result: [Product[], Product[]]) => {
          if (result[1].length === 0) {
            const data = new ConfiguratorPreviewData();
            data.imageSrc = null;
            data.preSelectedCharms = [];
            data.preSelectedChains = result[0];
            this.openErrorDailog(data);
          } else {
            const input = new PreviewImageAPIRequest();
            input.charmsSkus = result[1].map(item => item.sku);
            input.chainSku =
              result[0].length > 0 && this.configuratorStore.selectedId
                ? (
                    result[0].find(
                      it => it.id === this.configuratorStore.selectedId
                    ) || { sku: '' }
                  ).sku
                : '';
            const data = new ConfiguratorPreviewData();
            data.imageSrc = null;
            data.preSelectedCharms = result[1];
            if (result[0].length > 0) {
              data.preSelectedChains = result[0];
              data.selectedId =
                this.configuratorStore.selectedId || result[0][0].id;
              this.openPreviewDialog(data);
            } else {
              this.configuratorService
                .getProduct('20001SC')
                .subscribe(defaultBase => {
                  data.preSelectedChains = [defaultBase];
                  data.selectedId = defaultBase.id;
                  this.openPreviewDialog(data);
                });
            }
          }
        });
      }
    });
  }

  openIntro(input: Product) {
    this.introDailogInstance = this.dialog.open(IntroComponent, {
      width: '380px',
      data: input
    });
    this.introDailogInstance.afterClosed().subscribe(result => {});
  }

  openPreviewDialog(input: ConfiguratorPreviewData): void {
    if (this.introDailogInstance) {
      this.introDailogInstance.close();
    }

    if (this.windowOpen) {
      this.dailogInstance.componentInstance.charms = input.preSelectedCharms.map(
        item => {
          return { ...item };
        }
      );
      this.dailogInstance.componentInstance.chains = input.preSelectedChains.map(
        item => {
          return { ...item };
        }
      );
      this.dailogInstance.componentInstance.selectedChainId = input.selectedId;
      this.dailogInstance.componentInstance.imageSrc = input.imageSrc;
      return;
    }

    this.dailogInstance = this.dialog.open(PreviewComponent, {
      width: (window.innerWidth > 800 ? 800 : window.innerWidth - 20) + 'px',
      autoFocus: false,
      data: input
    });

    this.windowOpen = true;

    this.dailogInstance.afterClosed().subscribe(result => {
      this.windowOpen = false;
      this.dailogInstance = undefined;
    });
  }

  customSort(a: Image, b: Image) {
    if (a.title === 'ConfigurationImage') {
      return -1;
    }
    if (b.title === 'ConfigurationImage') {
      return 1;
    }
    if (a.title === 'ConfigurationImage2') {
      return -1;
    }
    if (b.title === 'ConfigurationImage2') {
      return 1;
    }
    return -1;
  }

  openErrorDailog(input: ConfiguratorPreviewData): void {
    if (this.windowOpen) {
      return;
    }

    const dialogRef = this.dialog.open(PreviewComponent, {
      width: (window.innerWidth > 800 ? 800 : window.innerWidth - 20) + 'px',
      data: input
    });

    this.windowOpen = true;

    dialogRef.afterClosed().subscribe(result => {
      this.windowOpen = false;
    });
  }

  ngOnDestroy() {}
}
