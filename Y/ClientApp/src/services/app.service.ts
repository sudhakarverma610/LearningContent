import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Subject, noop } from 'rxjs';
import { UAParser } from 'ua-parser-js';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AppService {
  public loader: Subject<boolean> = new Subject();
  public footerShow: Subject<boolean> = new Subject();

  public loaderMsg = '';
  public isBrowser: boolean;
  public customizationScriptsAdded: boolean;
  public customizationScriptsLoaded = 0;
  public totalCustomizationScripts = 3;
  public resizeCallback;
  public showElementFooter;
  public showElementHome;
  public showULFooter = false;
  public showAll = true;
  public showAllHome = true;
  public showULHome = false;
  public changeInValues: BehaviorSubject<string> = new BehaviorSubject('');
  public changeInHome: BehaviorSubject<string> = new BehaviorSubject('');

  public sliderVersionCompatible = false;
  public sliderVersionCompatibleIE = true;
  public sliderVersionTabletMobile = false;
  public center_svgW = '100%';
  public center_svgH = '100%';
  public center_maskImageW = '100%';
  public center_maskImageH = '100%';
  public center_ImageW = '350%';
  public center_ImageH = '100%';
  public center_ImageX = '-122%';
  public center_ImageY = '0px';

  public right_svgW = '100%';
  public right_svgH = '100%';
  public right_maskImageW = '100%';
  public right_maskImageH = '100%';
  public right_ImageW = '391%';
  public right_ImageH = '100%';
  public right_ImageX = '-144%';
  public right_ImageY = '0';
  public maskHomeCenter = 'https://files.y.jewelry/assets/img/masks/center_home.png';
  public maskHomeRight = 'https://files.y.jewelry/assets/img/masks/right_home.png';
  public hBlockHomeLeft;
  public sliderVersionMobile;
  public sliderVersionTablet;
  public notMobile = false;

  public name;
  public version;
  public baseUrl = "https://y.jewelry"

  constructor(@Inject(PLATFORM_ID) platformId: Object,
    @Inject("BASE_API_URL") baseUrl: string,
    private httpClient: HttpClient
  ) {
    this.baseUrl = baseUrl + "/";
    this.isBrowser = isPlatformBrowser(platformId); // varible to store the state of device where app is being used (server/browser)
    const a = new UAParser();
    this.name = a.getResult().browser.name;
    this.version = a.getResult().browser.version;
  }

  public sendMtcAssociation() {
    this.httpClient.get('/api/updateCustomertoMautic').subscribe(noop);
  }

  public resizeHomePage() {
    if (this.isBrowser) {
      this.hBlockHomeLeft = window.innerHeight;
      if (this.name === 'IE' && window.innerWidth >= 1024) {
        this.sliderVersionCompatible = false;
        this.sliderVersionCompatibleIE = true;
        this.sliderVersionTabletMobile = false;
        this.center_svgW = '100%';
        this.center_svgH = '100%';
        this.center_maskImageW = '100%';
        this.center_maskImageH = '100%';
        this.center_ImageW = '350%';
        this.center_ImageH = '100%';
        this.center_ImageX = '-122%';
        this.center_ImageY = '0px';

        this.right_svgW = '100%';
        this.right_svgH = '100%';
        this.right_maskImageW = '100%';
        this.right_maskImageH = '100%';
        this.right_ImageW = '391%';
        this.right_ImageH = '100%';
        this.right_ImageX = '-144%';
        this.right_ImageY = '0';
        this.maskHomeCenter = 'https://files.y.jewelry/assets/img/masks/center_home.png';
        this.maskHomeRight = 'https://files.y.jewelry/assets/img/masks/right_home.png';
      } else {
        if (window.innerWidth <= 1024) {
          this.sliderVersionCompatible = false;
          this.sliderVersionTabletMobile = true;
          if (window.innerWidth < 768) {
            this.sliderVersionMobile = true;
            this.sliderVersionTablet = false;
            if (window.innerHeight <= 400) {
              this.sliderVersionMobile = false;
              this.sliderVersionTablet = true;
            }
          } else {
            this.sliderVersionMobile = false;
            this.sliderVersionTablet = true;
          }
        } else {
          this.sliderVersionCompatible = true;
          this.sliderVersionTabletMobile = false;
          this.sliderVersionMobile = false;
          this.sliderVersionTablet = false;
        }

        if (window.innerWidth <= 1024 && this.name === 'IE') {
          this.sliderVersionCompatible = false;
          this.sliderVersionTabletMobile = true;
          this.sliderVersionCompatibleIE = false;
        }
      }
      this.changeInHome.next('change');
    }
  }

  resize() {
    if (this.isBrowser) {
      const self = this;
      if (this.resizeCallback) {
        return;
      }
      this.resizeCallback = requestAnimationFrame(function() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        self.resizeHomePage();
        self.resizeCallback = null;
        if (w > 959) {
          self.notMobile = true;
        } else {
          self.notMobile = false;
        }
        if (w > 1024) {
          self.showULFooter = false;
          self.showAll = true;
          self.showAllHome = true;
          self.showULHome = false;
        } else if (w > 768) {
          self.showULFooter = true;
          self.showAll = false;
          self.showAllHome = true;
          self.showULHome = false;
          self.showULFooter = true;
          if (
            self.showElementFooter === undefined ||
            self.showElementFooter == null
          ) {
            self.showElementFooter = 1;
          }
        } else {
          self.showAllHome = false;
          self.showAll = false;
          self.showULFooter = true;
          if (
            self.showElementHome === undefined ||
            self.showElementHome == null
          ) {
            self.showElementHome = 1;
          }
          if (
            self.showElementFooter === undefined ||
            self.showElementFooter == null
          ) {
            self.showElementFooter = 1;
          }
          self.showULHome = true;
        }
        self.changeInValues.next('change');
      });
    }
  }

  screenSizeProperty() {
    if (this.isBrowser) {
      const self = this;
      setTimeout(function() {
        window.onresize = self.resize.bind(self);
        self.resize();
      }, 500);
    }
  }
}
