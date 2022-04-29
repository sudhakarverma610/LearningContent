import { Component, Inject, ViewChild, OnInit, OnDestroy } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from "@angular/material/dialog";
import { ConfiguratorPreviewData } from "../modal/configuratorPreviewData.model";
import { from, Subject, noop } from "rxjs";
import { PreviewImageAPIRequest } from "../modal/PreviewImageAPIRequest.model";
import { ConfiguratorService } from "../configurator.service";
import { Product } from 'src/store/products/products.model';
import { CharmsListingComponent } from '../charmsListing/charmsListing.component';
import { BaseListingComponent } from '../baseListing/baseListing.component';
import { ConfiguratorStoreService } from '../configuratorStore.service';
import { CartService } from 'src/services/cart.service';
import { Router, NavigationEnd } from '@angular/router';
import { takeUntil, concatMap } from 'rxjs/operators';
import { SizeSelectionDailogComponent } from '../sizeSelectionDailog/sizeSelectionDailog.component';
import { UserCreation } from "../modal/userCreation.model";
import { UserCreationService } from "../userCreation.service";

@Component({
  selector: "app-preview",
  templateUrl: "./preview.component.html",
  styleUrls: ["./preview.component.scss"]
})
export class PreviewComponent implements OnInit, OnDestroy {
  public charms: Product[] = [];
  public chains: Product[] = [];
  public selectedChainId: string;
  public imageSrc: string;

  @ViewChild("charmsListing", { static: false })
  charmsListing: CharmsListingComponent;
  @ViewChild("baseListing", { static: false })
  baseListing: BaseListingComponent;

  public previewLoading = false;
  public error = false;

  public unsubscribeSubject = new Subject();

  public attributesSelected: { id: number; value: string }[] = [];

  public noAttributeSelectionNeeded = false;
  public baseUrl = ""; 
  
