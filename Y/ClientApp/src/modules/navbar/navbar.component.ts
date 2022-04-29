import { Component, OnInit, Optional, Inject, OnDestroy } from '@angular/core';
import {
  Router,
  ActivatedRoute,
  NavigationEnd,
  RouterEvent
} from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NavSubCategories } from 'src/store/categoriesStore.service';
import { CategoryModel } from 'src/store/categories/categories.model';
import { Subject, noop } from 'rxjs';
import { AppService } from 'src/services/app.service';
import { MetaService } from '../../services/meta.service';
import { CartStoreService } from 'src/store/cartStore.service';
import { StoreService } from 'src/store/store.service';
import { ConfiguratorService } from '../configurator/configurator.service';
import { ConfiguratorStoreService } from '../configurator/configuratorStore.service';
import { takeUntil } from 'rxjs/operators';
import { NavService } from './navService.service';
import { InViewportMetadata } from 'ng-in-viewport';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
    trigger('enterMobileAnimation', [
      state(
        'false',
        style({
          transform: 'translateX(-100%)',
          opacity: 0
        })
      ),
      state(
        'true',
        style({
          transform: 'translateX(0px,20px)',
          opacity: 1
        })
      ),
      transition('false => true', [animate('500ms')]),
      transition('true => false', [animate('500ms')])
    ]),
    trigger('enterAnimation', [
      state(
        'false',
        style({
          transform: 'translateY(-100%)',
          opacity: 0
        })
      ),
      state(
        'true',
        style({
          transform: 'translateY(0)',
          opacity: 1
        })
      ),
      transition('false => true', [animate('500ms')]),
      transition('true => false', [animate('500ms')])
    ]),
    trigger('enterSearchAnimation', [
      state(
        'false',
        style({
          transform: 'translateY(-100%)',
          opacity: 0
        })
      ),
      state(
        'true',
        style({
          transform: 'translateY(0)',
          opacity: 1
        })
      ),
      transition('false => true', [animate('500ms')]),
      transition('true => false', [animate('500ms')])
    ])
  ]
})
export class NavbarComponent implements OnInit, OnDestroy {
  public panelCat: NavSubCategories = {
    chains: [],
    charms: [],
    sets: []
  };

  public cartItems = 0;
  public configuratorItems = 0;
  public currentState = 'false';
  public currentState2 = 'false';
  public currentState3 = 'false';
  public currentUrl: string;
  public loginStatus = false;
  public isOpenAccount = false;

  public isOpenPanier = false;
  public isOpen = false;
  public isOpenSearch = false;

  public openDropPanel = false;
  public dropPanelCat: CategoryModel[] = [];
  public dropPanelCatIndex = 0;

  public unsubscribeSubject = new Subject();

  public summerSale = false;

  public _panelActive = false;

  public masoomView = false;
  public masoomText = '';
  public set panelActive(input) {
    this._panelActive = input;
    this.currentState = input + '';
  }

  public get panelActive() {
    return this._panelActive;
  }
  public panelStep = 0;
  public panelInit = false;

  public _mobilePanelActive = false;
  public mobilePanelStep = 0;

  public set mobilePanelActive(input) {
    this._mobilePanelActive = input;
    this.currentState2 = input + '';
  }

  public get mobilePanelActive() {
    return this._mobilePanelActive;
  }

  public _searchOn = false;

  public set searchOn(input) {
    this._searchOn = input;
    this.currentState3 = input + '';
  }

  public get searchOn() {
    return this._searchOn;
  }
  public panelActivation: any;

