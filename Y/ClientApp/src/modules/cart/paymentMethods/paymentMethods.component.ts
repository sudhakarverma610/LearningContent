import {
  Component,
  OnInit,
  OnDestroy,
  Input
} from "@angular/core";
import { CartService } from "../../../services/cart.service";
import { PaymentMethod } from "src/store/cart/paymentMethods.model";
import {
  PreOrderPushDTO,
  PreOrderResponseDTO
} from "src/store/cart/order.model";
import { SafeHtml } from '@angular/platform-browser';
import { OrderTotalRootObject } from 'src/store/cart/ShoppingCart.model';
import { Customer } from 'src/store/Customer/customer.model';
import { CustomerStoreService } from 'src/store/customerStore.service';
import { CartStoreService } from 'src/store/cartStore.service';
import { Router } from '@angular/router';
import { AppService } from 'src/services/app.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/services/auth.service';
import { of } from 'rxjs';
import { NotificationsEntity } from 'src/modules/notification/notification.service';
import { NotificationHandlerService } from 'src/modules/notification/notification.handle.service';

export class CardInfo {
  cardNumber: number;
  cardHolderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvvNumber: number;
  expiry: string;

  /**
   *
   */
  constructor() {}
}

@Component({
  selector: "app-payment-methods",
  templateUrl: "./paymentMethods.component.html",
  styleUrls: ["./paymentMethods.component.scss"]
})
export class PaymentMethodsComponent implements OnInit, OnDestroy {
  gpayScriptLoaded = false;
  debitCard: CardInfo = new CardInfo();
  creditCard: CardInfo = new CardInfo();
  vpa: string;
  netBanking: string;
  validation: {
    cardNumber: boolean;
    cardHolderName: boolean;
    expiryMonth: boolean;
    expiryYear: boolean;
    cvvNumber: boolean;
    expiry: boolean;
    vpa: boolean;
    netBanking: boolean;
  } = {
    cardNumber: false,
    cardHolderName: false,
    expiryMonth: false,
    expiryYear: false,
    cvvNumber: false,
    expiry: false,
    vpa: false,
    netBanking: false
  };

  public selectedMethod;
  public banks: {
    title: string;
    value: { value: string; name: string }[];
  }[] = [
    {
      title: "",
      value: [
        { value: "HDFB", name: "HDFC Bank" },
        { value: "ICIB", name: "ICICI Bank" },
        { value: "AXIB", name: "AXIS Bank NetBanking" }
      ]
    },
    {
      title: "more banks",
      value: [
        { value: "AIRNB", name: "Airtel Payments Bank" },
        { value: "ADBB", name: "Andhra Bank" },
        { value: "BOIB", name: "Bank of India" },
        { value: "BOMB", name: "Bank of Maharashtra" },
        { value: "CABB", name: "Canara Bank" },
        { value: "CSBN", name: "Catholic Syrian Bank" },
        { value: "CBIB", name: "Central Bank Of India" },
        { value: "CRPB", name: "Corporation Bank" },
        { value: "CSMSNB", name: "Cosmos Bank" },
        { value: "DCBB", name: "DCB Bank" },
        { value: "DENN", name: "Dena Bank" },
        { value: "DSHB", name: "Deutsche Bank" },
        { value: "DLSB", name: "Dhanlaxmi Bank" },
        { value: "FEDB", name: "Federal Bank" },
        { value: "IDBB", name: "IDBI Bank" },
        { value: "IDFCNB", name: "IDFC Netbanking" },
        { value: "INDB", name: "Indian Bank " },
        { value: "INOB", name: "Indian Overseas Bank" },
        { value: "INIB", name: "IndusInd Bank" },
        { value: "JAKB", name: "Jammu and Kashmir Bank" },
        { value: "JSBNB", name: "Janata Sahakari Bank Pune" },
        { value: "KRKB", name: "Karnataka Bank" },
        { value: "KRVBC", name: "Karur Vysya - Corporate Netbanking" },
        { value: "KRVB", name: "Karur Vysya - Retail Netbanking" },
        { value: "162B", name: "Kotak Mahindra Bank" },
        { value: "LVCB", name: "Lakshmi Vilas Bank - Corporate Netbanking" },
        { value: "LVRB", name: "Lakshmi Vilas Bank - Retail Netbanking" },
        { value: "OBCB", name: "Oriental Bank of Commerce" },
        {
          value: "PMNB",
          name: "Punjab And Maharashtra Co-operative Bank Limited"
        },
        { value: "PSBNB", name: "Punjab And Sind Bank" },
        { value: "CPNB", name: " Punjab National Bank - Corporate Banking" },
        { value: "PNBB", name: "Punjab National Bank - Retail Banking" },
        { value: "SRSWT", name: "Saraswat Bank" },
        { value: "SVCNB", name: "Shamrao Vithal Co-operative Bank Ltd." },
        { value: "SOIB", name: "South Indian Bank" },
        { value: "SYNDB", name: "Syndicate Bank" },
        { value: "TMBB", name: "Tamilnad Mercantile Bank" },
        { value: "BHNB", name: "The Bharat Co-op. Bank Ltd" },
        { value: "TBON", name: "The Nainital Bank" },
        { value: "UCOB", name: "UCO Bank" },
        { value: "UBIBC", name: "Union Bank - Corporate Netbanking" },
        { value: "UBIB", name: "Union Bank - Retail Netbanking" },
        { value: "UNIB", name: "United Bank Of India" },
        { value: "VJYB", name: "Vijaya Bank" }
      ]
    }
  ];

