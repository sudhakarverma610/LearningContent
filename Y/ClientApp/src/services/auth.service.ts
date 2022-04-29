import { Injectable, Optional, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject, Observable, of } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { map, catchError } from 'rxjs/operators';
import { APP_BASE_HREF } from '@angular/common';
import { CLIENT_CREDENTIALS } from './clientCreds';
import { Customer } from 'src/store/Customer/customer.model';
import { noop } from 'rxjs';
import { Router } from '@angular/router';
import { CustomerStoreService } from 'src/store/customerStore.service';
import { AppService } from './app.service';
import { StoreService } from 'src/store/store.service';
import { StatusCodeService } from './statusCode.service';

const httpOptions = {
  headers: new HttpHeaders({
    accept: 'application/json'
  })
};

const TOKEN_KEY = makeStateKey('token');

@Injectable()
export class AuthService {
  private _customerStatus: any;
  public loginStatusSet = false;
  public loginStatusSetByResolver = false;
  public baseUrl = '';
  public loginStatusSubject: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );
  public logoutSubject: Subject<boolean> = new Subject();
  public forgotPasswordErrorSubject: Subject<string> = new Subject();
  public verifyOtpErrorSubject: Subject<string> = new Subject();
  public verifyOtpSubject: Subject<object> = new Subject();
  public resendOtpErrorSubject: Subject<string> = new Subject();
  public resendOtpSubject: Subject<object> = new Subject();
  public sendOtpErrorSubject: Subject<string> = new Subject();
  public sendOtpSubject: Subject<object> = new Subject();
  public forgotPasswordSubject: Subject<boolean> = new Subject();
  public loginPromptMsg; // variable to store the message shown when login panier is opened
  public loginPromptMsg2; // another variable to store the message shown when login panier is opened
  public clientCredentials; // variable to store the client credentials for API calls
  public isNotificationDone: BehaviorSubject<boolean> = new BehaviorSubject(
    true
  );
  constructor(
    private http: HttpClient,
    private appService: AppService,
    private store: StoreService,
    private state: TransferState,
    private router: Router,
    private customerStore: CustomerStoreService,
    private statusCodeService: StatusCodeService,
    @Optional()
    @Inject(CLIENT_CREDENTIALS)
    clientCredentials: string,
    @Inject('BASE_API_URL') baseUrl: string
  ) {
    this.baseUrl = baseUrl;
    // subscribe to the global store and sets the login status based on it
    this.store.loginStatusSubject.subscribe(value => {
      this.loginStatusSubject.next(value);
    });
    this.clientCredentials = clientCredentials;
    this.loginStatusSubject.subscribe(value => {
      if (this.loginStatusSet && !this.loginStatusSetByResolver) {
        this.getCustomer().subscribe(res => {});
      } else {
        this.loginStatusSet = true;
        if (this.loginStatusSetByResolver) {
          this.loginStatusSetByResolver = false;
        }
      }
    });
  }

  login(email, password, mobileNumber = null, receivedOtp = null) {
    const data = {
      Email: email,
      Password: password,
      mobile: mobileNumber,
      receivedOtp
    };
    return this.http.post(`/api/login`, data);
  }

  logout() {
    this.http.post('/api/logout', null).subscribe(response => {
      delete window.localStorage.emailid; // deletes the emailid saved in localstorage
      this.logoutSubject.next(true); // sets the current logout state to be true
      this.store.logout(); // sets the login state in global store as false
    });
  }

  signUp(data) {
    return this.http.post(`/api/register`, data);
  }

  forgotPassword(email) {
    const data = { Email: email };
    this.http.post(`/api/forgotpassword`, data).subscribe(response => {
      if (response.hasOwnProperty('error')) {
        this.forgotPasswordErrorSubject.next((response as any).error);
      } else {
        this.forgotPasswordSubject.next(true);
      }
    });
  }

  verifyReferralLink(timeStamp) {
    return this.http.get(`/api/verifyReferralLink/` + timeStamp);
  }

  verifyOtp(data) {
    // const data = { otp: otp };
    this.http.post(`/api/verify_otp`, data).subscribe(response => {
      console.log('verified response');
      console.log((response as any).type);
      if ((response as any).type == 'error') {
        this.verifyOtpSubject.next(response);
      } else {
        this.verifyOtpSubject.next(response);
      }
    });
  }

  resendOtp(data) {
    // const data = {  };
    this.http.post(`/api/resend_otp`, data).subscribe(response => {
      console.log('resend response');
      console.log(response);
      if ((response as any).type === 'error') {
        this.resendOtpSubject.next(response);
      } else {
        this.resendOtpSubject.next(response);
      }
    });
  }

  sendOtp(data) {
    // const data = {};
    this.http.post(`/api/send_otp`, data).subscribe(response => {
      console.log('send response');
      console.log(response);
      if ((response as any).type == 'error') {
        this.sendOtpSubject.next(response);
      } else {
        this.sendOtpSubject.next(response);
      }
    });
  }

  passwordRecoveryValidation(
    token: string,
    guid: string
  ): Observable<{ success: boolean; error: string }> {
    return this.http.get<{ success: boolean; error: string }>(
      `/api/passwordRecoveryValidation?token=${token}&guid=${guid}`
    );
  }

  resetPassword(
    password: string,
    token: string,
    guid: string
  ): Observable<{ success: boolean; error: string }> {
    return this.http.get<{ success: boolean; error: string }>(
      `/api/resetPassword?password=${password}&token=${token}&guid=${guid}`
    );
  }

  customerStatus() {
    // if (this._customerStatus) {
    //   return of(this._customerStatus);
    // } else {
      return this.http
      .get<{
        id: number;
        email: string;
        isGuest: boolean;
        isActive: boolean;
        isRegisterred: boolean;
        banner: string;
        view: boolean;
        masoomView: boolean;
        masoomText: string;
        displayName: string;
      }>('/api/customerStatus')
      .pipe(
        map(
          (item: {
            id: number;
            email: string;
            isGuest: boolean;
            isActive: boolean;
            isRegisterred: boolean;
            banner: string;
            view: boolean;
            masoomView: boolean;
            masoomText: string;
            displayName: string;
          }) => {
            this.store.showDiscount.next({ banner: item.banner, view: item.view });
            this.store.showMasoom.next({ masoomView: item.masoomView, masoomText: item.masoomText });
            this.customerStore.setCustomerStatus(item);
            if (this.isNotificationDone.value) {
              this.isNotificationDone.next(false);
            }
            this._customerStatus = item;
            return item;
          }
        )
      );
   // }
  }

  getCustomer(): Observable<{ customers: Customer[] }> {
    return this.http.get<{ customers: Customer[] }>('/api/me').pipe(
      map((item: { customers: Customer[] }) => {
        this.customerStore.setCustomer(item.customers[0]);
        this.customerStatus().subscribe((res) => {
          item.customers[0].isActive = res.isActive;
        });
       // this.customerStatus().subscribe(noop);
        if (item.customers[0] && this.isNotificationDone.value) {
          this.isNotificationDone.next(false);
        }
        return item;
      })
    );
  }

  removeCustomerCookies() {
    return this.http.post('/api/logout', null);
  }

  editProfile(data) {
    return this.http.put('/api/editcustomer', data).pipe(
      map(value => {
        this.getCustomer().subscribe(noop);
        return true;
      })
    );
  }

  reAuth() {
    return this.customerStatus().pipe(
      map(item => {
        if (item.isRegisterred) {
          this.store.loginStatus = true;
          this.store.setLoginToken();
        } else {
          this.store.loginStatus = false;
          this.loginStatusSubject.next(false);
          this.removeCustomerCookies().subscribe(noop);
        }
        return item;
      })
    );
  }
}
