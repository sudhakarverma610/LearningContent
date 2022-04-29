import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SharedService } from 'src/modules/shared/shared.service';

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgotPassword.component.html",
  styleUrls: ["./forgotPassword.component.scss"]
})
export class ForgotPasswordComponent implements OnInit {
  public email: string;
  public showMsg = false;
  public Msg = "Password recovery link has been sent to your email.";
  public sent = false;
  constructor(
    public dialogRef: MatDialogRef<ForgotPasswordComponent>,
    private service: SharedService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  validateEmail() {
    if (!this.email || !this.email.trim()) {
      return false;
    }
    // tslint:disable-next-line:max-line-length
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(this.email).toLowerCase());
  }

  sendNewPassword() {
    if (this.validateEmail()) {
      this.service
        .changePassword({ email: this.email })
        .subscribe((value: any) => {
          if (value.success) {
            this.sent = true;
            this.Msg = "Password recovery link has been sent to your email.";
            this.showMsg = true;
          } else {
            this.Msg =
              value.error ||
              "Error while completing the task. Please contact our Customer Service.";
          }
          this.showMsg = true;
        });
    }
  }
}
