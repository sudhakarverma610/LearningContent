import {
  Component,
  OnInit,
  OnDestroy,
  Optional,
  Inject,
  ElementRef
} from "@angular/core";
import {
  APP_BASE_HREF,
  Location,
  LocationStrategy,
  PathLocationStrategy
} from "@angular/common";
import { Product, ProductDTO } from 'src/store/products/products.model';
import { GiftCard } from 'src/store/products/giftCard.class';
import { Subject, noop } from 'rxjs';
import { breadcrumb } from 'src/modules/shared/breadcrumb/breadcrumb.model';
import { GiftCardService } from '../giftCard.service';
import { AppService } from 'src/services/app.service';
import { AuthService } from 'src/services/auth.service';
import { CartService } from 'src/services/cart.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MetaService } from 'src/services/meta.service';
import { CategoriesListModel } from 'src/store/categories/categories.model';
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-giftcarddetails",
  templateUrl: "./giftCardDetails.component.html",
  styleUrls: ["./giftCardDetails.component.scss"],
  providers: [
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy }
  ]
})
export class GiftCardDetailsComponent implements OnInit, OnDestroy {
  public product: Product;
  public giftCard: any={};
  public giftCardSlug: string;
  public giftCardCategorySlug: string;
  public _selectedPrice="other";
  data: [CategoriesListModel, Product];
  public get selectedPrice() {
    return this._selectedPrice;
  }
  public set selectedPrice(input) {
    this._selectedPrice = input;
    if (input === "other") {
      const self = this;
      setTimeout(() => {
        const invalidControl = self.el.nativeElement.querySelector(
          "#form_item_quantity"
        );
        if (invalidControl) {
          invalidControl.focus();
        }
      }, 500);
    }
  }
  public quantity = 1;
  public subject = "";
  public total = 0;

  public first_name: string;
  public last_name: string;
  public email: string;

  public senderFirstName: string;
  public senderLastName: string;
  public senderEmail: string;
  public SenderEmailNotValid = false;
  public ReciverEmailNotValid = false;
  public EmailNotValidMsg = "Provided email is not valid";
 
  public priceLimiters: any[];
  public selectionActive = false;

  public requiredFieldLogin = false;
  public fieldsRequiredMissing = "Required Fields are missing";

  public viewTemplate = false;
  public previewTemplate;

  public inputPrice = 500;
  public priceMoreThanMsg = "Amount should be more than or equal to 500.";
  public priceMoreThanMsgShow = false;

  public unsubscribeSubject: Subject<string> = new Subject();
  public loginUnsubscribeSubject: Subject<string> = new Subject();

  public showAddedToBag = false;
  public addToCartSuccessMsg = "Added to bag with success.";
  public addToCartFailureMsg = "The Product is out of stock.";
  public addToCartReply = this.addToCartSuccessMsg;

  public breadcrumbList: breadcrumb[] = [
    { title: "Home", link: "/" },
    { title: "Gift Cards", link: "/gift-voucher" },
    { title: "", link: "" },
    { title: "", link: "" }
  ];
  public baseUrl = "";
  public location: Location;
  public list=[]; 
  public dataSource:[{category:string;items:[]}];
 // public giftCardForm:FormGroup=new FormGroup({});
  constructor(
    private giftCardService: GiftCardService,
    private appService: AppService,
    private authService: AuthService,
    private cartService: CartService,
    private el: ElementRef,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router,
    private metaService: MetaService,
    location: Location,
    @Optional()
    @Inject(APP_BASE_HREF)
    origin: string
  ) {
    this.baseUrl = origin ? origin : "";
    this.location = location;
  }
  ngOnInit() {
    // this.giftCardForm = new FormGroup({
    //   friendName: new FormControl(this.first_name, Validators.compose([
    //     Validators.required
    //   ])),
    //   friendLastName: new FormControl(this.last_name, Validators.compose([
    //     Validators.required
    //   ])),
    //   friendEmail: new FormControl(this.email, 
    //     Validators.compose([
    //       Validators.required,
    //       Validators.email,
    //       Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{1,50}$')
    //     ])),
    //     aboutYouName: new FormControl(this.senderFirstName, Validators.compose([
    //       Validators.required
    //     ])),
    //     aboutYouLastName: new FormControl(this.senderLastName,  Validators.compose([
    //       Validators.required
    //     ])),
    //     aboutYouEmail: new FormControl(this.senderEmail, 
    //       Validators.compose([
    //         Validators.required,
    //         Validators.email,
    //         Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{1,50}$')
    //       ])) 
    // });
    this.viewTemplate = false;
    this.appService.loader.next(true);
    // get category slug from route params
    ///this.route.params.subscribe(value => {
      // this.giftCardSlug = value.product;
      // this.giftCardCategorySlug = value.category;
      // this.breadcrumbList[2] = {
      //   title: value.category,
      //   link: "/gift-voucher/" + value.category
      // };
      // this.breadcrumbList[3] = {
      //   title: value.product,
      //   link: "/gift-voucher/" + value.category + "/" + value.product
      // };
      //this.init();
   // });
    this.InitAllGift();
   // this.init();
    this.authService.getCustomer().subscribe(noop);
    this.appService.loader.next(false);
  }
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  setMetaData() {
    this.metaService.setMeta(
      this.product.meta_title,
      this.product.meta_description,
      this.product.meta_keywords,
      this.baseUrl + this.location.path(),
      this.product.images[0].src
    );
  }

