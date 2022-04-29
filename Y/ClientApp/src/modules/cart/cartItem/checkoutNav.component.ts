import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-checkout-nav',
  templateUrl: './checkoutNav.component.html',
  styleUrls: ['./checkoutNav.component.scss']
})
export class CheckoutNavComponent implements OnInit, OnDestroy {
  activeAtShipping = true;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    if (this.router.isActive('/checkout', false)) {
      this.activeAtShipping = false;
    }
  }

  gotoCart() {
    this.router.navigate(['/cart']);
  }

  gotoShipping() {
    if (this.activeAtShipping) {
      this.router.navigate(['/checkout']);
    }
  }

  ngOnDestroy() {}
}