  @Input()
  public paymentMethods: PaymentMethod[] = [];

  public selectedPayments = new PaymentMethod();
  public paymentView: SafeHtml = "";

  public paymentViewLoading = false;
  public paymentMethodNotAvailableMsg =
    "Selected Payment Method is not available at your address. Please Change your address";
  public CODAvailable = true;
  public errorMsg = false;
  public orderTotal: OrderTotalRootObject = new OrderTotalRootObject();
  public orderDone = false;
  public orderId = null;

  selectedPaymentsSystemname: string;

  pushableData: {
    pg: string;
    ccnum: string;
    ccname: string;
    ccvv: string;
    ccexpmon: string;
    ccexpyr: string;
    VPA: string;
    bankcode: string;
  };

  public customer = new Customer();
  public isGuest = true;

  public mobile_number: string;
  public verificationError: string;
  public showVerificationError: boolean;
  public verificationStep = 1;
  public otp: string;

  public giftCardInCart = false;
  public isGpayMobileWorks = false;

  constructor(
    private cartService: CartService,
    private customerStore: CustomerStoreService,
    private cartStore: CartStoreService,
    private router: Router,
    private notificationHandler: NotificationHandlerService,
    private appService: AppService,
    public dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.cartStore.getCart();
    this.orderTotal = this.cartStore.orderTotal;
    if (this.orderTotal.orderTotals.RequiresShipping) {
      this.giftCardInCart = false;
    } else {
      this.giftCardInCart = true;
    }
    this.cartStore.orderTotalUpdated.subscribe((item: OrderTotalRootObject) => {
      this.orderTotal = item;
      if (item.orderTotals.RequiresShipping) {
        this.giftCardInCart = false;
      } else {
        this.giftCardInCart = true;
      }
    });
    this.customer = this.customerStore.customer;
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
    this.checkIfGpayMobileWorks().then(res => {
      this.isGpayMobileWorks = res;
    });
  }

  sendOtp() {
    const data: any = {
      email: "",
      mobile: this.mobile_number
    };
    if(data.mobile){
      this.authService.sendOtp(data);
      this.authService.sendOtpSubject.subscribe(response => {
        if ((response as any).type === "success") {
          this.verificationStep = 2;
          this.verificationError = "OTP has been Sent";
          this.showVerificationError = true;
        } else {
          this.verificationError = (response as any).message;
          this.showVerificationError = true;
        }
      });
    }else{
      this.verificationStep = 1;
      this.verificationError = "Please Provide Mobile Number";
      this.showVerificationError = true;
    }
   
  }

