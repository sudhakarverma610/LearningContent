import { Component, OnInit, OnDestroy } from "@angular/core";
import { Customer } from "src/store/Customer/customer.model";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: "app-mobile-input",
  templateUrl: "mobileInput.component.html",
  styleUrls: ["./mobileInput.component.scss"]
})
export class MobileInputComponent implements OnInit, OnDestroy {
  public mobile_number: string;
  public customer: Customer;
  public mobileSaved = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.authService.getCustomer().subscribe(res => {
      this.customer = res.customers[0];
    });
  }

  save() {
    if (this.mobile_number) {
      const data = {
        Id: parseInt(this.customer.id, 10),
        mobile: this.mobile_number
      };
      this.authService.editProfile(data).subscribe(res => {
        if (res) {
          this.mobileSaved = true;
          this.route.queryParams.subscribe(params => {
            if (params["returnUrl"]) {
              this.router.navigateByUrl(params["returnUrl"]);
            } else {
              this.router.navigate(["/"]);
            }
          });
        }
      });
    }
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    if (!this.mobileSaved) {
      this.logout();
    }
  }
}