  constructor(
    private router: Router,
    private appService: AppService,
    private metaService: MetaService,
    private cartStore: CartStoreService,
    private searchService: NavService,
    private store: StoreService,
    private route: ActivatedRoute, 
    private configuratorStore: ConfiguratorStoreService
  ) {
    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event); // for closing navPanel on route changes
      if (event instanceof NavigationEnd) {
        this.searchOn = false;
        this.deActivatePanel();
      }
    });
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
  ngOnInit() {
    this.store.showMasoom
      .pipe(takeUntil(this.unsubscribeSubject))
      .subscribe((value: { masoomView: boolean; masoomText: string }) => {
        this.masoomView = value.masoomView;
        this.masoomText = value.masoomText;
      });
    this.searchService.getProductTags().subscribe(noop);
    this.metaService.createLinkForCanonicalURL();
    this.panelCat = this.route.snapshot.data.categories.homeSubCategories;
    this.syncNavCart();
    this.syncRouteParameters(); // for login/SignUp setup
    this.store.closeNavDropPanel.subscribe(event => {
      if (event) {
        this.closeNav();
      }
    });
    this.configuratorStore.fetchCompareList().subscribe(noop);
    this.configuratorStore.itemCountChanged.subscribe(item => {
      this.configuratorItems = item;
    });
    this.summerSale = this.store.getDiscountStatus('summer-sale');
    this.store.discountUpdated.subscribe(value => {
      this.summerSale = this.store.getDiscountStatus('summer-sale');
    });

  }
  ClickSearchIcon() {
    window.scrollTo(0, 0);
    this.searchOn =  !this.searchOn;
    this.mobilePanelActive = false;
    this.scrollTop();
  }
  activatePanel(step: number) {
    const self = this;
    if (this.panelActivation) {
      clearTimeout(this.panelActivation);
      this.panelActivation = setTimeout(() => {
        self.panelStep = step;
        self.panelActive = true;
        self.panelInit = true;
        self.panelActivation = null;
      }, 500);
    } else {
      this.panelActivation = setTimeout(() => {
        self.panelStep = step;
        self.panelActive = true;
        self.panelInit = true;
        self.panelActivation = null;
      }, 500);
    }
  }

  cancelPanel() {
    clearTimeout(this.panelActivation);
    this.panelActivation = null;
  }

  deActivatePanel() {
    if (!this.panelInit) {
      this.panelActive = false;
    } else {
      this.panelInit = false;
    }
  }

  syncNavCart() {
    this.cartStore.cartQuanityUpdated
      .pipe(takeUntil(this.unsubscribeSubject))
      .subscribe(value => {
        if (value) {
          this.cartItems = this.cartStore.getCartQuanity();
        }
      });
  }

  syncRouteParameters() {
    let index = this.router.url.indexOf('?');
    this.currentUrl =
      index !== -1 ? this.router.url.substring(0, index) : this.router.url;
    if (this.currentUrl === '/curator' && this.appService.isBrowser) {
      this.openConfigurator();
    }
    this.router.events.subscribe(value => {
      if (value instanceof NavigationEnd) {
        index = value.url.indexOf('?');
        this.currentUrl =
          index !== -1 ? this.router.url.substring(0, index) : this.router.url;
        if (this.currentUrl === '/curator' && this.appService.isBrowser) {
          this.openConfigurator();
        }
      }
    });
  }

  openAccountPopup() {
    if (this.appService.isBrowser) {
      window.scrollTo(0, 0);
      if (this.store.loginStatus) {
        this.isOpenAccount = false;
        this.isOpenPanier = false;
        this.isOpen = false;
        this.router.navigateByUrl('/account');
      } else {
        this.router.navigateByUrl('/auth/login');
      }
    }
  }

  navOpen() {
    if (!this.isOpen && this.appService.isBrowser) {
      window.scrollTo(0, 0);
    }
    this.store.navOpenSubject.next(!this.isOpen);
    this.isOpen = !this.isOpen;
    this.isOpenSearch = false;
  }

  openDropdown(index) { }

  toggleSubCat(event, index) { }

  openNav(event) {
    if (
      event.data.subCategories.length > 0 &&
      event.data.parentCategory.se_name !== 'gift-voucher' &&
      event.data.parentCategory.se_name !== 'lookbook'
    ) {
      this.dropPanelCat = event.data;
      this.dropPanelCatIndex = event.catIndex;
      this.openDropPanel = true;
    } else {
      this.closeNav();
    }
  }

  closeNav() {
    this.openDropPanel = false;
  }

  mouseOutCloseNav(event) {
    if (
      event.toElement.className !==
      'navCategory show-gt-sm hide-lt-md ng-star-inserted'
    ) {
      this.closeNav();
    }
  }

  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationEnd) {
      if (this.isOpen) {
        this.store.navOpenSubject.next(!this.isOpen);
        this.isOpen = !this.isOpen;
        this.isOpenSearch = false;
      }

      if (this.isOpenAccount) {
        this.isOpenAccount = false;
      }
    }
  }

  openConfigurator() {
    this.router.navigateByUrl('/your-set');
    //this.configuratorService.OpenConfigureWindow.next(true);
  }

  scrollTop() {
    //window.scrollTo(0, 0);
    let mobilenav=document.getElementById('mobilePanelConatiner');
    if(mobilenav){
      //mobilenav.scrollTop=0;
      setTimeout(()=>{                        
        mobilenav.scrollTop=0;
       }
        ,501);
    }
  }
  

  ngOnDestroy() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }
}