  verifyOtp() {
    const data: any = {
      email: this.customer.email,
      otp: this.otp,
      mobile: this.mobile_number
    };
    if(!data.otp){
        this.verificationStep = 2;
        this.verificationError = "Please Provide OTP";
        this.showVerificationError = true;
    }else{
      this.authService.verifyOtp(data);
      this.authService.verifyOtpSubject.subscribe(response => {
        if (
          (response as any).type === "success" ||
          (response as any).message === "already_verified"
        ) {
          this.authService.getCustomer().subscribe(result => {
            this.customer = result.customers[0];
            this.isGuest = Boolean(
              this.customer.role_ids.find(item => item === 4)
            );
          });
        } else {
          if ((response as any).message === "otp_not_verified") {
            this.verificationError = "Please check the entered otp.";
          } else {
            this.verificationError = (response as any).message;
          }
          this.showVerificationError = true;
        }
      });
    }
  
  }

  validatePaymentMethod(): boolean {
    this.validation = {
      cardNumber: false,
      cardHolderName: false,
      expiryMonth: false,
      expiryYear: false,
      cvvNumber: false,
      expiry: false,
      vpa: false,
      netBanking: false
    };
    if (this.selectedMethod === 1) {
      return true;
    } else if (this.selectedMethod === 2) {
      let counter = 0;
      if (!this.debitCard.cardHolderName) {
        this.validation.cardHolderName = true;
        counter++;
      }
      if (!this.debitCard.cvvNumber) {
        this.validation.cvvNumber = true;
        counter++;
      }
      if (!this.debitCard.cardNumber) {
        this.validation.cardNumber = true;
        counter++;
      }
      if (!this.debitCard.expiry) {
        this.validation.expiry = true;
        counter++;
      }
      if (!this.debitCard.expiry) {
        this.validation.expiry = true;
        counter++;
      } else {
        const temp = this.debitCard.expiry.split("/");
        if (
          !temp[0] ||
          temp[0].length !== 2 ||
          isNaN(Number(temp[0])) ||
          !temp[1] ||
          temp[1].length !== 2 ||
          isNaN(Number(temp[1]))
        ) {
          this.validation.expiry = true;
          counter++;
        }
        if (counter === 0) {
          this.pushableData = {
            pg: "DC",
            ccnum: this.debitCard.cardNumber.toString(),
            ccname: this.debitCard.cardHolderName,
            ccvv: this.debitCard.cvvNumber.toString(),
            ccexpmon: temp[0],
            ccexpyr: "20" + temp[1],
            VPA: undefined,
            bankcode: undefined
          };
          return true;
        }
      }
      return false;
    } else if (this.selectedMethod === 3) {
      let counter = 0;
      if (!this.creditCard.cardHolderName) {
        this.validation.cardHolderName = true;
        counter++;
      }
      if (!this.creditCard.cvvNumber) {
        this.validation.cvvNumber = true;
        counter++;
      }
      if (
        !this.creditCard.cardNumber ||
        !this.validateCreditCardNo(this.creditCard.cardNumber)
      ) {
        this.validation.cardNumber = true;
        counter++;
      }
      if (!this.creditCard.expiry) {
        this.validation.expiry = true;
        counter++;
      }
      if (!this.creditCard.expiry) {
        this.validation.expiry = true;
        counter++;
      } else {
        const temp = this.creditCard.expiry.split("/");
        if (
          !temp[0] ||
          temp[0].length !== 2 ||
          isNaN(Number(temp[0])) ||
          !temp[1] ||
          temp[1].length !== 2 ||
          isNaN(Number(temp[1]))
        ) {
          this.validation.expiry = true;
          counter++;
        }
        if (counter === 0) {
          this.pushableData = {
            pg: "CC",
            ccnum: this.creditCard.cardNumber.toString(),
            ccname: this.creditCard.cardHolderName,
            ccvv: this.creditCard.cvvNumber.toString(),
            ccexpmon: temp[0],
            ccexpyr: "20" + temp[1],
            VPA: undefined,
            bankcode: undefined
          };
          return true;
        }
      }
      return false;
    } else if (this.selectedMethod === 4) {
      if (this.netBanking) {
        this.pushableData = {
          pg: "NB",
          ccnum: undefined,
          ccname: undefined,
          ccvv: undefined,
          ccexpmon: undefined,
          ccexpyr: undefined,
          VPA: undefined,
          bankcode: this.netBanking
        };
        return true;
      }
      this.validation.netBanking = true;
      return false;
    } else if (this.selectedMethod === 5) {
      if (this.vpa) {
        this.pushableData = {
          pg: "UPI",
          ccnum: undefined,
          ccname: undefined,
          ccvv: undefined,
          ccexpmon: undefined,
          ccexpyr: undefined,
          VPA: this.vpa,
          bankcode: "UPI"
        };
        return true;
      }
      this.validation.vpa = true;
      return false;
    } else if (this.selectedMethod === 6) {
      const mobileGpay = this.isGpayMobileWorks;
      if (this.vpa || mobileGpay) {
        this.pushableData = {
          pg: "UPI",
          ccnum: undefined,
          ccname: undefined,
          ccvv: undefined,
          ccexpmon: undefined,
          ccexpyr: undefined,
          VPA: mobileGpay ? "temp" : this.vpa,
          bankcode: "TEZ"
        };
        return true;
      }
      this.validation.vpa = true;
      return false;
    } else if (this.selectedMethod === 7) {
      if (this.vpa) {
        this.pushableData = {
          pg: "Cash",
          ccnum: undefined,
          ccname: undefined,
          ccvv: undefined,
          ccexpmon: undefined,
          ccexpyr: undefined,
          VPA: this.vpa,
          bankcode: "AMXPAY"
        };
        return true;
      }
      this.validation.vpa = true;
      return false;
    } else if (this.selectedMethod === 8) {
      if (this.vpa) {
        this.pushableData = {
          pg: "Cash",
          ccnum: undefined,
          ccname: undefined,
          ccvv: undefined,
          ccexpmon: undefined,
          ccexpyr: undefined,
          VPA: this.vpa,
          bankcode: "Phonepe"
        };
        return true;
      }
      this.validation.vpa = true;
      return false;
    }
    return false;
  }

