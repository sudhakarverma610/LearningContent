import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Product, Attribute } from 'src/store/products/products.model';
import { CartService } from 'src/services/cart.service';
import { ConfiguratorStoreService } from 'src/modules/configurator/configuratorStore.service';
import { ConfiguratorService } from 'src/modules/configurator/configurator.service';
import { MatDialog } from '@angular/material/dialog';
import { StoreService } from 'src/store/store.service';
import { AppService } from 'src/services/app.service';
import { ShoppingCartsItem } from 'src/store/cart/ShoppingCart.model';
import { AddToCartComponent } from 'src/modules/navbar/addedToCart/addedToCart.component';
import { NotificationsEntity } from 'src/modules/notification/notification.service';
import { NotificationHandlerService } from 'src/modules/notification/notification.handle.service';
import { OutOfStockComponent } from '../outOfStock/outOfStock.component';
import { AddToCuratorComponent } from 'src/modules/navbar/addToCurator/addToCurator.component';


@Component({
  selector: 'app-product-list-item-view',
  templateUrl: 'productListItemView.component.html',
  styleUrls: ['./productListItemView.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListItemViewComponent implements OnInit {
  public _product: { category_sename: string; data: Product };
  public sticker = false;
  public isConfigurable = false;
  public addToCartSymbol =
    'https://files.y.jewelry/assets/img/icons/rounded_tick_icon.svg';
  public configuratorError =
    'https://files.y.jewelry/assets/img/exclamation.png';
  public symbolMsg =
    'https://files.y.jewelry/assets/img/icons/rounded_tick_icon.svg';

  public summerSale = false;
  public sizeSelector = false;
  public attributes = [];
  @Input()
  public IsShowHome = false;
  @Input()
  set product(input: { category_sename: string; data: Product }) {
    this.attributes = [...input.data.attributes];
    this._product = input;
    this.sticker = input.data.tags.some(it => it === '25off');
    this.configuratorStore.settingsFetchedSubject.subscribe(value => {
      if (value) {
        this.configuratorStore
          .isConfigurable(input.data)
          .toPromise()
          .then(result => {
            this.isConfigurable = result;
            this.appRef.detectChanges();
          });
      }
    });
  }

  get product() {
    return this._product;
  }

  @Input()
  public index;

  @Input()
  public listType;

  public showAddedToBag = false;
  public addToCartSuccessMsg = 'Added to bag with success.';
  public addToCartFailureMsg = 'The Product is out of stock.';
  public addToCartReply = this.addToCartSuccessMsg;
  public isCoverImg = false;
  public CoverImg: any;
  constructor(
    private cartService: CartService,
    private configuratorStore: ConfiguratorStoreService,
    private configuratorService: ConfiguratorService,
    public dialog: MatDialog,
    private store: StoreService,
    private appService: AppService,
    private appRef: ChangeDetectorRef,
    private notificationHandler: NotificationHandlerService
  ) {}

  ngOnInit() {
    this.summerSale = this.store.getDiscountStatus('summer-sale');
    this.store.discountUpdated.subscribe(value => {
      this.summerSale = this.store.getDiscountStatus('summer-sale');
    });
    const IsCoverImgFound = this.product.data.images.filter(x => x.title === 'CoverImg1');
    this.isCoverImg = (this.product.data.tags.indexOf('coverimg') > -1 && IsCoverImgFound.length > 0);
    if (this.isCoverImg) {
   this.CoverImg = IsCoverImgFound[0];
   }
  }

  addToCart(event = new MouseEvent('click')) {
    try {
      event.preventDefault();
      event.stopPropagation();
    } catch (err) {}
    // check stock status
    if (this.product.data.manage_inventory_method_id === 1 && !(this.product.data.stock_quantity > 0)) { 
      let data:{message:string}={message:"The product is out of stock."}; 
      this.openOutOfStockPopUp(data);
      return;
    }

    if (
      this.product.data.attributes.some(
        it =>
          it.product_attribute_name === 'Size in cm' &&
          !it.attributeInputSelected
      )
    ) {
      this.sizeSelectorOpen();
      return;
    }
    let attributeSelected: { id: number; value: string }[] = [];
    if (this.product.data.attributes) {
      attributeSelected = [
        ...attributeSelected,
        ...this.setUpAttributesForAddToCart(this.product.data.attributes)
      ];
    }

    this.cartService
      .addToCart(this.product.data, attributeSelected, null)
      .subscribe((result: any) => {
        if (!Object.prototype.hasOwnProperty.call(result, 'Error')) {
          const product = result.shopping_carts.find(item => {
            return item.product.id === this.product.data.id;
          });

          if (product) {
            this.openPopUp(product);
            this.product.data.attributes.forEach(it => {
              if (it.product_attribute_name === 'Size in cm') {
                it.attributeInputSelected = null;
              }
            });
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

  sizeSelectorOpen() {
    this.sizeSelector = true;
  }

  sizeSelectorClose() {
    this.sizeSelector = false;
  }

  selectSimpleAttrValue() {
    // console.log('I am Calling selectSimpleAttrValue in ProductListItemView');
    this.addToCart();
    this.sizeSelectorClose();
  }

  setUpAttributesForAddToCart(
    input: Attribute[]
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

  openOutOfStockPopUp(data: {message: string}) {
    const dialogRef = this.dialog.open(OutOfStockComponent, {
      width: '520px',
      data: { item: data }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }
  
  openPopUp(data: ShoppingCartsItem) {
    const dialogRef = this.dialog.open(AddToCartComponent, {
      width: '520px',
      data: { item: data }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  sendGTMData(product: Product, category: string) {
    if (this.appService.isBrowser) {
      (window as any).dataLayer = (window as any).dataLayer || [];
      const productClickedArray = [
        {
          name: product.name,
          id: product.id,
          price: product.price_model.price_without_formatting,
          brand: 'Y',
          category,
          position: (this.index || 0) + 1
        }
      ];
      const ecommerceObject = {
        ecommerce: {
          click: {
            products: productClickedArray,
            actionField: { list: this.listType }
          }
        },
        event: 'eec.productClick'
      };
      (window as any).dataLayer.push(ecommerceObject);
    }
  }

  showError() {
    const data = new NotificationsEntity();
    data.notification_id = 'default_' + Math.ceil(Math.random() * 1000);
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
    this.configuratorService
      .addToCompareList(this.product.data)
      .subscribe(result => {
        if (!result.success) {
          this.symbolMsg = this.configuratorError;
          this.showError();
        } else {
          this.openPopUpCurator(this.product.data);

        }
      });
  }

  addToWishList() {}
}
