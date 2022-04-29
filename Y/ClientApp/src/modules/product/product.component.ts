import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/services/app.service';
import { StatusCodeService } from 'src/services/statusCode.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']

})
export class ProductComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private statusCodeService: StatusCodeService,
    private appService: AppService
   ) {
    // route.params.subscribe(val => {
    //   // put the code from `ngOnInit` here
    //   this.ngOnInit();
    // });
   }
   public data: any;
   public type = 0;
  ngOnInit() {

    // const result: {
    //     type: number;
    //     data: any;
    //    } = this.route.snapshot.data.data;
    // this.type = result.type;
    // if (result.type === 1) {// categorydata
    //   this.data = result.data;
    //    } else if (result.type === 2) {
    //     this.data = result.data;
    //    } else {
    //     if (result.data.usage) {
    //       this.statusCodeService.usage = 'Sename not found';
    //     }
    //     this.statusCodeService.statusCode = 302;
    //     this.router.navigateByUrl(result.data.url);
    //    }

    // const result: {
    //   type: number;
    //   categorySename: string;
    //   sename: string;
    // } = this.route.snapshot.data.data;
    // if (result.type === 1) {// For catefory
    //   // tslint:disable-next-line: no-string-literal
    //   if (this.route.snapshot.params['category']) {
    //     // category/parent/sename
    //     this.router.navigate(
    //       // tslint:disable-next-line: no-string-literal
    //       ['/category', this.route.snapshot.params['category'], result.sename],
    //       {
    //         queryParams: this.route.snapshot.queryParams,
    //         queryParamsHandling: 'merge',
    //         skipLocationChange: true
    //       }
    //     );
    //   } else {
    //     // category/parent/sename
    //     this.router.navigate(['/category', 'parent', result.sename], {
    //       queryParams: this.route.snapshot.queryParams,
    //       queryParamsHandling: 'merge',
    //       skipLocationChange: true
    //     });
    //   }
    // } else if (result.type === 2) { // for Product
    //   // tslint:disable-next-line: no-string-literal
    //   if (this.route.snapshot.params['category']) {
    //     this.router.navigate(
    //       ['/product', result.categorySename, result.sename],
    //       {
    //         queryParams: this.route.snapshot.queryParams,
    //         queryParamsHandling: 'merge',
    //         skipLocationChange: true
    //       }
    //     );
    //   } else {
    //     this.statusCodeService.statusCode = 302;
    //     this.statusCodeService.url =
    //       '/' + result.categorySename + '/' + result.sename;
    //     this.router.navigate(['/', result.categorySename, result.sename]);
    //   }
    // } else { // not Found
    //   this.statusCodeService.usage = 'Sename not found';
    //   this.statusCodeService.statusCode = 302;
    //   this.statusCodeService.url = '/';
    //   this.router.navigateByUrl('/');
    // }
    if (this.appService.isBrowser) {
      const result: {
        type: number;
        categorySename: string;
        sename: string;
      } = this.route.snapshot.data.data;
      if (result.type === 1) {
        if (this.route.snapshot.params['category']) {
          this.router.navigate(
            ['/category', this.route.snapshot.params['category'], result.sename],
            {
              queryParams: this.route.snapshot.queryParams,
              queryParamsHandling: 'merge',
              skipLocationChange: true
            }
          );
        } else {
          this.router.navigate(['/category', 'parent', result.sename], {
            queryParams: this.route.snapshot.queryParams,
            queryParamsHandling: 'merge',
            skipLocationChange: true
          });
        }
      } else if (result.type === 2) {
        if (this.route.snapshot.params['category']) {
          this.router.navigate(
            ['/product', result.categorySename, result.sename],
            {
              queryParams: this.route.snapshot.queryParams,
              queryParamsHandling: 'merge',
              skipLocationChange: true
            }
          );
        } else {
          this.statusCodeService.statusCode = 302;
          this.statusCodeService.url =
            '/' + result.categorySename + '/' + result.sename;
          this.router.navigate(['/', result.categorySename, result.sename]);
        }
      } else {
        this.statusCodeService.usage = 'Sename not found';
        this.statusCodeService.statusCode = 302;
        this.statusCodeService.url = '/';
        this.router.navigateByUrl('/');
      }
    }
  }
  ngOnDestroy() {}
}
