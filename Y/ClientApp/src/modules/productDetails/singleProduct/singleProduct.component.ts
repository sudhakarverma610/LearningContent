import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, Image, AttributeValue } from 'src/store/products/products.model';
import { breadcrumb } from 'src/modules/shared/breadcrumb/breadcrumb.model';
import { AppService } from 'src/services/app.service';
import { CartService } from 'src/services/cart.service';
import { DOCUMENT, Location } from '@angular/common';
import { ConfiguratorStoreService } from 'src/modules/configurator/configuratorStore.service';
import { ConfiguratorService } from 'src/modules/configurator/configurator.service';
import { MatDialog,  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatSelectChange} from '@angular/material/select';
import { CategoryModel } from 'src/store/categories/categories.model';
import { ShoppingCartsItem } from 'src/store/cart/ShoppingCart.model';
import { AddToCartComponent } from 'src/modules/navbar/addedToCart/addedToCart.component';
import { NotificationsEntity } from 'src/modules/notification/notification.service';
import { NotificationHandlerService } from 'src/modules/notification/notification.handle.service';
import { OutOfStockComponent } from 'src/modules/shared/outOfStock/outOfStock.component';
import { ProductDetailsService } from '../productDetails.service';
import { Output, EventEmitter } from '@angular/core';
import { AddToCuratorComponent } from 'src/modules/navbar/addToCurator/addToCurator.component';

declare let $: any;

declare global {
  interface Window {
    FancyProductDesigner: any;
    FancyProductDesignerView: any;
  }
}

