import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: "app-recover-password",
  templateUrl: "./recoverPassword.component.html",
  styleUrls: ["./recoverPassword.component.scss"]
})
export class RecoverPasswordComponent implements OnDestroy, OnInit {
  public tokenValidation = false;
  public validationError = "Invalid token";

  public showPassword1 = false;
  public showPassword2 = false;

  public password: string;
  public cPassword: string;

  public showError = false;
  public showMsg = false;
  public msg: string;

  public email: string;
  public token: string;

  public guid: string;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.validationError = this.route.snapshot.data.recovery.error;
    this.tokenValidation = this.route.snapshot.data.recovery.success;
    this.token = this.route.snapshot.queryParams["token"];
    this.guid = this.route.snapshot.queryParams["guid"];
  }

  changePassword() {
    this.showError = false;
    this.showMsg = false;
    if (this.password && this.cPassword && this.password === this.cPassword) {
      this.authService
        .resetPassword(this.password, this.token, this.guid)
        .subscribe((res: { success: boolean; error: string }) => {
          if (res.success) {
            this.validationError = "Your password has been changed";
            this.tokenValidation = false;
          } else {
            this.msg = res.error;
            this.showMsg = true;
          }
        });
    } else {
      this.showError = true;
    }
  }

  ngOnDestroy() {}
}
