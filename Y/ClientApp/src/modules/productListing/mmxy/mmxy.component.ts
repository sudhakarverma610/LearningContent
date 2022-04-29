import { Component, OnInit, Input } from '@angular/core';
import { Product, ProductDTO } from 'src/store/products/products.model';
import { InViewportMetadata } from 'ng-in-viewport';
import { AppService } from 'src/services/app.service';
import { ProductListingService } from '../productListing.service';

@Component({
    selector: 'app-mmxy',
    templateUrl: 'mmxy.component.html',
    styleUrls: ['./mmxy.component.scss']
})

export class MMxYComponent implements OnInit {

    products: Product[][] = [];

    skus = [
      ['10273G', '10243G', '10275G', '10274G', '10280G', '10278G', '10284G', '20007SC',
      '10277S',
      '20024BWS',
      '10243S',
      '10279S',
      '10280R'
    ],
      ['10275G', '10277G', '20026LBG',
      '10278S',
      '20022NCR'],
      [ '10279S', '10277S', '10274S', '20005NC45']
    ];

    openHover = 0;
    public hoverDot =
      'https://files.y.jewelry/assets/img/lookbook/dot-product-rollover.svg';

    constructor(public appService: AppService, private service: ProductListingService) { }

    ngOnInit() {
      this.service.getFeaturedProduct(75)
        .subscribe((arg: ProductDTO) => {
          this.products = this.skus.map(it => {
            return it.map(a => arg.products.find(b => b.sku === a)).filter(c => !!c);
          });
        });
    }


    ClickOutside(input: number) {
      if (this.openHover === input) {
        this.openHover = 0;
      }
    }

    public changeVideoAudio(id: string) {
      const vid: any = document.getElementById(id);
      vid.muted = !vid.muted;
    }

    onIntersection($event) {
      const {
        [InViewportMetadata]: { entry },
        target
      } = $event;
      const ratio = entry.intersectionRatio;
      const vid = target;

      ratio >= 0.65 ? vid.play() : vid.pause();
    }
}
