import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  Optional,
  ViewEncapsulation
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MetaService } from 'src/services/meta.service';
import { LocationStrategy, PathLocationStrategy, DOCUMENT, APP_BASE_HREF, Location } from '@angular/common';
import { AppService } from 'src/services/app.service';
declare let $: any;

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    MetaService,
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy }
  ]
})
export class ContentComponent implements OnInit, OnDestroy {
  public page;
  public pageSubscription;
  public document;
  public baseUrl = '';
  public location;
  constructor(
    private sanitizer: DomSanitizer,
    private appService: AppService,
    private route: ActivatedRoute,
    private metaService: MetaService,
    @Inject(DOCUMENT) document: any,
    location: Location,
    @Optional()
    @Inject(APP_BASE_HREF)
    origin: string
  ) {
    this.baseUrl = origin ? origin : '';
    this.location = location;
    this.document = document;
  }

  ngOnInit() {
    this.appService.isBrowser
      ? this.appService.loader.next(false)
      : console.log();
    this.page = this.sanitizer.bypassSecurityTrustHtml(
      this.route.snapshot.data.data.body
    );
    this.updateScript();
    this.metaService.setMeta(
      this.route.snapshot.data.data.metaTitle,
      this.route.snapshot.data.data.metaDescription,
      this.route.snapshot.data.data.metaKeywords,
      this.baseUrl + this.location.path(),
      'https://files.y.jewelry/assets/img/metaImage.jpeg'
    );
    this.appService.isBrowser ? window.scrollTo(0, 0) : console.log();
    this.route.fragment.subscribe(res => {

    });

  }

  updateScript() {
    const self = this;
    if (this.appService.isBrowser) {
      const interval = setInterval(function() {
        const tempNode = document.getElementById('accordion1');
        if (tempNode) {
          try {
            ($('#accordion1') as any).accordion();
            clearInterval(interval);
          } catch (err) {
            //
          }
        }
      }, 500);
    }
  }

  ngOnDestroy() {}
}
