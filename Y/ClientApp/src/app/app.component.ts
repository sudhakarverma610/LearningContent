import { Component } from '@angular/core';
import {
  RouterEvent,
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';
import { MatDialog } from '@angular/material/dialog';
import { CustomerStoreService } from 'src/store/customerStore.service';
import { AppService } from 'src/services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public loading; // variable to store the state of Company logo (Loading screen)
  public loaderMsg; // variable to store the value of Message shown on the loading screen
  public mtcAssociationSent = false;
  constructor(
    private router: Router,
    private customerStoreSerice: CustomerStoreService,
    angulartics2GoogleTagManager: Angulartics2GoogleTagManager,
    private appService: AppService,
    private matDialog: MatDialog
  ) {
    this.router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event); // for initiating loading acreen untill the next page is loaded
    });
    if (this.appService.isBrowser) {
      angulartics2GoogleTagManager.startTracking(); // GTM Initialization
      angulartics2GoogleTagManager.setUsername(
        window.localStorage.getItem('userId')
      );
      this.appService.loader.subscribe(value => {
        // To change the state of loading screen based on Subject calls made by components
        this.loaderMsg = this.appService.loaderMsg;
        this.loading = value;
      });
      this.appService.resizeHomePage(); // initialize the dimension variable based on the user browser and screen
      this.appService.screenSizeProperty();
    }
  }

  // Shows and hides the loading spinner during RouterEvent changes
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart && event.id > 2) {
      this.appService.loaderMsg = '';
      this.loaderMsg = '';
      this.loading = true;
      this.matDialog.closeAll();
      if (this.appService.isBrowser) {
        try {
          if (
            this.customerStoreSerice.customer &&
            this.customerStoreSerice.customer.email
          ) {
            (window as any).mt('send', 'pageview', {
              email: this.customerStoreSerice.customer.email
            });
          } else {
            (window as any).mt('send', 'pageview', {});
          }
          const self = this;
          window.document.addEventListener('mauticPageEventDelivered', function (e) {
            setTimeout(() => {
              if (!self.mtcAssociationSent && self.customerStoreSerice.customerStatus.isGuest) {
                self.appService.sendMtcAssociation();
                self.mtcAssociationSent = true;
              }
            }, 500);
          });
        } catch (e) { }
        window.scrollTo(0, 0);
      }
    }
    if (event instanceof NavigationEnd) {
      this.loading = false;
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.loading = false;
    }
    if (event instanceof NavigationError) {
      this.loading = false;
    }
  }
}
