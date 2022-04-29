import {
  Component,
  OnInit,
  AfterViewInit,
  AfterContentChecked
} from '@angular/core';
import { AppService } from 'src/services/app.service';
import { FooterService, SocialLinks, DeliveryStatus } from './footer.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent
  implements OnInit, AfterViewInit, AfterContentChecked {
  public openInfo = false;
  public openLegals = false;
  customOptions: any = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 3
      },
      940: {
        items: 3
      }
    },
    nav: false
  };

  public slidesStore = [
    {
      id: '1',
      text1: '100% secured payments',
      text2:
        'take your time, shop safely and securely. All transaction processed on our website are secured by PayU.',
      src: 'https://files.y.jewelry/assets/img/Security.svg'
    },
    {
      id: '2',
      text1: 'fast delivery',
      text2:
        'Place an order today, before 1pm and be sure to receive your order in 48 hours.',
      src: 'https://files.y.jewelry/assets/img/Fast-delivery.svg'
    },
    {
      id: '3',
      text1: 'do you have a question',
      text2:
        'We would be glad to help! Feel free to contact us at contact@y.jewelry',
      src: 'https://files.y.jewelry/assets/img/Question.svg'
    }
  ];

  public pincode;
  public postalCodeInput = true;
  public cashOnDeliveryStatus;
  public prepaidDeliveryStatus;
  public deliveryNotAvailable = false;
  public subscriptionMailId;
  public APIResponseMsg;
  public APIResponse = false;

  public socialLinks: SocialLinks = {
    facebook: '',
    instegram: '',
    pinterest: '',
    twitter: '',
    roposo: ''
  };

  public desktop = false;
  public companyName = 'Ripops India Jewellery Pvt Ltd';
  public companyAddress = 'Gurgaon';
  public telphone = '0124-2380003';
  public whatsApp = '9810230784';
  public email = 'contact@y.jewelry';
  constructor(
    private appService: AppService,
    private sharedService: FooterService
  ) {}

  ngOnInit() {
    this.sharedService.getSocialLinks().subscribe((response: SocialLinks) => {
      this.socialLinks = response;
    });
    this.sharedService.getCurrentStore().subscribe(res => {
      this.companyName = res.company_name ? res.company_name : this.companyName;
      const phones = res.company_phone_number.split(',');
      this.telphone = phones[0] ? phones[0] : this.telphone;
      this.whatsApp = phones[1] ? phones[1] : this.whatsApp;
      this.email = res.email ? res.email : this.email;
      this.companyAddress = res.company_address ? res.company_address : this.companyAddress;
    });
    this.desktop = false;
  }

  ngAfterViewInit() {
    if (this.appService.isBrowser) {
      this.desktop = true;
    }
  }

  ngAfterContentChecked() {
    if (this.appService.isBrowser) {
    }
  }

  moveUp() {
    if (this.appService.isBrowser) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }
  scrollTop() {
    window.scroll(0, 0);
  }

  checkPostalCode() {
    this.postalCodeInput = true;
    this.cashOnDeliveryStatus = false;
    this.prepaidDeliveryStatus = false;
    this.deliveryNotAvailable = false;
    if (this.pincode != null) {
      this.sharedService
        .getDeliveryStatus(this.pincode)
        .subscribe((value: DeliveryStatus) => {
          if (value) {
            this.postalCodeInput = false;
            this.pincode = null;
            if (
              value &&
              value.ETailExpressPrePaidAirInbound &&
              value.ETailExpressPrePaidAirInbound.toLowerCase() === 'yes'
            ) {
              this.prepaidDeliveryStatus = true;
            } else {
              this.prepaidDeliveryStatus = false;
            }

            if (
              value.ETailExpressCODAirInbound &&
              value.ETailExpressCODAirInbound.toLowerCase() === 'yes'
            ) {
              this.cashOnDeliveryStatus = true;
            } else {
              this.cashOnDeliveryStatus = false;
            }

            if (!this.prepaidDeliveryStatus && !this.cashOnDeliveryStatus) {
              this.deliveryNotAvailable = true;
            }
          }
        });
    }
  }

  validateEmail(email) {
    // tslint:disable-next-line:max-line-length
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  subscribe() {
    this.APIResponse = false;
    if (
      this.subscriptionMailId &&
      this.subscriptionMailId != null &&
      this.validateEmail(this.subscriptionMailId)
    ) {
      this.sharedService
        .subscribeToNewsletters(this.subscriptionMailId)
        .subscribe((value: any) => {
          this.APIResponseMsg = value.message;
          this.APIResponse = true;
          this.subscriptionMailId = undefined;
        });
    } else {
      this.APIResponseMsg = 'Please enter a valid email ID.';
      this.APIResponse = true;
    }
  }
}
