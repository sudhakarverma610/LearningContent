import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewChecked,
  ApplicationRef,
  Inject
} from '@angular/core';
import { Subject, BehaviorSubject, forkJoin } from 'rxjs';
import { AppService } from 'src/services/app.service';
import { CreateYourOwnStoryService } from '../createYourOwnStory.service';
import { ConfiguratorStoreService } from 'src/modules/configurator/configuratorStore.service';
import { CartService } from 'src/services/cart.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfiguratorService } from 'src/modules/configurator/configurator.service';
import { takeUntil } from 'rxjs/operators';
import { PreviewImageAPIRequest } from 'src/modules/configurator/modal/PreviewImageAPIRequest.model';
import { SharePopUpComponent } from './sharePopUp/sharePopUp.component';
import { Product } from 'src/store/products/products.model';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, OnDestroy, AfterViewChecked {
  public unsubscribeSubject: Subject<string> = new Subject();

  public url;
  public baseUrl = '';
  public sharePanel = false;
  public isEndScreen = false;
  public products: Product[] = [];
  public tellmeMoreActive = false;
  public configuratorSetUp: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );
  loginRequired: boolean;
  profile: any;
  backgroundimage = 'https://files.y.jewelry/assets/newUI/tellmey/tellmeresult-container.jpg';
  constructor(
    private appService: AppService,
    private createYourOwnStoryService: CreateYourOwnStoryService,
    private configuratorStoreService: ConfiguratorStoreService,
    private cartService: CartService,
    private router: Router,
    private authService: AuthService,
    public dialog: MatDialog,
    private configuratorService: ConfiguratorService,
    @Inject('BASE_API_URL') baseUrl: string
  ) {
    this.baseUrl = baseUrl;
  }

  ngOnInit() {
    // this.authService.loginStatusSubject
    //   .pipe(takeUntil(this.unsubscribeSubject))
    //   .subscribe(value => {
    //     if (!value) {
    //       this.createYourOwnStoryService.storyStage.next(1);
    //       this.router.navigate(['tellmey']);
    //     } else {
    //       this.createYourOwnStoryService.storyStage.next(2);
    //     }
    //   });
    if (
      ( this.createYourOwnStoryService.resultProducts === null || this.createYourOwnStoryService.resultProducts.length === 0) &&
      (!this.createYourOwnStoryService.resultURL.length ||
       this.createYourOwnStoryService.resultURL.length === 0)

    ) {
      this.appService.loader.next(true);
      this.createYourOwnStoryService
        .getMyStory()
        .subscribe((value) => {
          this.appService.loader.next(false);
          if (value) {
            if (value.randomProductsList.length === 0) {
              this.router.navigate(['tellmey']);
            }
            this.createYourOwnStoryService.storyId = value.storyId;
            let request = new PreviewImageAPIRequest();
            request = {
              chainSku: '',
              charmsSkus: value.randomProductsList
            };
            this.profile = value.profile;
            this.createYourOwnStoryService.profile = this.profile;
            this.backgroundimage = (value.profile.ResultImage) ?
                                     value.profile.ResultImage :
                                     'https://files.y.jewelry/assets/newUI/tellmey/tellmeresult-container.jpg';
            this.appService.loader.next(true);
            this.configuratorService
              .getConfigurationImage(request)
              .subscribe(result => {
                if (result.success) {
                  this.createYourOwnStoryService.resultURL = result.imageURL;
                  this.url = result.imageURL;
                  this.appService.loader.next(false);
                }
              });
            this.createYourOwnStoryService.resultProducts =
              value.randomProductsList;
            this.productSetup(value.randomProductsList);
           // this.products = value.randomProductsList;
            // this.addProductsToConfigurator(value.randomProductsList);
          }
        });
    } else {
      this.url = this.createYourOwnStoryService.resultURL;
      if (this.createYourOwnStoryService.resultProducts) {
        this.products = this.createYourOwnStoryService.GetResult();
      }
      if (!this.url || this.url === '') {
        let request = new PreviewImageAPIRequest();
        request = {
              chainSku: '',
              charmsSkus: this.products.map(x => x.sku)
            };
        this.configuratorService
        .getConfigurationImage(request)
        .subscribe(result => {
          if (result.success) {
            this.createYourOwnStoryService.resultURL = result.imageURL;
            this.url = result.imageURL;
            this.appService.loader.next(false);
          }
        });
      }
      this.profile = this.createYourOwnStoryService.profile;
      this.backgroundimage =  (this.profile.ResultImage) ? this.profile.ResultImage :
            'https://files.y.jewelry/assets/newUI/tellmey/tellmeresult-container.jpg';
      // this.addProductsToConfigurator(
      //   this.createYourOwnStoryService.resultProducts
      // );
    }
  }
  productSetup(skus: string[]) {
    if (skus.length > 0) {
      this.appService.loader.next(true);
     }
    const task = skus.map(item => {
      return this.configuratorService.getProduct(item);
    });
    forkJoin(task).subscribe(values => {
      this.products = [...values.filter(it => it.images)]; // apply filter for only those have image
      this.products = [...this.products.slice(0, 9)];
      this.createYourOwnStoryService.SetResult(this.products);
  });
  }
  addProductsToConfigurator(products: Product[]) {
    if (products.length > 0) {
     this.appService.loader.next(true);
    }
    this.configuratorStoreService.clearCompareList().subscribe(value => {
      const task2 = products.map(item => {
        return this.configuratorService.addToCompareList(item, false);
      });
      forkJoin(task2).subscribe(result => {
        this.appService.loader.next(false);
        this.configuratorSetUp.next(false);
        this.router.navigate(['your-set']);
      });
    });
  }
  PollAgian() {
    // this.restart();
    // this.createYourOwnStoryService.storyStage.next(1);
    // this.router.navigate(['tellmey']);
     this.authService.loginStatusSubject.subscribe(value => {
      if (value) {
        this.loginRequired = false;
      } else {
      this.loginRequired = true;
      }
    });
     this.tellmeMoreActive = true;
     this.isEndScreen = true;
  }

  ShowResultScreen() {
    this.tellmeMoreActive = false;
    this.isEndScreen = false;
  }
  Back() {
    this.router.navigate(['tellmey']);
  }
  restart() {
    this.createYourOwnStoryService.pollsSubject.next(true);
  }
  ngAfterViewChecked() {}
  openShare() {
    const dialogRef = this.dialog.open(SharePopUpComponent, {
      width: '250px',
      data: { url: this.baseUrl + '/api/getshareableimage?url=' + this.url }
    });
    dialogRef.afterClosed().subscribe(result => {});
  }
  addToConfigurator() {
    if (this.products.length > 0) {
      this.addProductsToConfigurator(this.products);
    }
    // this.configuratorSetUp
    //   .pipe(takeUntil(this.unsubscribeSubject))
    //   .subscribe(value => {
    //     if (value) {
    //       this.configuratorService.OpenConfigureWindow.next(true);
    //     }
    //   });
  }
  ngOnDestroy() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }
}