  // to check credit card validity
  checkLuhn(cardNo) {
    let s = 0;
    let doubleDigit = false;
    for (let i = cardNo.length - 1; i >= 0; i--) {
      let digit = +cardNo[i];
      if (doubleDigit) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      s += digit;
      doubleDigit = !doubleDigit;
    }
    return s % 10 == 0;
  }

  //valid creditCard
  validateCreditCardNo(input) {
    let no = input.toString();
    return no && this.checkLuhn(no);
  }

  maxLength(type: number, max: number) {
    if (type === 1) {
      this.debitCard.cardNumber =
        this.debitCard.cardNumber.toString().length > max
          ? parseInt(this.debitCard.cardNumber.toString().slice(0, max), 10)
          : this.debitCard.cardNumber;
    } else if (type === 2) {
      this.creditCard.cardNumber =
        this.creditCard.cardNumber.toString().length > max
          ? parseInt(this.creditCard.cardNumber.toString().slice(0, max), 10)
          : this.creditCard.cardNumber;
    }
  }

  induceSlash(type: number) {
    if (type === 1) {
      this.debitCard.expiry =
        this.debitCard.expiry.length === 2
          ? this.debitCard.expiry + "/"
          : this.debitCard.expiry;
    } else if (type === 2) {
      this.creditCard.expiry =
        this.creditCard.expiry.length === 2
          ? this.creditCard.expiry + "/"
          : this.creditCard.expiry;
    }
  }

