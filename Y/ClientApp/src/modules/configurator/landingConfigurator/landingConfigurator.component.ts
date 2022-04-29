import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { forkJoin, from, noop, Subject } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/modules/shared/Confirmation-dialog/Confirmation-dialog.component';
import { CartService } from 'src/services/cart.service';
import { Product } from 'src/store/products/products.model';
import { BaseListingComponent } from '../baseListing/baseListing.component';
import { CharmsListingComponent } from '../charmsListing/charmsListing.component';
import { ConfiguratorService } from '../configurator.service';
import { ConfiguratorStoreService } from '../configuratorStore.service';
import { ConfiguratorPreviewData } from '../modal/configuratorPreviewData.model';
import { PreviewImageAPIRequest } from '../modal/PreviewImageAPIRequest.model';
import { UserCreation } from '../modal/userCreation.model';
import { SizeSelectionDailogComponent } from '../sizeSelectionDailog/sizeSelectionDailog.component';
import { UserCreationService } from '../userCreation.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-landingConfigurator',
  templateUrl: './landingConfigurator.component.html',
  styleUrls: ['./landingConfigurator.component.scss']
})
export class LandingConfiguratorComponent implements OnInit {

  public showCharmsSelection = false;
  public showChainsSelection = false;

  public charms: Product[] = [];
  public chains: Product[] = [];
  public selectedChainId: string;
  public imageSrc: string;

  @ViewChild('charmsListing', { static: false })
  charmsListing: CharmsListingComponent;
  @ViewChild('baseListing', { static: false })
  baseListing: BaseListingComponent;
  @ViewChild('charmsListing1', { static: false })
  charmsListing1: CharmsListingComponent;
  @ViewChild('baseListing1', { static: false })
  baseListing1: BaseListingComponent;
  public previewLoading = false;
  public error = false;
  public unsubscribeSubject = new Subject();
  public attributesSelected: { id: number; value: string }[] = [];

