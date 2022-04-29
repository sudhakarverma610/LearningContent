import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { InfoService } from '../info.service';
import { AppService } from 'src/services/app.service';

@Component({
  selector: 'app-care',
  templateUrl: './care.component.html',
  styleUrls: ['./care.component.scss']
})
export class CareComponent implements OnDestroy, OnInit {
  public page;
  constructor(
    private sanitizer: DomSanitizer,
    private info: InfoService,
    private appService: AppService
  ) {}

  ngOnInit() {
    this.appService.isBrowser
      ? this.appService.loader.next(true)
      : console.log();
    this.appService.isBrowser ? window.scrollTo(0, 0) : console.log();

    this.info.fetchCare().subscribe((data: any) => {
      this.appService.isBrowser
        ? this.appService.loader.next(false)
        : console.log();
      this.page = this.sanitizer.bypassSecurityTrustHtml(data.body);
    });
  }

  ngOnDestroy() {}
}