  selectPaymentMethod() {
    if (this.validatePaymentMethod()) {
      this.paymentView = "";
      this.cartStore.setPaymentMethod(this.selectedPayments);
      if (this.selectedPayments.skipPaymentInfo) {
        this.CODAvailable = this.customerStore.CashOnDeliveryStatus;
        this.selectedPaymentsSystemname = "Payments.CashOnDelivery";
      } else if (this.selectedMethod > 1) {
        this.selectedPaymentsSystemname =
          this.selectedMethod === 6
            ? this.vpa
              ? "Payments.Payu"
              : "Payments.Gpay"
            : "Payments.Payu";
      } else {
        this.selectedPaymentsSystemname = "Payments.CashOnDelivery";
      }
      this.fetchPaymentView();
    }
  }

  showError(error: string) {
    const data = new NotificationsEntity();
    data.notification_id = "default_2";
    data.url = "/";
    data.heading = error;
    data.content =  "";
    this.notificationHandler.newNotification.next(data);
  }

  checkIfGpayMobileWorks() {
    if (!(window as any).PaymentRequest) {
      console.log("Web payments are not supported in this browser.");
      return of(false).toPromise();
    }
    var request = this.createGpayRequest(
      Math.floor(100000 + Math.random() * 900000),
      this.orderTotal.orderTotals.total
    );
    if (!request) {
      console.log("null request.");
      return of(false).toPromise();
    }
    return this.checkCanMakePayment(request);
  }

  fetchPaymentView() {
    this.errorMsg = false;
    if (
      this.selectedPaymentsSystemname === "Payments.CashOnDelivery" &&
      !this.customer.isActive
    ) {
      this.paymentMethodNotAvailableMsg =
        "You are not eligible for COD since you are not verified customer. Please verify your account.";
      this.errorMsg = true;
      return;
    }
    const data: PreOrderPushDTO = {
      billing_id: this.customerStore.getCustomer().billing_address.id,
      shipping_id: this.customerStore.getCustomer().shipping_address.id,
      payment_name: this.selectedPaymentsSystemname,
      order_attributes: this.cartStore.getOrderAttributes()
    };
    this.paymentViewLoading = true;
    this.cartService
      .postPrePaymentOrderData(data)
      .subscribe((value: PreOrderResponseDTO) => {
        try {
          this.sendGTMTag(this.selectedPaymentsSystemname);
        } catch (err) {}
        this.paymentViewLoading = false;
        this.errorMsg = false;
        this.appService.loaderMsg = "Do not press back or refresh button";
        this.appService.loader.next(true);
        if (value.hasOwnProperty("error") && value.error) {
          this.appService.loader.next(false);
          this.showError(value.error);
        } else if (value.orderComplete) {
          this.cartService.confirmOrder().subscribe((result: any) => {
            if (result.status === "Order Confirmed") {
              this.router.navigate(["/orderplacementsuccess"]);
            } else if (result.status === "In Process") {
              //this.orderDone = true;
              this.orderId = result.orderId;
              var request = this.createGpayRequest(
                result.orderId,
                this.orderTotal.orderTotals.total
              );
              this.showPaymentUI(request);
            } else if (result["redirect"] != null) {
              window.location.assign(result["redirect"]);
            } else {
              this.router.navigate(["/orderplacementfailure"]);
            }
          });
        } else if (value.paymentInfoNeeded) {
          if (!value.form) {
            this.errorMsg = true;
          } else {
            this.cartService
              .pushOrder(this.pushableData)
              .subscribe((res: any) => {
                if (res.status === "Order Confirmed") {
                  this.router.navigate(["/orderplacementsuccess"]);
                } else if (res["redirect"] != null) {
                  window.location.assign(res["redirect"]);
                } else {
                  this.router.navigate(["/orderplacementfailure"]);
                }
              });
          }
        } else if (value.error && value.error.length > 0) {
          this.paymentMethodNotAvailableMsg = value.error;
          this.errorMsg = true;
        } else {
          this.paymentMethodNotAvailableMsg =
            "There is an error while fetching the payment methods. Please contact the Administrator";
          this.errorMsg = true;
        }
      });
  }

