import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Product } from 'src/store/products/products.model';
import { ActivatedRoute } from '@angular/router';
import { LookbookService } from '../lookbook.service';
import { InViewportMetadata } from 'ng-in-viewport';
import { AppService } from 'src/services/app.service';

const ibizaProducts = [
  { index: 1, skus: ['20001SC', '10086', '10031', '10066'] },
  {
    index: 3,
    skus: [
      '20001SC',
      '10066',
      '10227S',
      '10131',
      '20014BROWNG',
      '10109',
      '10048',
      '10011'
    ]
  },
  { index: 2, skus: ['20020GREENG', '10065', '20018BLUEG', '10105R'] },
  {
    index: 4,
    skus: [
      '20002BC',
      '10032',
      '20003TBB',
      '10037',
      '10105',
      '10043',
      '10045',
      '10091',
      '10048',
      '10060'
    ]
  },
  { index: 5, skus: ['10229S', '20013BLUEG'] },
  { index: 6, skus: ['20013BLUEG', '10178S', '10170S', '10210S', '10186S'] },
  {
    index: 7,
    skus: ['20015GREENG', '10018', '10119', '10029G', '20007SC', '10037G']
  },
  { index: 8, skus: ['20017BLACKG', '10132 S', '10105R'] },
  {
    index: 9,
    skus: [
      '20001SC',
      '10080',
      '10101',
      '10080',
      '10077',
      '20017BLACKG',
      '10223S',
      '20015GREENG',
      '10206S'
    ]
  },
  {
    index: 10,
    skus: ['20008SC', '10177S', '10212R', '10187S', '10170S']
  },
  { index: 11, skus: ['30003ERHSG', '10115', '10115'] },
  {
    index: 12,
    skus: [
      '20005NC45',
      '10061',
      '10027',
      '10028',
      '10053',
      '10081',
      '10063',
      '10061'
    ]
  },
  {
    index: 13,
    skus: ['20001SC', '10060', '10109', '10048', '10011', '10068']
  },
  {
    index: 14,
    skus: ['20004TBW', '10106', '10059', '10106']
  },
  { index: 15, skus: ['20011NC', '10220R'] },
  {
    index: 16,
    skus: [
      '20001SC',
      '10070',
      '10206S',
      '10110',
      '10034',
      '20003TBB',
      '10106',
      '10011',
      '10106'
    ]
  },
  {
    index: 17,
    skus: [
      '20001SC',
      '10035',
      '10035',
      '10012',
      '10104',
      '10087',
      '10063',
      '10017'
    ]
  },
  { index: 18, skus: ['20001SC', '10226S', '10228S', '10227S'] },
  {
    index: 19,
    skus: ['20010NC', '10201G']
  },
  {
    index: 20,
    skus: ['20001SC', '10106', '10140', '10074', '10083', '10106']
  },
  { index: 21, skus: ['20005NC45', '10080', '10075', '10080'] },
  {
    index: 22,
    skus: ['20007SC', '10127', '10206G', '10020G', '10101G', '10127']
  },
  { index: 23, skus: ['20005NC45', '10223S'] },
  { index: 24, skus: ['10125', '10105G', '20007SC'] },
  { index: 25, skus: ['20001SC', '10096', '10228S', '10220S'] },
  {
    index: 26,
    skus: [
      '20001SC',
      '10035',
      '10075',
      '10100S',
      '10205S',
      '10071',
      '10039',
      '10125'
    ]
  },
  {
    index: 27,
    skus: ['30003ERHSG', '10029G', '10017', '10029G']
  },
  {
    index: 28,
    skus: [
      '10059',
      '10020',
      '10086',
      '10053',
      '10067',
      '10078',
      '20008SC',
      '20001SC'
    ]
  },
  { index: 29, skus: ['10014', '10044', '20013BLUEG', '20005NC45'] },
  { index: 30, skus: ['20008SC', '10016', '10058', '10044'] },
  { index: 31, skus: [
    '20001SC'] },
  {
    index: 32,
    skus: [
      '20001SC',
      '10011',
      '10032',
      '10067',
      '10074',
      '10017',
      '20008SC',
      '10124'
    ]
  }
];

@Component({
  selector: 'app-ibiza',
  templateUrl: './ibiza.component.html',
  styleUrls: ['./ibiza.component.scss']
})
export class IbizaLookbookComponent implements OnInit, AfterViewInit {
  public products: Product[] = [];
  public imageData: Product[][] = [];
  public openHover = 0;
  public hoverDot = 'https://files.y.jewelry/assets/img/lookbook/spinner.svg';
  public hoverDot1 =
    'https://files.y.jewelry/assets/img/lookbook/dot-product-rollover.svg';
  public spinner = 'https://files.y.jewelry/assets/img/lookbook/spinner.svg';
  public videoDefferArr = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
  constructor(
    private route: ActivatedRoute,
    private service: LookbookService,
    public appService: AppService
  ) {}

  ngOnInit() {
    this.products = this.route.snapshot.data.products.products;
    this.hoverDot = this.spinner;
    Promise.all([
      this.service.fetchProductsForCategory(73, 2),
      this.service.fetchProductsForCategory(73, 3),
      this.service.fetchProductsForCategory(73, 4),
      this.service.fetchProductsForCategory(73, 5),
      this.service.fetchProductsForCategory(73, 6),
      this.service.fetchProductsForCategory(73, 7),
      this.service.fetchProductsForCategory(73, 8),
      this.service.fetchProductsForCategory(73, 9),
      this.service.fetchProductsForCategory(73, 10),
      this.service.fetchProductsForCategory(73, 11)
    ]).then(res => {
      this.products = [
        ...this.products,
        ...res.reduce((a, b) => [...a, ...b.products], [])
      ];
      ibizaProducts.forEach(it => {
        this.imageData[it.index] = this.products.filter(a =>
          it.skus.some(b => b === a.sku)
        );
      });
      this.hoverDot = this.hoverDot1;
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
    try {
      const {
        [InViewportMetadata]: { entry },
        target
      } = $event;
      const ratio = entry.intersectionRatio;
      const vid = target;
      ratio >= 0.65 ? vid.play() : vid.pause();
     } catch (err) {
      console.log();
    }
  }

  ngAfterViewInit() {}
}