  InitAllGift(){
    this.getCate().collections.forEach(value=>{
      this.giftCardService.getProductsFromCategorySlug(value.se_name).subscribe(res=>{
        this.list.push({id:value.id,name:value.name,se_name:value.se_name,products:res.products}); 
      }); 
      
    });  
  }
  getCate(){
    const result: CategoriesListModel = this.route.snapshot.data.giftCards;
    const cat = result.categories.find(
      item1 => item1.se_name === 'gift-voucher'
    );
    return cat;
  } 
  getProductData(category,product,isId){
    this.giftCardService.getProductData(
      category,
      product,
      isId
    ).subscribe(res=>{
      this.data=res;
    });
  }
  init() { 
    this.product = this.data[1];
    this.setMetaData();
    this.giftCard = new GiftCard(this.product);
    this.giftCard.src = this.product.images[1]
      ? this.product.images[1].src
      : "";

    if (!this.giftCard) {
      this.router.navigate(["/", "gift-voucher"]);
    } else {
      this.appService.loader.next(false);
    }

    this.giftCardService.getPriceLimits().subscribe((value: any) => {
      if (value.limits) {
        value.limits.trim();
        const tempArray = value.limits.split(",");
        this.priceLimiters = tempArray.map(item => {
          item.trim();
          return parseInt(item, 10);
        });
        this.priceLimiters.push("other");
        this.syncPriceLimiters();
      }
    });
  }

  syncPriceLimiters() {
    if (this.giftCard && this.priceLimiters[0]) {
      this.selectedPrice = this.priceLimiters[0];
    }
  }

  giftCardPreview() {
    this.requiredFieldLogin = false;
    this.ReciverEmailNotValid = false;
    this.priceMoreThanMsgShow = false;
    const data = this.dataValidation();
    if (data) {
      this.appService.loader.next(true);
      this.giftCardService
        .getGiftCardEmailPreview(data)
        .subscribe((value: any) => {
          if (value.template) {
            this.previewTemplate = this.sanitizer.bypassSecurityTrustHtml(
              value.template
            );
            //this.viewTemplate = true;
            this.prepareCartAndNavigateToDeliveryOptions();
            this.appService.loader.next(false);
            window.scrollTo(0, 0);
          }
        });
    }
  }

  validateEmail(email) {
    // tslint:disable-next-line:max-line-length
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  dataValidation() {
    if (
      this.first_name &&
      this.last_name &&
      this.email &&
      this.senderFirstName &&
      this.senderLastName &&
      this.senderEmail &&
      this.quantity
    ) {
      if  (!this.validateEmail(this.email)) {
        this.ReciverEmailNotValid = true;
      }
      if (!this.validateEmail(this.senderEmail)) {
        this.SenderEmailNotValid = true;
      }
      if (this.ReciverEmailNotValid || this.SenderEmailNotValid) {
        return null;
      }
      if (
        this.validateEmail(this.email) &&
        this.validateEmail(this.senderEmail)
      ) {
        const data = {
          firstName: this.first_name,
          lastName: this.last_name,
          email: this.email,
          senderFirstName: this.senderFirstName,
          senderLastName: this.senderLastName,
          senderEmail: this.senderEmail,
          quantity: this.quantity,
          subject: this.subject ? this.subject : "",
          useLoggedInData: false,
          customerEnteredPrice: 0,
          product: {
            name: this.giftCard.title,
            image_src: this.giftCard.src,
            customerEntersPrice: this.giftCard.isCustomerEnteredPrice
          }
        };
        if (this.giftCard.isCustomerEnteredPrice) {
          data.customerEnteredPrice =
            this.selectedPrice === "other"
              ? this.inputPrice
              : this.selectedPrice as any;
          if (this.selectedPrice === "other" && this.inputPrice < 500) {
            this.priceMoreThanMsgShow = true;
            return null;
          }
        } else {
          data.customerEnteredPrice = this.giftCard.price;
        }
        return data;
      } else {
        return null;
      }
    } else {
      this.requiredFieldLogin = true;
      return null;
    }
  }

  prepareCartAndNavigateToDeliveryOptions() {
    this.requiredFieldLogin = false;
    this.ReciverEmailNotValid = false;
    this.priceMoreThanMsgShow = false;
    if(!this.dataValidation()||!this.product){
      return;
    }
    const data = {
      reciever_email: this.email,
      reciever_name: this.first_name + " " + this.last_name,
      sender_email: this.senderEmail,
      sender_name: this.senderFirstName + " " + this.senderLastName,
      message: this.subject ? this.subject : "",
      customer_entered_price:
        this.selectedPrice === "other" ? this.inputPrice : this.selectedPrice,
      quantity: this.quantity
    };
    this.giftCard = new GiftCard(this.product);
    this.cartService
      .addToCart(this.product, [], data)
      .subscribe((result: any) => {
        if (!Object.prototype.hasOwnProperty.call(result, "Error")) {
          const product = result.shopping_carts.find(item => {
            return item.product.id === this.giftCard.id.toString();
          });

          if (product) {
            this.addToCartReply = this.addToCartSuccessMsg;
            this.router.navigate(["/cart"]);
          } else {
            this.addToCartReply = "The product is out of stock.";
          }
        } else {
          this.addToCartReply = result.Error;
        }
        this.showAddedToBag = true;
        setTimeout(() => {
          this.showAddedToBag = false;
        }, 4000);
      });
  }
  back() {
    this.location.back();
  }
  ngOnDestroy() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }
}