  sendGTMTag(method: string) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "eec.checkout_option",
      ecommerce: {
        checkout_option: {
          actionField: {
            step: 3,
            option: method
          }
        }
      }
    });
  }

  createGpayRequest(trId: number, orderTotal: string) {
    // Create supported payment method.
    const supportedInstruments = [
      {
        supportedMethods: ["https://tez.google.com/pay"],
        data: {
          pa: "9810230784@okbizaxis",
          pn: "Y Jewelry",
          tr: trId.toString(), // Your custom transaction reference ID
          url: this.appService.baseUrl,
          mc: "5094", //Your merchant category code
          tn: "Purchase in Merchant"
        }
      }
    ];

    // Create order detail data.
    const details = {
      total: {
        label: "Total",
        amount: {
          currency: "INR",
          value: orderTotal // sample amount
        }
      },
      displayItems: [
        {
          label: "Original Amount",
          amount: {
            currency: "INR",
            value: orderTotal
          }
        }
      ]
    };

    // Create payment request object.
    let request = null;
    try {
      request = new PaymentRequest(supportedInstruments, details);
    } catch (e) {
      console.log("Payment Request Error: " + e.message);
      return;
    }
    if (!request) {
      console.log("Web payments are not supported in this browser.");
      return;
    }

    return request;
  }

  checkCanMakePayment(request) {
    // Check canMakePayment cache, use cache result directly if it exists.
    if (sessionStorage.hasOwnProperty("canMakePaymentCache")) {
      return Promise.resolve(JSON.parse(sessionStorage["canMakePaymentCache"]));
    }

    // If canMakePayment() isn't available, default to assume the method is
    // supported.
    var canMakePaymentPromise = Promise.resolve(true);

    // Feature detect canMakePayment().
    if (request.canMakePayment) {
      console.log(request.canMakePayment);
      canMakePaymentPromise = request.canMakePayment();
    }

    return canMakePaymentPromise
      .then(result => {
        // Store the result in cache for future usage.
        sessionStorage["canMakePaymentCache"] = result;
        return result;
      })
      .catch(err => {
        console.log("Error calling canMakePayment: " + err);
      });
  }

  showPaymentUI(request) {
    // Set payment timeout.
    let paymentTimeout = window.setTimeout(function() {
      window.clearTimeout(paymentTimeout);
      request
        .abort()
        .then(function() {
          console.log("Payment timed out after 20 minutes.");
          this.router.navigate(["/orderplacementfailure"]);
        })
        .catch(function() {
          console.log("Unable to abort, user is in the process of paying.");
        });
    }, 5 * 60 * 1000); /* 5 minutes */

    const self = this;
    request
      .show()
      .then(function(instrument) {
        console.log(instrument);
        window.clearTimeout(paymentTimeout);
        self.appService.loader.next(true);
        self.cartService
          .processResponse(instrument)
          .subscribe(result => {
            if (result.success) {
              self.appService.loader.next(false);
              self.router.navigate(["/orderplacementsuccess"]);
            } else {
              self.router.navigate(["/orderplacementfailure"]);
            }
          });
      })
      .catch(function(err) {
        console.log(err);
        self.router.navigate(["/orderplacementfailure"]);
      });
  }

  ngOnDestroy() {
    if (this.orderDone) {
      if (this.orderId) {
        this.router.navigate(["/retryPayment", this.orderId]);
      } else {
        this.router.navigate(["/"]);
      }
    }
  }
}
