import {
  Component,
  OnInit,
  OnDestroy,
  Optional,
  Inject
} from '@angular/core';
import { ForgotPasswordComponent } from './forgotPassword/forgotPassword.component';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
  FormControl,
  ValidationErrors
} from '@angular/forms';
import { StoreService } from 'src/store/store.service';
import { AuthService } from 'src/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/modules/shared/shared.service';
import { AppService } from 'src/services/app.service';
import { MetaService } from 'src/services/meta.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomerStoreService } from 'src/store/customerStore.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginAccountShow = true;
  public otpVerificationShow = false;
  public otpSendShow = false;
  public isOpenAccount;
  public createAccountShow = false;
  public forgotAccountShow1 = true;
  public forgotAccountShow2 = false;
  public forgotAccountError = false;
  public requiredFieldLogin;
  public LoginIncorrectMsgShow;
  public LoginIncorrectMsgShow1;
  public fieldsRequiredMissing = 'Required fields are missing';
  public LoginIncorrectMsg = 'Incorrect email or password';
  public LoginIncorrectMsg1 = 'Incorrect email or password';
  public EmailIncorrect = 'Invalid email address';
  public MotDePasseNotEqualMsg = 'Passwords do not match';
  public AccountRegisteredMsg = 'Registration is Complete. Please Login!';

  public errorSignUp = false;
  public requiredFieldSignUp;
  public emailIncorrectFieldSignUp;
  public mdpNotEqualFieldSignUp;
  public AccountRegisteredShow = false;

  public requiredFieldForgot;
  public invalidEmailFieldForgot;

  public Email;
  public savedEmail;
  public Password;
  public gender = 'G';

  public emailSignUp;
  public passwordSignUp;
  public cPasswordSignUp;
  public firstName;
  public lastName;

  public sendMessageShow = false;
  public sendMessage;

  public verifyMessageShow = false;
  public verifyMessage;

  public resendOtpMessageShow = false;
  public resendOtpMessage;

  public otp;
  public mobile;
  public emailOtp;
  public mobile_number;
  public mobileLogin = false;
  public mobileLoginOtp = false;
  public mobileNumberRequired = false;

  public forgotPasswordInput;

  public currentUrl;
  public referralStatus = false;
  public referredBy;
  public timeStampForReferral;

  public loginPromptMsg;
  public loginPromptMsg2;
  public referredByUser;

  public step = 1;

  public isCheckout = false;
  public errors;

  public showPassword = false;
  public baseUrl = '';
  public form: FormGroup = new FormGroup({});
  public showPassword1 = false;
  public showPassword2 = false;

  constructor(
    private store: StoreService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private appService: AppService,
    private metaService: MetaService,
    public dialog: MatDialog,
    private customerStore: CustomerStoreService,
    @Optional()
    @Inject('BASE_API_URL')
    origin: string
  ) {
    this.baseUrl = origin ? origin : '';
    this.route.queryParams.subscribe(params => {
      this.referredBy = params['referredBy'];
      this.errors = params['errors'];
      if (this.errors && this.errors !== ',') {
        window.alert(this.errors);
      }
      this.timeStampForReferral = params['v'];
      if (this.timeStampForReferral) {
        this.authService
          .verifyReferralLink(this.timeStampForReferral)
          .subscribe((value: any) => {
            if (Object.prototype.hasOwnProperty.call(value, 'errors')) {
              this.mdpNotEqualFieldSignUp = true;
              this.MotDePasseNotEqualMsg = value.errors[0];
            }
          });
      }
      if (this.referredBy) {
        this.referralStatus = true;
        this.sharedService
          .getUserByGUID(this.referredBy)
          .subscribe((value: any) => {
            if (Object.prototype.hasOwnProperty.call(value, 'customers')) {
              this.referredByUser = value.customers[0];
            }
          });
      }
    });
    this.isCheckout = this.customerStore.isCheckout;
    this.form = this.fb.group({
      first_name: [null, Validators.required],
      last_name: [null, Validators.required],
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{1,50}$')
        ])
      ],
      gender: ['G'],
      mobile: [
        null,
        Validators.compose([
          Validators.minLength(10),
          Validators.maxLength(13),
          Validators.required
        ])
      ],
      password: [null, Validators.compose([Validators.required])],
      cPassword: [
        null,
        Validators.compose([this.formValidator(), Validators.required])
      ]
    });
  }

  get isValid(): boolean {
    if (!this.form.valid) {
      this.validateAllFormFields(this.form);
      return false;
    }

    return true;
  }

  formValidator(): ValidatorFn {
    return (control: FormControl): ValidationErrors | null => {
      const errors: ValidationErrors = {};
      const password = this.form.get('password');
      const cPassword = this.form.get('cPassword');
      if (cPassword && password) {
        if (cPassword.value !== password.value) {
          errors.password = {
            message: 'Password does not match. Please Re Enter the values.'
          };
        }
      }

      return Object.keys(errors).length ? errors : null;
    };
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
  removeIsCheckout() {
    this.customerStore.isCheckout = false;
  }
  ngOnInit() {
    this.syncRouteParameters();
    this.metaService.setMeta(
      'Login | Y Jewelry',
      'Shop 925 sterling silver jewelry like charms, bracelets, neckchains, hoops, online. 100% Secure Payments. Fast Delivery. Order now.',
      'Sterling Silver Jewelry, Silver Jewellery, 925 Sterling Silver, Gold Plated Jewellery, Rose Gold Plated Jewelery',
      this.appService.baseUrl + 'login',
      'https://files.y.jewelry/assets/img/metaImage.jpeg'
    );
    if (this.appService.isBrowser) {
      this.emailSignUp = window.localStorage.emailid;
    }
    this.loginPromptMsg = this.authService.loginPromptMsg;
    this.loginPromptMsg2 = this.authService.loginPromptMsg2;
  }
  forgotPassword() {
    const dialogRef = this.dialog.open(ForgotPasswordComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {});
  }
  loginBtn() {
    if (this.Email === undefined || this.Password === undefined) {
      if (this.route.snapshot.queryParams.authType === 'external') {
        this.authService.reAuth().subscribe(res => {
          this.setUpLoginState({}, false);
        });
      }
      this.requiredFieldLogin = true;
    } else {
      this.requiredFieldLogin = false;
      this.authService
        .login(this.Email, this.Password)
        .subscribe((response: any) => {
          if (response.hasOwnProperty('errors')) {
            if (response.errors.error) {
              this.LoginIncorrectMsg1 = response.errors.error[0];
            } else {
              this.LoginIncorrectMsg1 = response.errors[0];
            }
            this.LoginIncorrectMsgShow1 = true;
          } else if (response.hasOwnProperty('access_token')) {
            this.setUpLoginState(response);
          } else {
            this.LoginIncorrectMsg1 =
              'Something Went Wrong. We are working on it. (Please refresh the browser window and try Again.)';
            this.LoginIncorrectMsgShow1 = true;
          }
        });
    }
  }

  signUpBtn() {
    if (this.isValid) {
      this.mobileLogin = false;
      this.requiredFieldSignUp = false;
      let data: any = {
        FirstName: this.form.get('first_name').value,
        LastName: this.form.get('last_name').value,
        Email: this.form.get('email').value,
        gender: this.form.get('gender').value,
        Phone: this.form.get('mobile').value,
        Password: this.form.get('password').value
      };
      this.Email = data.Email;
      this.Password = data.Password;
      if (this.referralStatus) {
        data.referredBy = this.referredBy;
        data.v = this.timeStampForReferral;
      }
      this.authService.signUp(data).subscribe((response: any) => {
        if (response.registered) {
          this.loginBtn();
        } else if (Object.prototype.hasOwnProperty.call(response, 'errors')) {
          if (response.errors.error) {
            this.MotDePasseNotEqualMsg = response.errors.error[0];
          } else {
            this.MotDePasseNotEqualMsg = response.errors[0];
          }
          this.mdpNotEqualFieldSignUp = true;
        }
      });
    }
  }

  setUpLoginState(loginResponse, tokenSetupNeeded = true) {
    if (tokenSetupNeeded) {
      this.store.setLoginToken();
    }
    if (this.route.snapshot.queryParams.returnUrl) {
      if (this.route.snapshot.queryParams.type == 2) {
        this.router.navigate([this.route.snapshot.queryParams.returnUrl]);
        return;
      }
      if (this.route.snapshot.queryParams.returnUrl === '/admin') {
        const newUrl = this.baseUrl + '/admin';
        window.location.href = newUrl;
      } else {
        this.router.navigateByUrl(
          this.baseUrl +
            decodeURIComponent(this.route.snapshot.queryParams.returnUrl)
        );
      }
    }
  }

  validateEmail(email) {
    // tslint:disable-next-line:max-line-length
    const re = /^(([^<>()[\]\\.,;:\s@\']+(\.[^<>()[\]\\.,;:\s@\']+)*)|(\'.+\'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  ForgotPasswordShowBtn2() {
    if (this.forgotPasswordInput == null || this.forgotPasswordInput === '') {
      this.requiredFieldForgot = true;
      this.invalidEmailFieldForgot = false;
      return false;
    } else {
      // tslint:disable-next-line:max-line-length
      const re = /^(([^<>()[\]\\.,;:\s@\']+(\.[^<>()[\]\\.,;:\s@\']+)*)|(\'.+\'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (re.test(this.forgotPasswordInput)) {
        this.authService.forgotPassword(this.forgotPasswordInput);
        const subsciption1 = this.authService.forgotPasswordErrorSubject.subscribe(
          error => {
            this.requiredFieldForgot = false;
            this.invalidEmailFieldForgot = true;
            subsciption1.unsubscribe();
          }
        );
        const subsciption2 = this.authService.forgotPasswordSubject.subscribe(
          value => {
            if (value) {
              this.forgotAccountShow2 = true;
              this.forgotAccountShow1 = false;
              subsciption2.unsubscribe();
            }
          }
        );
      } else {
        this.requiredFieldForgot = false;
        this.invalidEmailFieldForgot = true;
        return false;
      }
    }
  }

  verifyOtp() {
    if (this.mobileLogin) {
      if (this.otp === undefined) {
        this.requiredFieldLogin = true;
        return;
      } else {
        this.requiredFieldLogin = false;
        this.authService
          .login(this.Email, this.Password, this.mobile_number, this.otp)
          .subscribe((response: any) => {
            if (response.hasOwnProperty('errors')) {
              if (response.errors.error) {
                this.LoginIncorrectMsg = response.errors.error[0];
              } else {
                this.LoginIncorrectMsg = response.errors[0];
              }
              this.LoginIncorrectMsgShow = true;
            } else if (response.hasOwnProperty('access_token')) {
              this.mobileLogin = false;
              this.setUpLoginState(response);
              this.authService.reAuth();
            } else {
              this.LoginIncorrectMsg =
                'Something Went Wrong. We are working on it. (Please refresh the browser window and try Again.)';
              this.LoginIncorrectMsgShow = true;
            }
          });
      }
      return;
    }
    const data: any = {
      email: this.savedEmail || this.emailSignUp,
      otp: this.otp,
      mobile: this.mobile
    };
    this.authService.verifyOtp(data);
    this.authService.verifyOtpSubject.subscribe(response => {
      if (
        (response as any).type === 'success' ||
        (response as any).message === 'already_verified'
      ) {
        this.savedEmail = (response as any).email;
        this.otpVerificationShow = false;
        this.loginAccountShow = true;
        this.loginBtn();
      } else {
        this.verifyMessageShow = true;
        if ((response as any).message === 'otp_not_verified') {
          this.verifyMessage = 'Please check the entered otp.';
        } else {
          this.verifyMessage = (response as any).message;
        }
      }
    });
  }

  resendOtp() {
    const data: any = {
      email: this.savedEmail || this.emailSignUp
    };
    this.authService.resendOtp(data);
    this.authService.resendOtpSubject.subscribe(response => {
      if ((response as any).message === 'otp_sent_successfully') {
        this.verifyMessageShow = true;
        this.verifyMessage = 'Otp send to your registered mobile number.';
      } else {
        this.verifyMessageShow = true;
        this.verifyMessage = (response as any).message;
      }

      if ((response as any).type === 'success') {
        this.savedEmail = (response as any).email;
      }
    });
  }
  sendOtp() {
    const data: any = {
      email: this.Email,
      mobile: this.mobile_number
    };

    this.authService.sendOtp(data);
    this.authService.sendOtpSubject.subscribe(response => {
      if ((response as any).type === 'success') {
        this.savedEmail = (response as any).email;
      } else {
        this.sendMessageShow = true;
        this.sendMessage = (response as any).message;
      }
    });
  }

  handleNavigationClick(url: string) {
    url = this.route.snapshot.queryParams.returnUrl
      ? this.appService.baseUrl +
        url +  + encodeURI(this.appService.baseUrl + 'api/handleExternalAuth') +
        '%3FreturnUrl%3D' +
        encodeURIComponent(this.route.snapshot.queryParams.returnUrl)
      : this.appService.baseUrl + url + encodeURI(this.appService.baseUrl + 'api/handleExternalAuth');
    window.location.href = url;
  }

  syncRouteParameters() {
    let index = this.router.url.indexOf('?');
    this.currentUrl =
      index !== -1 ? this.router.url.substring(0, index) : this.router.url;
    if (this.currentUrl === '/login' || this.currentUrl === '/auth/login') {
      if (this.route.snapshot.queryParams.authType === 'external') {
        this.store.setLoginToken();
        this.router.navigateByUrl('/');
      }
      this.step = 1;
    }
    if (this.currentUrl === '/signup' || this.currentUrl === '/auth/signup') {
      this.step = 2;
    }
    this.authService.loginStatusSubject.subscribe(value => {
      if (value) {
        if (this.route.snapshot.queryParams.returnUrl) {
          if (this.route.snapshot.queryParams.returnUrl === '/admin') {
            const newUrl = this.baseUrl + '/admin';
            window.location.href = newUrl;
          } else {
            this.router.navigateByUrl(
              decodeURIComponent(this.route.snapshot.queryParams.returnUrl)
            );
          }
        } else {
          this.router.navigateByUrl('/');
        }
        this.isOpenAccount = !value;
        this.authService.loginPromptMsg = undefined;
        this.authService.loginPromptMsg2 = undefined;
      }
    });
  }

  mobileLoginBtn() {
    if (this.mobile_number === undefined) {
      this.requiredFieldLogin = true;
    } else {
      this.mobileLogin = true;
      this.requiredFieldLogin = false;
      this.authService
        .login(this.Email, this.Password, this.mobile_number)
        .subscribe((response: any) => {
          if (!response.success) {
            if (response.errors.error) {
              this.LoginIncorrectMsg = response.errors.error[0];
            } else {
              this.LoginIncorrectMsg = response.errors[0];
            }
            this.LoginIncorrectMsgShow = true;
          } else {
            this.LoginIncorrectMsg = 'OTP has been Sent.';
            this.LoginIncorrectMsgShow = true;
            this.mobileLoginOtp = true;
          }
        });
    }
  }

  ngOnDestroy() {}
}