@Component({
  selector: 'app-singleproduct',
  templateUrl: './singleProduct.component.html',
  styleUrls: ['./singleProduct.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleProductComponent
  implements OnInit, OnDestroy {
  public _data: Product;
  public slides: Image[] = [];
  public Vslide: Image;
  public parentCategory: string;
  public availableForPreOrder = false;
  public availableDate: string;
  public sizeSelectionError = false;
  public _zoomedImage = false;

  public get zoomedImage() {
    return this._zoomedImage;
  }

  public set zoomedImage(input) {
    if (this.appService.isBrowser) {
      if (input) {
        const css =
          '.cdk-overlay-pane { max-width: 100vw !important; } .mat-dialog-container {padding: 0px !important;}';
        const head = document.getElementsByTagName('head')[0];
        const style = document.createElement('style');
        style.id = 'custom-cdk-overlay-pane';
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        head.appendChild(style);
      } else {
        const styleEl = document.getElementById('custom-cdk-overlay-pane');
        if (styleEl) {
          styleEl.remove();
        }
      }
    }
    this._zoomedImage = input;
  }


  public outOfStock = false;
  public document: any;

  public isConfigurable = false;
  public addToCartSymbol =
    'https://files.y.jewelry/assets/img/icons/rounded_tick_icon.svg';
  public configuratorError =
    'https://files.y.jewelry/assets/img/exclamation.png';
  public symbolMsg =
    'https://files.y.jewelry/assets/img/icons/rounded_tick_icon.svg';

  public breadcrumbList: breadcrumb[] = [
    { title: '', link: '' },
    { title: '', link: '' }
  ];

  public sticker = false;
  public charmOfMonth = false;
  public charmOfWeek = false;

  public isSizeSelector = false;
  constructor(
    private route: ActivatedRoute,
    public appService: AppService,
    private cartService: CartService,
    private _location: Location,
    @Inject(DOCUMENT) document: any,
    private router: Router,
    private configuratorStore: ConfiguratorStoreService,
    private configuratorService: ConfiguratorService,
    public dialog: MatDialog,
    private notificationHandler: NotificationHandlerService,
    private productDetailService: ProductDetailsService
  ) {
    this.document = document;
   // window.addEventListener('scroll', this.onScrollChange);
  }

  @Input()
  public category: CategoryModel = new CategoryModel({});

  @Input()
  public url;

  @Input()
  set data(data: Product) {
    this._data = data;

    if (data) {
      this.breadcrumbList[1] = { title: data.sku, link: '/' + data.se_name };
      this.setUpImages(data);
      this.setUpInventoryStatus(data);
      this.configuratorStore.isConfigurable(data).subscribe(result => {
        this.isConfigurable = result;
      });
      this.sticker = data.tags.some(it => it === '25off');
      this.charmOfMonth = data.tags.some(it => it === 'charmofmonth');
      this.charmOfWeek = data.tags.some(it => it === 'charmofweek');

      this.availableForPreOrder = data ? (data.stock_quantity == 0 ? data.available_for_pre_order : false) : false;
      this.availableDate = data.pre_order_availability_start_date_time_utc
        ? data.pre_order_availability_start_date_time_utc
        : null;
      this.isSizeSelector = data.attributes.some(
        it => it.product_attribute_name === 'Size in cm'
      );
    }
  }
  @Input()
  set CurrentImage(input: Image) {
    if (input) {
      this.Vslide = input;
      // this.StartTimmer();
    }
  }
  @Output()
  public leftSlideEvent = new EventEmitter<any>();
  @Output()
  public rigthSlideEvent = new EventEmitter<any>();

  // tslint:disable-next-line: adjacent-overload-signatures
  get data() {
    return this._data;
  }
  public lastScroll = 0;
  /****************************Image Animation************************************/
  onScrollChange(event: any) {
     const  productimage = document.getElementById('productimageid');
     if (!productimage) {
        return;
     }
     const imagehiegt = productimage.scrollHeight;
     const scollh = document.scrollingElement.scrollTop;
     // let productNameElement= document.getElementById('producth1');
     const currentScroll = document.documentElement.scrollTop || document.body.scrollTop; // Get Current Scroll Value
     if (currentScroll > 0 && this.lastScroll <= currentScroll) {
        this.lastScroll = currentScroll;
        if (this.lastScroll > 20 && scollh < imagehiegt) {
          if (productimage) {
            window.scrollTo({
              top: imagehiegt,
              behavior:  'smooth'
            });

          }
        }
      } else {
        this.lastScroll = currentScroll;
        // console.log('Scrolling UP') ;
     }
  }
  /****************************Image Animation************************************/
   ngOnInit() {
    if (this.appService.isBrowser) {
      this.route.params.subscribe(value => {
        this.parentCategory = value.category;
        this.breadcrumbList[0] = {
          title: value.category,
          link: '/' + value.category
        };
      });
      window.scrollTo(0, 0);
      this.productDetailService.SaveRecentProduct(this.data.id).subscribe(res => res);
    }
  }
  stripHtml(html) {
    // console.log('stripHtml Calling in single ProductComponent');
    if (this.appService.isBrowser) {
      const tmp = document.createElement('DIV');
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || '';
    } else {
      return html.replace(/<[^>]*>?/gm, '');
    }
  }

  setUpImages(input: Product) {
    if (input.images) {
      this.slides = [...input.images]
        .filter(
          img =>
            img.title !== 'ConfigurationImage' &&
            img.title !== 'ConfigurationImage2' &&
            img.title !== 'CoverImg1'
        )
        .map(it => {
          if (
            it.src.substr(it.src.lastIndexOf('.')) === '.jpeg'
            && it.position < 3
            && !input.tags.some(it => it === 'base')
            && (input.tags.some(it => it === 'bead') || input.tags.some(it => it === 'hanging'))
          ) {
            const altSrc = input.images.find(
              a => a.title === 'ConfigurationImage'
            );
            if (altSrc) {
              it.altSrc = altSrc.src;
            }
          }
          return it;
        });
      // this.Vslide = { ...this.slides[0] };
      // this.StartTimmer();
    }
  }


  setUpInventoryStatus(input: Product) {
    if (input.manage_inventory_method_id && !input.available_for_pre_order) {
      if (input.manage_inventory_method_id === 2) {
        if (this.data.attributeCombinations.length > 0) {
          this.data.attributes.forEach(attr => {
            this.manageStockStatus(attr.id, attr.attributeInputSelected);
          });
        } else {
          this.outOfStock = false;
        }
      } else if (input.manage_inventory_method_id === 1) {
        if (input.stock_quantity && input.stock_quantity > 0) {
          this.outOfStock = false;
        } else {
          this.outOfStock = true;
        }
      }
    }
  }

  pushImageGtm() {
    window.dataLayer.push({
      event_category: 'image_view',
      event_action: this.data.name,
      event: 'image_click'
    });
  }

  setUpAttributesForAddToCart(
    input: ProductAttributesDOMModel[]
  ): { id: number; value: string }[] {
    const tempArray: { id: number; value: string }[] = [];
    input.forEach(attr => {
      if (attr.attribute_control_type_name === 'DropdownList') {
        const tempObject = {
          id: attr.id,
          value: attr.attributeInputSelected.id.toString()
        };
        tempArray.push({ ...tempObject });
      }
      // TO-DO other types of attributes
      if (attr.attribute_control_type_name === 'TextBox') {
        const tempObject = {
          id: attr.id,
          value: attr.textBoxInput
        };
        tempArray.push({ ...tempObject });
      }
    });
    return tempArray;
  }

  addToCart() {
    let attributeSelected: { id: number; value: string }[] = [];
    this.sizeSelectionError = false;
    if (
      this.data.attributes.some(
        it =>
          it.product_attribute_name === 'Size in cm' &&
          !it.attributeInputSelected
      )
    ) {
      this.sizeSelectionError = true;
      return;
    }
    if (this.data.attributes) {
      attributeSelected = [
        ...attributeSelected,
        ...this.setUpAttributesForAddToCart(this.data.attributes)
      ];
    }
    this.cartService
      .addToCart({ ...this.data }, attributeSelected, null)
      .subscribe((result: any) => {
        if (!Object.prototype.hasOwnProperty.call(result, 'Error')) {
          const product = result.shopping_carts.find(item => {
            return item.product.id === this.data.id;
          });

          if (product) {
            this.openPopUp(product);
          } else {

            const data: {message: string} = {message: 'The product is out of stock.'};
            this.openOutOfStockPopUp(data);
          }
        } else {
          const data: {message: string} = {message: 'The product is out of stock.'};
          this.openOutOfStockPopUp(data);
        }
      });
  }

  openPopUp(data: ShoppingCartsItem) {
    const dialogRef = this.dialog.open(AddToCartComponent, {
      width: '520px',
      data: { item: data }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }
  openOutOfStockPopUp(data: {message: string}) {
    const dialogRef = this.dialog.open(OutOfStockComponent, {
      width: '520px',
      data: { item: data }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }
  selectSimpleAttrValue(attrIndex, event: MatSelectChange) {
    this.selectAttrValue(this.data.attributes, attrIndex, event.value);
  }

  selectAttrValue(
    attributes: ProductAttributesDOMModel[],
    attrIndex: number,
    attrValue: AttributeValue
  ) {
    attributes[attrIndex].active = false;
    attributes[attrIndex].attributeInputSelected = attrValue;

    if (this.data && this.data.manage_inventory_method_id) {
      if (this.data.manage_inventory_method_id === 2) {
        this.manageStockStatus(
          attributes[attrIndex].id,
          attributes[attrIndex].attributeInputSelected
        );
      }
    }
  }

  selectNavigatingAttrValue(value) {
    const link = `/product/${this.parentCategory}/${value.associated_product_id}?isId=true`;
    this.router.navigateByUrl(link);
  }

  manageStockStatus(attribute_id, attribute_value) {
    if (!attribute_value) {
      this.outOfStock = false;
      return;
    }
    const selectedCombination = this.data.attributeCombinations.find(
      combinations => {
        return (
          combinations.attribute_id === attribute_id.toString() &&
          combinations.attribute_value_id === attribute_value.id.toString()
        );
      }
    );
    if (selectedCombination && selectedCombination.stock) {
      if (selectedCombination.stock > 0) {
        this.outOfStock = false;
      } else {
        this.outOfStock = true;
      }
    } else {
      this.outOfStock = false;
    }
  }

  viewImage(slide: Image) {
    this.Vslide = slide;
  }

  showError() {
    const data = new NotificationsEntity();
    data.notification_id = '5';
    data.url = '/';
    data.heading = 'Maximum number of items have been added. Please remove items before adding new.';
    data.content =  '';
    this.notificationHandler.newNotification.next(data);
  }

  openPopUpCurator(input: Product) {
    const dialogRef  = this.dialog.open(AddToCuratorComponent, {
      width: '380px',
      data: input
    });
    dialogRef.afterClosed().subscribe(result => {});
  }
  addToConfigurator() {
    this.configuratorService.addToCompareList(this.data).subscribe(result => {
      if (!result.success) {
        this.symbolMsg = this.configuratorError;
        this.showError();
      } else {
        this.openPopUpCurator(this.data);
      }
    });
  }

  zoomImage(url: string) {
    this.zoomedImage = true;
    const dialogRef = this.dialog.open(ZoomImageDialog, {
      data: { url }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.zoomedImage = false;
    });
  }

  back() {
    this._location.back();
  }

  ngOnDestroy() {
    //window.removeEventListener('scroll', this.onScrollChange);
  }
}

export interface SpecificationAttributes {
  attribute_option_id: number;
  attribute_name: string;
  attribute_option_name: string;
  attribute_option_color_rgb: string;
  attribute_filterIds: string;
  custom_value: string;
}

export interface ProductAttributesDOMModel {
  id: number;
  product_attribute_id: number;
  product_attribute_name: string;
  text_prompt: any;
  is_required: boolean;
  attribute_control_type_id: number;
  display_order: number;
  default_value: any;
  attribute_control_type_name: string;
  validationMinLength: number;
  validationMaxLength: number;
  attribute_values: AttributeValue[];
  textBoxInput: string;
  active: boolean;
  attributeInputSelected: AttributeValue;
}

@Component({
  selector: 'app-zoom-image',
  templateUrl: 'zoomImage.component.html'
})
export class ZoomImageDialog {
  constructor(
    public dialogRef: MatDialogRef<ZoomImageDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { url: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
