import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { CategoriesListModel } from 'src/store/categories/categories.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-giftcardmain',
  templateUrl: './giftCardMain.component.html',
  styleUrls: ['./giftCardMain.component.scss']
})
export class GiftCardMainComponent implements OnInit, OnDestroy {
  public unSubscribeSubject = new Subject();
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.init();
    this.router.events
      .pipe(takeUntil(this.unSubscribeSubject))
      .subscribe(val => {
        if (val instanceof NavigationEnd) {
          if (val.urlAfterRedirects === '/gift-voucher') {
            this.init();
          }
        }
      });
  }

  init() {
    const result: CategoriesListModel = this.route.snapshot.data.giftCards;
    const cat = result.categories.find(
      item1 => item1.se_name === 'gift-voucher'
    );
    if (cat) {
      const subCat = result.categories.find(item => {
        return item.parent_category_id.toString() === cat.id;
      });

      if (!this.route.snapshot.params['category']) {
        subCat
          ? this.router.navigate(['/gift-voucher', subCat.se_name])
          : this.router.navigateByUrl('/');
      }
    } else {
      this.router.navigateByUrl('/');
    }
  }

  ngOnDestroy() {
    this.unSubscribeSubject.next();
    this.unSubscribeSubject.complete();
  }
}
