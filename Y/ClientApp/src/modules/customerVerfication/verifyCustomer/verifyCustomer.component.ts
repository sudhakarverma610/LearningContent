import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Customer } from 'src/store/Customer/customer.model';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-verifyCustomer',
  templateUrl: './verifyCustomer.component.html',
  styleUrls: ['./verifyCustomer.component.scss']
})
export class VerifyCustomerComponent implements OnDestroy, OnInit {
  public mobile_number: string;
  public otp: string;

  public showMsg = false;
  public Msg = 'OTP has been Sent';

  public step = 1;

  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<VerifyCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { customer: Customer }
  ) {}

  onNoClick(): void {
    this.dialogRef.close({ success: false });
  }

  sendOTP() {
    const data: any = {
      email: this.data.customer.email,
      mobile: this.mobile_number
    };
    this.authService.sendOtp(data);
    this.authService.sendOtpSubject.subscribe(response => {
      if ((response as any).type === 'success') {
        this.step = 2;
        this.Msg = 'OTP has been Sent';
        this.showMsg = true;
      } else {
        this.Msg = (response as any).message;
        this.showMsg = true;
      }
    });
  }

  verifyOtp() {
    const data: any = {
      email: this.data.customer.email,
      otp: this.otp,
      mobile: this.mobile_number
    };
    this.authService.verifyOtp(data);
    this.authService.verifyOtpSubject.subscribe(response => {
      if (
        (response as any).type === 'success' ||
        (response as any).message === 'already_verified'
      ) {
        this.dialogRef.close({ success: true });
      } else {
        if ((response as any).message === 'otp_not_verified') {
          this.Msg = 'Please check the entered otp.';
        } else {
          this.Msg = (response as any).message;
        }
        this.showMsg = true;
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy() {}
}
