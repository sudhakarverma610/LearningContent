import { Component, OnInit, OnDestroy,
  AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryModel } from 'src/store/categories/categories.model';
import { Subject } from 'rxjs';
import { CommunityChainService } from '../communityChain.service';
import { AuthService } from 'src/services/auth.service';
import { AppService } from 'src/services/app.service';
import { CategoryStoreService } from 'src/store/categoriesStore.service';
import { MetaService } from 'src/services/meta.service';
import { takeUntil } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
declare let $: any;

declare global {
  interface Window {
    lottie: any;
  }
}

@Component({
  selector: 'app-communitychainbanner',
  templateUrl: './communityChainBanner.component.html',
  styleUrls: ['./communityChainBanner.component.scss']
})
export class CommunityChainBannerComponent
  implements OnInit, OnDestroy, AfterViewChecked {
  public fieldsRequiredMissing = 'Please add email Ids to send the invite';
  public EmailNotValidMsg = 'Email is not valid';
  public InviteSentMsg = 'Mail Sent';

  public requiredFieldLogin = false;
  public EmailNotValid = false;
  public inviteSent = false;

  public category: CategoryModel;
  public url = '';
  public urlDecoded = '';

  public linkCopied = false;
  public loggedIn = false;

  public unsubscribeSubject: Subject<string> = new Subject();

  public intro = false;

  public animation = false;
  public frmasrc: any;
  constructor(
    private router: Router,
    private communityChainService: CommunityChainService,
    private authService: AuthService,
    public appService: AppService,
    private categoryStore: CategoryStoreService,
    private metaService: MetaService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.url = this.appService.baseUrl;
    this.frmasrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.appService.baseUrl +  'data.html ');

    this.urlDecoded = this.appService.baseUrl;
    this.appService.loader.next(false);
    this.authService.loginStatusSubject
      .pipe(takeUntil(this.unsubscribeSubject))
      .subscribe(value => {
        this.loggedIn = value;
      });
    this.metaService.setMeta(
      'Chain of Care | Y Jewelry',
      // tslint:disable-next-line: max-line-length
      'Convert your network into cash, Just as each charm adds to your chain of joy, add your friends and family to your Chain of Care! Add your friends and family to the Y family. Let them find their favourites.',
      'Chain of Care',
      this.appService.baseUrl + 'chain-of-charms',
      'https://files.y.jewelry/assets/img/metaImage.jpeg'
    );
    this.category = this.categoryStore.getCategoryBySlug('chain-of-charms');
    this.communityChainService
      .getCommunityChainLink()
      .subscribe((value: any) => {
        if (Object.prototype.hasOwnProperty.call(value, 'success')) {
          this.urlDecoded = value.success;
          if (this.appService.isBrowser) {
            this.url = encodeURIComponent(value.success);
          }
        } else if (Object.prototype.hasOwnProperty.call(value, 'error')) {
          console.log(value.error);
        }
      });
    this.updateScript();
  }

  updateScript() {
    const self = this;
    if (this.appService.isBrowser) {
      // tslint:disable-next-line: only-arrow-functions
      const interval = setInterval(function() {
        const tempNode = document.getElementById('accordion1');
        if (tempNode) {
          try {
            ($('#accordion1') as any).accordion();
            clearInterval(interval);
          } catch (err) {
            //
          }
        }
      }, 500);
    }
  }

  ngAfterViewChecked() {
  }

  openLoginPanier() {
    this.router.navigate(['/auth', 'login'], {
      queryParams: { returnUrl: '/chain-of-charms', type: 2 }
    });
  }

  copyLink() {
    if (this.appService.isBrowser) {
      this.ngCopy(this.urlDecoded);
      const self = this;

      setTimeout(() => {
        self.linkCopied = false;
      }, 2000);
    }
  }

  openMessenger() {
    if (this.appService.isBrowser) {
      window.open(
        // tslint:disable-next-line:max-line-length
        `fb-messenger://share/?link=Hey%2C%20sign%20up%20for%20the%20y.jewelry%20Referral%20Program%20and%20convert%20your%20network%20to%20Cash.%20Start%20here%3A%20${this.url}`
      );
    }
  }

  ngCopy(str) {
    if (this.appService.isBrowser) {
      const el = document.createElement('textarea');
      el.value = str;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      this.linkCopied = true;
    }
  }

  ngOnDestroy() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }
}