  public showCharmsSelection=false;
  public showChainsSelection=false;
  public userCreations:UserCreation[];
  constructor(
    public dialog: MatDialog,
    private configuratorService: ConfiguratorService,
    private configuratorStore: ConfiguratorStoreService,
    private userCreationService:UserCreationService,
    private cartService: CartService,
    public dialogRef: MatDialogRef<PreviewComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: ConfiguratorPreviewData,
    @Inject("BASE_API_URL") baseUrl: string
  ) {
    this.baseUrl = baseUrl;
    this.charms = data.preSelectedCharms.map(item => {
      return { ...item };
    });
    this.chains = data.preSelectedChains.map(item => {
      return { ...item };
    });
    this.selectedChainId = data.selectedId;
    const request = new PreviewImageAPIRequest();
    const tempProductObj = this.chains.find(
      item => item.id === this.selectedChainId
    );
    if (tempProductObj) {
      request.chainSku = tempProductObj.sku;
    } else {
      request.chainSku = "";
    }
    request.charmsSkus = this.charms.map(item => item.sku);
    this.previewLoading = true;
    this.error = false;
    this.configuratorService
      .getConfigurationImage(request)
      .subscribe(result => {
        this.previewLoading = false;
        if (result.success) {
          this.imageSrc = result.imageURL;
          const a = document.getElementsByClassName("previewContainer");
          if (a[0]) {
            a[0].scrollIntoView();
          }
        } else {
          this.error = true;
        }
      });

    this.unsubscribeSubject = new Subject();
    this.router.events
      .pipe(takeUntil(this.unsubscribeSubject))
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.onNoClick();
        }
      });
      const css =
       ".cdk-global-overlay-wrapper { bottom: 10px !important; top: unset; align-items: flex-end !important; } .cdk-overlay-pane { max-width: 100vw !important; } .mat-dialog-container { padding: 0px !important; overflow-x: hidden; overflow-y: auto; max-height: calc(100vh - 90px) !important; }";
    
    // const css =
    //   "@media (max-width: 669px) { .cdk-global-overlay-wrapper { bottom: 10px !important; top: unset; align-items: flex-end !important; } .cdk-overlay-pane { max-width: 100vw !important; } .mat-dialog-container { padding: 0px !important; overflow-x: hidden; overflow-y: auto; max-height: calc(100vh - 90px) !important; } }";
    const head = document.getElementsByTagName("head")[0];
    const style = document.createElement("style");
    style.id = "custom-cdk-overlay-pane";
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));
    head.appendChild(style);
  }

  ngOnInit() {
    this.unsubscribeSubject = new Subject();
    this.noAttributeSelectionNeeded = false;
  }
  OpenCharmsSelection(){
     
    this.showCharmsSelection=true;
    this.showChainsSelection=false;
  }
  OpenChainsSelection(){
     
    this.showChainsSelection=true;
    this.showCharmsSelection=false;

  }
  preview() {
    const request = new PreviewImageAPIRequest();
    const tempProductObj = this.baseListing.products.find(
      item => item.id === this.baseListing.selectedId
    );
    if (tempProductObj) {
      request.chainSku = tempProductObj.sku;
    } else {
      request.chainSku = "";
    }
    request.charmsSkus = this.charmsListing.products.map(item => item.sku);
    this.previewLoading = true;
    this.error = false;
    this.configuratorService
      .getConfigurationImage(request)
      .subscribe(result => {
        this.previewLoading = false;
        if (result.success) {
          this.imageSrc = result.imageURL;
          const a = document.getElementsByClassName("previewContainer");
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
      attr => attr.product_attribute_name === "Size in cm"
    );
    if (attributeObj) {
      const dialogRef = this.dialog.open(SizeSelectionDailogComponent, {
        width: "300px",
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
          this.onNoClick();
          this.router.navigate(["/cart"]);
        }
      });
  }

  clear() {
    this.charms = [];
    this.chains = [];
    this.charmsListing.products = [];
    this.baseListing.products = [];
    this.selectedChainId = undefined;
    this.imageSrc = null;
    this.configuratorStore.clearCompareList().subscribe(result => {});
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ErrorCheck(chains: Product[]) {
    const id = this.baseListing
      ? this.baseListing.selectedId
      : this.selectedChainId;
    const selectedChain = chains.find(it => it.id == id);
    if (selectedChain && selectedChain.tags.some(it => it === "neckchain")) {
      return true;
    }
    return false;
  }
  AddToConfiguratorEvent($event){
    
  }
   /***********************UserCreation Event ******************************** */
   LoadUserCreations(){
    this.previewLoading=true;
    this.userCreationService.getAllUserCreations()
    .subscribe(res=>{
      this.previewLoading=false;

      if(res.Status){
        this.userCreations=res.data;
      }

    });
   }
   OnSaveCreationClick(){
    if(this.data){
      this.previewLoading=true;
     const userCreation:UserCreation
     ={
       Id:0,
       image_url:!(this.data.imageSrc)?this.imageSrc:this.data.imageSrc,
       SelectedChainSku:this.data.preSelectedChains.map(x=>{return x.sku}).join(","),
       AllProductsSkus:this.data.preSelectedCharms.map(x=>{return x.sku}).join(",") 
     };
       this.userCreationService.saveCreation(userCreation).subscribe(
         (res:{Status:Boolean;Error:string})=>{
           if(res.Status){
             console.log(res);
             this.clear();
             this.LoadUserCreations()
            }else{            
              console.log("Error While Saving User Creation");
              console.log(res);
           }
           this.previewLoading=false;

         })
    } 
  }
  OnUserCreationShareImageChanged(event:UserCreation){
    //On Share Logic share 
    // console.log(event);
  }
  OnUserCreationDownloadImageChanged(event:UserCreation){
    // console.log(event);
  }
  OnRemoveCreationChanged(event:UserCreation){
    //console.log(event);
    this.previewLoading=true;
    this.userCreationService.deleteUserCreation(event.Id).
    subscribe((res:{Status:boolean;Error:string;Data:string;Message:string;})=>{
      this.previewLoading=false;
      if(res.Status){
        this.LoadUserCreations();
      }else{
        console.log("Unable to Delete User Creation");
        console.log(res);
      }

    })
  }
  /******************************************************* */
  ngOnDestroy() {
    if (this.charmsListing.products.length > 0) {
      this.configuratorStore.clearCompareList().subscribe(result => {
        from([
          ...this.charmsListing.products.map(item => {
            return this.configuratorStore.addProductToList(item, false);
          }),
          ...this.baseListing.products.map(item => {
            return this.configuratorStore.addProductToList(item, false);
          })
        ])
          .pipe(concatMap(val => val))
          .subscribe(res => {
            //console.log(res);
          });
        const ids = [
          ...this.charmsListing.products.map(it => it.id),
          ...this.baseListing.products.map(it => it.id)
        ].join("-");
        this.configuratorStore
          .addAllProductToListAtBackend(ids)
          .subscribe(noop);
      });
    }
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
    const styleEl = document.getElementById("custom-cdk-overlay-pane");
    if (styleEl) {
      styleEl.remove();
    }
  }
}
