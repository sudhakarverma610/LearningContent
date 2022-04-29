import {
  Component,
  OnInit,
  Inject
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MetaService } from 'src/services/meta.service';
import {DOCUMENT, APP_BASE_HREF, Location } from '@angular/common';
import { AppService } from 'src/services/app.service';
declare let $: any;

@Component({
  selector: 'app-forgery',
  templateUrl: './forgery.component.html',
  styleUrls: ['./forgery.component.scss']
})
export class ForgeryComponent implements OnInit {
  public page;
  public baseUrl = '';
   constructor(
    private sanitizer: DomSanitizer,
    private appService: AppService,
    private route: ActivatedRoute,
    private metaService: MetaService,
   ) {
    this.baseUrl = appService.baseUrl ;
   }
  ngOnInit() {
    // const result = this.route.snapshot.data.data;
    this.page = this.sanitizer.bypassSecurityTrustHtml(
      this.route.snapshot.data.data.body
    );
    this.metaService.setMeta(
      this.route.snapshot.data.data.metaTitle,
      this.route.snapshot.data.data.metaDescription,
      this.route.snapshot.data.data.metaKeywords,
      this.appService.baseUrl + 'forgery',
      'https://files.y.jewelry/assets/img/metaImage.jpeg'
    );
    if (this.appService.isBrowser) {
      window.scrollTo(0, 0);
    } // console.log();

  }
}