  public noAttributeSelectionNeeded = false;
  public baseUrl = '';
  public data: ConfiguratorPreviewData;
  public userCreations: UserCreation[];
  public intro = false;
  public isDesktop = true;
  public imageLoading = false;
  constructor(
    public dialog: MatDialog,
    private configuratorService: ConfiguratorService,
    private configuratorStore: ConfiguratorStoreService,
    private cartService: CartService,
    private router: Router,
    private userCreationService: UserCreationService,
    @Inject('BASE_API_URL') baseUrl: string) {

    this.baseUrl = baseUrl;
     }
  CtorInit() {
      this.charms = this.data.preSelectedCharms.map(item => {
        return { ...item };
      });
      this.chains = this.data.preSelectedChains.map(item => {
        return { ...item };
      });
      this.selectedChainId =(this.chains.length===1)?this.chains[0].id: this.data.selectedId;
      const request = new PreviewImageAPIRequest();
      const tempProductObj = this.chains.find(
        item => item.id === this.selectedChainId
      );
      if (tempProductObj) {
        request.chainSku = tempProductObj.sku;
      } else {
        request.chainSku = '';
      }
      request.charmsSkus = this.charms.map(item => item.sku);
      this.configuratorStore.selectedId = this.data.selectedId;
      // this.previewLoading = true;
      this.error = false;
      this.configuratorService
        .getConfigurationImage(request)
        .subscribe(result => {
          this.imageLoading = false;
          this.previewLoading = false;
          if (result.success) {
            this.imageSrc = result.imageURL;
            const a = document.getElementsByClassName('previewContainer');
            if (a[0]) {
              a[0].scrollIntoView();
            }
          } else {
        this.error = true;
          }
        });
     }
  ngOnInit() {
    this.configuratorStore.fetchCompareList().subscribe(noop);
    this.configuratorStore.selectedIdChanged.subscribe( res => {
      this.selectedChainId = res;
    });
    this.Init();
    this.LoadUserCreations();
  }
  LoadUserCreations() {
    this.previewLoading = true;
    this.userCreationService.getAllUserCreations()
    .subscribe(res => {
      this.previewLoading = false;
      if (res.Status) {
        this.userCreations = res.data;
      }
    });
  }
  OpenCharmsSelection() {
    this.showCharmsSelection = true;
    this.showChainsSelection = false;
  }
  OpenChainsSelection() {
    // this.intro=false;
    this.showChainsSelection = true;
    this.showCharmsSelection = false;
    // this.scroll('chain-selection');
  }
  Init() {
    this.previewLoading = true;
    this.imageLoading = true;
    Promise.all([
      this.configuratorStore.getSelectedBases(),
      this.configuratorStore.getSelectedCharms()
    ]).then((result: [Product[], Product[]]) => {
      if (result[1].length === 0) {
        const data = new ConfiguratorPreviewData();
        data.imageSrc = null;
        data.preSelectedCharms = [];
        data.preSelectedChains = result[0];
        if (result[0] && result[0][0] && result[0][0].id) {
          data.selectedId = result[0][0].id;
         }
        this.data = data;
        this.CtorInit();
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
          if (result[0].length === 1) {
            this.configuratorStore.selectedId = result[0][0].id;
          }
          data.selectedId =
            this.configuratorStore.selectedId || result[0][0].id;
          this.data = data;
          this.CtorInit();
          } else {
          this.configuratorService
            .getProduct('20001SC')
            .subscribe(defaultBase => {
              data.preSelectedChains = [defaultBase];
              data.selectedId = defaultBase.id;
              this.data = data;
              this.CtorInit();
            });
        }
      }
    });
  }
  preview() {
    const request = new PreviewImageAPIRequest();
    const tempProductObj = this.isDesktop ? this.baseListing1.products.find(
      item => item.id === this.baseListing1.selectedId
    ) : this.baseListing.products.find(
      item => item.id === this.baseListing.selectedId
    );
    if (tempProductObj) {
      request.chainSku = tempProductObj.sku;
    } else {
      request.chainSku = '';
    }
    request.charmsSkus = this.isDesktop ? this.charmsListing1.products.map(item => item.sku)
                        : this.charmsListing.products.map(item => item.sku);
    this.previewLoading = true;
    this.error = false;
    this.configuratorService
      .getConfigurationImage(request)
      .subscribe(result => {
        this.previewLoading = false;
        if (result.success) {
          this.imageSrc = result.imageURL;
          const a = document.getElementsByClassName('previewContainer');
          if (a[0]) {
            a[0].scrollIntoView();
          }
        } else {
          this.error = true;
        }
      });
  }

  selectSize() {
    const tempProductObj = this.baseListing.products.find(item => {
      return item.id === this.baseListing.selectedId;
    });
    const attributeObj = tempProductObj.attributes.find(
      attr => attr.product_attribute_name === 'Size in cm'
    );
    if (attributeObj) {
      const dialogRef = this.dialog.open(SizeSelectionDailogComponent, {
        width: '300px',
        data: { attributes: attributeObj }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result.selected) {
          this.attributesSelected = [{ ...result.value }];
          this.addToCart();
        }
      });
    } else {
      this.noAttributeSelectionNeeded = true;
      this.attributesSelected = [];
      this.addToCart();
    }
  }

  addToCart() {
    if (
      !this.noAttributeSelectionNeeded &&
      this.attributesSelected.length === 0
    ) {
      this.selectSize();
      return;
    }
    this.previewLoading = true;
    const AddToCartCalls = [];
    this.charms.forEach(item => {
      AddToCartCalls.push(this.cartService.addToCart(item, [], {}, false));
    });
    const tempProductObj = this.chains.find(
      item => item.id === this.baseListing.selectedId
    );
    if (tempProductObj) {
      AddToCartCalls.push(
        this.cartService.addToCart(
          tempProductObj,
          this.attributesSelected,
          {},
          false
        )
      );
    }
    let counter = 0;
    from(AddToCartCalls)
      .pipe(concatMap(val => val))
      .subscribe(item => {
        counter++;
        if (counter === AddToCartCalls.length) {
          this.previewLoading = false;
          this.clear();
          this.router.navigate(['/cart']);
        }
      });
  }

  clear() {
    this.charms = [];
    this.chains = [];
    this.charmsListing.products = [];
    this.baseListing.products = [];
    this.charmsListing1.products = [];
    this.baseListing1.products = [];
    this.selectedChainId = undefined;
    this.imageSrc = null;
    this.configuratorStore.clearCompareList().subscribe(result => {});
  }
  ErrorCheck(chains: Product[]) {
    const id = this.baseListing
      ? this.baseListing.selectedId
      : this.selectedChainId;
    const selectedChain = chains.find(it => it.id === id);
    if (selectedChain && selectedChain.tags.some(it => it === 'neckchain')) {
      return true;
    }
    return false;
  }
  onNoClick() {

  }
  AddToConfiguratorEvent(eventData) {
    this.Init();
  }
  scroll(id: string) {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView();
      }
    }, 500);
  }
  scrollY(el: HTMLElement) {
      setTimeout(() => {
          if (el) {
            window.scrollTo(0, el.offsetTop - 85);
          }
      }, 300);
  }
  /***********************UserCreation Event ******************************** */
  OnSaveCreationClick() {
    if (this.data) {
      this.previewLoading = true;
      const userCreation: UserCreation = {
         Id: 0,
         image_url: !(this.data.imageSrc) ? this.imageSrc : this.data.imageSrc,
         SelectedChainSku: this.selectedChainId ? this.selectedChainId : this.configuratorStore.selectedId,
         AllProductsSkus: [this.data.preSelectedCharms.map(x => x.sku).join(','),
                          this.data.preSelectedChains.map(x => x.sku).join(',')]
                          .join(',')

       };

      this.userCreationService.saveCreation(userCreation).subscribe(
         (res: {Status: boolean; Error: string, Data: any}) => {
           if (res.Status) {
             console.log(res);
             this.clear();
             this.userCreations = [res.Data, ...this.userCreations ];
            } else {
              console.log('Error While Saving User Creation');
              console.log(res);
           }
           this.previewLoading = false;
         });
    }
  }
  OnUserCreationShareImageChanged(event: UserCreation) {
    // On Share Logic share
    // console.log(event);
  }
  OnUserCreationDownloadImageChanged(event: UserCreation) {
    // console.log(event);
  }
  OnRemoveCreationChanged(event: UserCreation) {
    // console.log(event);
    this.previewLoading = true;
    this.userCreationService.deleteUserCreation(event.Id).
    subscribe((res: {Status: boolean; Error: string; Data: any; Message: string; }) => {
      this.previewLoading = false;
      if (res.Status) {
        this.userCreations = [...this.userCreations.filter( x => x.Id !== event.Id)];
      } else {
        console.log('Unable to Delete User Creation');
        console.log(res);
      }

    });
  }
  OnSelectedUserCreation(event: UserCreation) {
    // check condtion for items are in curator
    if ((this.chains.length + this.charms.length) !== 0) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '300px',
        data: { text: 'Save Current Creation Or Not', okText: 'Yes', cancelText: 'No' }
      });
      dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        if (this.data) {
          this.previewLoading = true;
          const userCreation: UserCreation
                                  = {
                                      Id: 0,
                                      image_url: !(this.data.imageSrc) ? this.imageSrc : this.data.imageSrc,
                                      SelectedChainSku: this.configuratorStore.selectedId,
                                      AllProductsSkus: [this.data.preSelectedCharms.map(x => x.sku).join(','),
                                                        this.data.preSelectedChains.map(x => x.sku).join(',')]
                                                        .join(',')
                                    };
          this.userCreationService.saveCreation(userCreation).subscribe(
             (res: {Status: boolean; Error: string, Data: any}) => {
               if (res.Status) {
                 // console.log(res);
                 this.clear();
                 this.userCreations = [res.Data, ...this.userCreations];
                } else {
                  console.log('Error While Saving User Creation');
                  console.log(res);
               }
               this.previewLoading = false;
             });
        }
        this.OnSaveCreationClick();
        } else {
          this.clear();
        }
      this.addProductsToConfigurator(event.AllProductsSkus.split(','), event.SelectedChainSku);
       });
    } else {
      this.addProductsToConfigurator(event.AllProductsSkus.split(','), event.SelectedChainSku);
     }
  }
  addProductsToConfigurator(skus: string[], selectedId: string ) {
    if (skus.length > 0) {
    this.previewLoading = true;
    }
    this.configuratorStore.clearCompareList().subscribe(value => {
      const task = skus.map(item => {
        return this.configuratorService.getProduct(item);
      });
      let task2 = [];
      forkJoin(task).subscribe(values => {
          task2 = values.map(item => {
            return this.configuratorService.addToCompareList(item, false);
            });
          forkJoin(task2).subscribe(result => {
              this.selectedChainId = selectedId;
              this.configuratorStore.selectedId = this.selectedChainId;
              this.Init();
          });
      });
    });
  }
  /******************************************************* */
  trackUserCreation(index: number, userCreation: UserCreation) {
    return userCreation.Id;
  }
}
