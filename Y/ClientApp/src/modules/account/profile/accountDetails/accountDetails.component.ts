import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { ProfileService } from '../profile.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { GdprPopUpComponent } from './gdprPopUp/gdprPopUp.component';
import { EditDetailsComponent } from './editDetails/editDetails.component';
import { AuthService } from 'src/services/auth.service';
import { AppService } from 'src/services/app.service';
import { VerifyCustomerComponent } from 'src/modules/customerVerfication/verifyCustomer/verifyCustomer.component';

@Component({
  selector: 'app-accountdetails',
  templateUrl: './accountDetails.component.html',
  styleUrls: ['./accountDetails.component.scss']
})
export class AccountDetailsComponent implements OnDestroy, OnInit {
  public myData;
  public showChangeAccountDetails;
  public subscription;
  public newsletter= false;
  public creditsLoading = true;
  public orderLoading = true;

  public lastOrder: any;
  public myRewardpoints: { points: number };

  public dataLoading = true;
  public baseUrl = '';

  public showGDPRResponse: string;
  public fbDisabled = false;
  public googleDisabled = false;
  constructor(
    private authService: AuthService,
    private appService: AppService,
    private profileService: ProfileService,
    private router: Router,
    public dialog: MatDialog,
    @Inject('BASE_API_URL')
    origin: string
  ) {
    this.baseUrl = origin ? origin : '';
  }

  ngOnInit() {
    this.appService.loader.next(true);
    this.profileService.myDetailsSubject.subscribe(value => {
      this.myData = value;
      if (this.myData && this.myData.first_name) {
        this.dataLoading = false;
        if (this.myData.associatedExternalAuthRecords.length > 0) {
          this.fbDisabled = this.myData.associatedExternalAuthRecords.some(
            it => it.AuthMethodName === 'Facebook authentication'
          );
          this.googleDisabled = this.myData.associatedExternalAuthRecords.some(
            it => it.AuthMethodName === 'Google authentication'
          );
        }
        this.newsletter = this.myData.subscribed_to_newsletter;
        this.appService.loader.next(false);
      } else {
        this.profileService.fetchAccountDetails();
      }
    });
    this.authService.logoutSubject.subscribe(value => {
      if (value) {
        this.router.navigate(['/']);
      }
    });
    this.subscription = this.profileService.editProfileSubject.subscribe(
      value => {
        if (value) {
          this.profileService.fetchAccountDetails();
          this.showChangeAccountDetails = false;
        }
      }
    );
    this.profileService.getMyOrders(1, 1).subscribe(res => {
      if ((res as any).orders) {
        if ((res as any).orders.length > 0) {
          this.lastOrder = (res as any).orders[0];
        }
        this.orderLoading = false;
      }
    });
    this.profileService.getRewardPoints().subscribe(res => {
      this.myRewardpoints = res;
      this.creditsLoading = false;
    });
  }
  UpdateNewLetter(eventValue: boolean) {
    this.profileService.UpdateNewLetter(eventValue)
    .subscribe(res => {
      // console.log('update newLetter Status');
     // console.log(res);
    });
  }
  removeExternalAssociation(id) {
    this.profileService.removeExternalAssociation(id);
  }

  gdprAction() {
    const dialogRef = this.dialog.open(GdprPopUpComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.success) {
        if (result.action === 1) {
          this.exportData();
        } else if (result.action === 2) {
          this.deleteAccount();
        }
      }
    });
  }

  verify() {
    const dialogRef = this.dialog.open(VerifyCustomerComponent, {
      width: '250px',
      data: { customer: this.myData }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.success) {
        this.profileService.fetchAccountDetails();
      }
    });
  }

  editProfile() {
    const dialogRef = this.dialog.open(EditDetailsComponent, {
      width: '300px',
      data: { customer: this.myData }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  deleteAccount() {
    this.profileService.deleteAccount();
    this.profileService.deleteAccountSubject.subscribe(value => {
      this.showGDPRResponse = value.Result;
    });
  }

  exportData() {
    this.profileService.exportData();
  }

  changeAccountDetailsShow() {
    this.showChangeAccountDetails = true;
  }

  handleNavigationClick(url: string) {
    url = this.appService.baseUrl + url + encodeURI(this.appService.baseUrl + 'api/handleExternalAuth');
    window.location.href = url;
  }

  syncRouteParameters() {
    const index = this.router.url.indexOf('?');
    const currentUrl =
      index !== -1 ? this.router.url.substring(0, index) : this.router.url;
    if (currentUrl === '/account/verifyAccount') {
      this.verify();
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
