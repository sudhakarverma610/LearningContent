import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  ShoppingCartRootObject,
  ShoppingCartsItem,
  OrderTotalRootObject
} from "src/store/cart/ShoppingCart.model";
import { ActivatedRoute, Router } from "@angular/router";
import { CartService } from "../../../services/cart.service";
import { Subject, noop } from "rxjs";
import {  MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { breadcrumb } from 'src/modules/shared/breadcrumb/breadcrumb.model';
import { Customer } from 'src/store/Customer/customer.model';
import { CartStoreService } from 'src/store/cartStore.service';
import { CustomerStoreService } from 'src/store/customerStore.service';
import { AuthService } from 'src/services/auth.service';
import { takeUntil } from 'rxjs/operators';
import { AttributeValue, Image } from 'src/store/products/products.model';
import { AppService } from 'src/services/app.service';
import { NotificationsEntity } from 'src/modules/notification/notification.service';
import { NotificationHandlerService } from 'src/modules/notification/notification.handle.service';

@Component({
  selector: "app-main-cart-view",
  templateUrl: "./mainCartView.component.html",
  styleUrls: ["./mainCartView.component.scss"]
})
export class MainCartViewComponent implements OnInit, OnDestroy {
  public cart: ShoppingCartRootObject;
  public cartLoading = true;
  public total = 0;
  public orderTotal: OrderTotalRootObject = new OrderTotalRootObject();
  default = {
    src: "https://files.y.jewelry/assets/logo.jpeg",
    title: "default image",
    alt: "loading"
  };

  displayedColumns: string[] = [
    "image",
    "product",
    "price",
    "quantity",
    "subTotal",
    "delete"
  ];
  displayedColumnstwo: string[] = ["image", "product", "three", "delete"];
  dataSource: MatTableDataSource<ShoppingCartsItem> = new MatTableDataSource(
    []
  );
  tempCartListObject: any = [];

  public unSubscribeSubject = new Subject();

  public breadcrumbList: breadcrumb[] = [
    { title: "home", link: "/" },
    { title: "Cart", link: "/cart" }
  ];

  public customer = new Customer();
  public isGuest = true;

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private cartStore: CartStoreService,
    public dialog: MatDialog,
    private router: Router,
    private appService: AppService,
    private customerStore: CustomerStoreService,
    private authService: AuthService,
    private notificationHandler: NotificationHandlerService
  ) {}

  ngOnInit() {
    this.cart = this.route.snapshot.data.cart;
    this.tempCartListObject = this.cart.shopping_carts.map(item => {
      return this.setUpProductAttributes(item);
    });
    this.dataSource = new MatTableDataSource(this.tempCartListObject);
    this.total = this.cart.shopping_carts.reduce((acc, cur) => {
      return acc + cur.quantity;
    }, 0);
    const self = this;
    setTimeout(() => {
      if (self.appService.isBrowser) {
        window.scrollTo(0, 0);
      }
    }, 500);

    this.cartStore.orderTotalUpdated
    .pipe(takeUntil(this.unSubscribeSubject))
    .subscribe(item => {
      this.orderTotal = item;
      if (this.appService.isBrowser) {
        window.scrollTo(0, 0);
      }
    });

    this.authService.getCustomer().subscribe(noop);
    this.customer = this.customerStore.customer;
    if (!this.customer) {
      this.customer = new Customer();
      this.customer.isActive = false;
      this.customer.role_ids = [];
    }
    this.isGuest = Boolean(this.customer.role_ids.find(item => item === 4));
    this.customerStore.customerUpdated.subscribe(res => {
      this.customer = res;
      if (!this.customer) {
        this.customer = new Customer();
        this.customer.isActive = false;
        this.customer.role_ids = [];
      }
      this.isGuest = Boolean(this.customer.role_ids.find(item => item === 4));
    });

    this.cartService.cartLoading
      .pipe(takeUntil(this.unSubscribeSubject))
      .subscribe(response => {
        this.cartLoading = response;
        if (!response) {
          this.cart = this.cartStore.getCart();
          this.tempCartListObject = this.cart.shopping_carts.map(item => {
            return this.setUpProductAttributes(item);
          });
          this.dataSource = new MatTableDataSource([
            ...this.tempCartListObject
          ]);
          this.total = this.cart.shopping_carts.reduce((acc, cur) => {
            return acc + cur.quantity;
          }, 0);
          if (this.appService.isBrowser) {
            window.scrollTo(0, 0);
          }
        }
      });

    this.cartStore.cartQuanityUpdated.subscribe(value => {
      this.cart = this.cartStore.getCart();
      this.tempCartListObject = this.cart.shopping_carts.map(item => {
        return this.setUpProductAttributes(item);
      });
      this.dataSource = new MatTableDataSource([...this.tempCartListObject]);
      this.total = this.cart.shopping_carts.reduce((acc, cur) => {
        return acc + cur.quantity;
      }, 0);
    });
    if (this.appService.isBrowser) {
      window.scrollTo(0, 0);
    }
  }

  checkoutAnalytics() {
    if (this.orderTotal.orderTotals.SubTotal === "₹ 0") {
      this.showStudError();
      return;
    }
    this.cartService
      .getCartItemCategories()
      .subscribe((value: { List: string[] }) => {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          event: "checkout",
          ecommerce: {
            checkout: {
              actionField: { step: 1, option: "Checkout" },
              products: this.cart.shopping_carts.map((item, index) => {
                return {
                  id: item.product_id,
                  name: item.product.name,
                  price: item.product.price_model.price_without_formatting,
                  quantity: item.quantity.toString(),
                  category: value.List[index]
                };
              })
            }
          }
        });
        if (this.isGuest) {
          this.customerStore.isCheckout = true;
          this.router.navigate(["/auth/login"], {
            queryParams: { returnUrl: "/cart", type: 2 }
          });
          return;
        }
        this.router.navigate(["/checkout"]);
      });
  }

  updateCartItem(cartItemData: {
    id: string;
    productId: string;
    quantity: number;
    attributesSelected: { id: number; value: string }[];
  }) {
    const data = {
      gift_card_attributes: null,
      product_id: parseInt(cartItemData.productId, 10),
      cart_type_id: 1,
      cart_item_id: parseInt(cartItemData.id, 10),
      quantity: cartItemData.quantity,
      updatecartitem: true,
      attributes: cartItemData.attributesSelected,
      customer_entered_price: 0
    };
    this.cartLoading = true;
    this.cartService
      .pushCart(data)
      .subscribe((response: ShoppingCartRootObject) => {
        if (!Object.prototype.hasOwnProperty.call(response, "Error")) {
          this.cart = response;
          this.total = this.cart.shopping_carts.reduce((acc, cur) => {
            return acc + cur.quantity;
          }, 0);
          this.cartLoading = false;
        }
      });
  }

  removeItem(id) {
    this.cartLoading = true;
    this.cartService
      .removeProduct(id)
      .subscribe((response: ShoppingCartRootObject) => {
        this.cart = response;
        this.total = this.cart.shopping_carts.reduce((acc, cur) => {
          return acc + cur.quantity;
        }, 0);
        this.cartLoading = false;
      });
  }

  setUpProductAttributes(input: ShoppingCartsItem) {
    const attributes = [];
    const customizationAttributes = [];
    if (input.product_attributes && input.product_attributes.length > 0) {
      input.product_attributes.forEach(item => {
        const foundItem = input.product.attributes.find(
          item2 => item2.id === item.id
        );
        if (
          foundItem &&
          foundItem.attribute_control_type_name !== "ImageSquares"
        ) {
          if (foundItem.attribute_control_type_name === "TextBox") {
            if (
              foundItem.product_attribute_name.indexOf("Customization") !== -1
            ) {
              customizationAttributes.push({
                ...foundItem,
                textBoxInput: item.value,
                active: false,
                attributeInputSelected: null
              });
            } else {
              if (
                foundItem.product_attribute_name.substring(0, 11) !==
                "Association"
              ) {
                attributes.push({
                  ...foundItem,
                  textBoxInput: item.value,
                  active: false,
                  attributeInputSelected: null
                });
              }
            }
          } else {
            const preSelected =
              foundItem.attribute_values.find(
                attributeValue => attributeValue.id.toString() === item.value
              ) || foundItem.attribute_values[0];

            if (
              foundItem.product_attribute_name.indexOf("Customization") !== -1
            ) {
              customizationAttributes.push({
                ...foundItem,
                textBoxInput: "",
                active: false,
                attributeInputSelected: this.prepareFontList(preSelected)
              });
            } else {
              if (
                foundItem.product_attribute_name.substring(0, 11) !==
                "Association"
              ) {
                attributes.push({
                  ...foundItem,
                  textBoxInput: "",
                  active: false,
                  attributeInputSelected: preSelected
                });
              }
            }
          }
        }
      });
    }
    let ImageCartItem = attributes.find(
      it => it.attributeInputSelected.product_image_id
    );
    if (ImageCartItem) {
      this.cartService
        .getProductImageById(
          ImageCartItem.attributeInputSelected.product_image_id
        )
        .subscribe(res => {
          this.dataSource = new MatTableDataSource([
            ...this.tempCartListObject.map((item: ShoppingCartsItem) => {
              if (item.id === input.id) {
                return {
                  ...item,
                  product: { ...item.product, images: [new Image(res)] }
                };
              }
              return item;
            })
          ]);
        });
    }
    return {
      ...input,
      attributes,
      customizationAttributes,
      product: {
        ...input.product,
        images: input.product.images.filter(a => a.position < 1)
      }
    };
  }

  prepareFontList(item: AttributeValue) {
    const indexOfUrlToken = item.name.indexOf("$");
    if (indexOfUrlToken !== -1) {
      item.name = item.name.substring(0, indexOfUrlToken);
      return item;
    }
    return item;
  }

  decreaseQuantity(item: ShoppingCartsItem) {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.update({ ...item, id: "0", quantity: -1 });
    }
  }

  increaseQuantity(item: ShoppingCartsItem) {
    item.quantity += 1;
    this.update({ ...item, id: "0", quantity: 1 });
  }

  showStudError() {
    const data = new NotificationsEntity();
    data.notification_id = "default_5";
    data.url = "/";
    data.heading = "You can not place order without adding additional products(other than stud) in cart.";
    data.content =  "";
    this.notificationHandler.newNotification.next(data);
  }

  changeProductAttribute(attr: any, item: ShoppingCartsItem) {
    const newItem = this.changeAttribute(attr, item);
    this.update(newItem);
    if (attr.attributeInputSelected.product_image_id) {
      this.cartService
        .getProductImageById(attr.attributeInputSelected.product_image_id)
        .subscribe(result => {
          this.dataSource = new MatTableDataSource([
            ...this.tempCartListObject.map((res: ShoppingCartsItem) => {
              if (item.id === res.id) {
                return {
                  ...res,
                  product: { ...res.product, images: [new Image(result)] }
                };
              }
              return res;
            })
          ]);
        });
    }
  }

  changeAttribute(attr: any, item: ShoppingCartsItem) {
    let found = item.product_attributes.find(it => it.id === attr.id);
    if (found) {
      return {
        ...item,
        product_attributes: item.product_attributes.map(a => {
          if (a.id === attr.id) {
            return { ...a, value: attr.attributeInputSelected.id.toString() };
          } else {
            return a;
          }
        })
      };
    } else {
      return {
        ...item,
        product_attributes: [
          ...item.product_attributes,
          { id: attr.id, value: attr.attributeInputSelected.id.toString() }
        ]
      };
    }
  }

  update(item: ShoppingCartsItem) {
    const updateCartItemObject: any = {};
    updateCartItemObject.id = item.id;
    updateCartItemObject.productId = item.product.id;
    updateCartItemObject.quantity = item.quantity;
    updateCartItemObject.attributesSelected = item.product_attributes;
    this.updateCartItem(updateCartItemObject);
  }

  ngOnDestroy() {
    this.unSubscribeSubject.next();
    this.unSubscribeSubject.complete();
  }
}
