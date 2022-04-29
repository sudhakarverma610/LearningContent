import { Injectable, Inject, Optional } from '@angular/core';
import { DOCUMENT, APP_BASE_HREF } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { AppService } from 'src/services/app.service';

@Injectable()
export class MetaService {
  public baseUrl: string;
  constructor(
    @Inject(DOCUMENT) private doc,
    private metaService: Meta,
    private titleService: Title,
    private appService: AppService,
    @Optional()
    @Inject(APP_BASE_HREF)
    origin: string
  ) {
    this.baseUrl = origin ? origin : '';
  }

  setMeta(
    title = 'Buy Sterling Silver Jewellery Online | Y Jewelry',
    // tslint:disable-next-line: max-line-length
    description = 'Shop 925 sterling silver jewelry like charms, bracelets, neckchains, hoops, online. 100% Secure Payments. Fast Delivery. Order now.',
    keywords = 'Sterling Silver Jewelry, Silver Jewellery, 925 Sterling Silver, Gold Plated Jewellery, Rose Gold Plated Jewelery',
    url = this.appService.baseUrl,
    metaImageUrl = 'https://files.y.jewelry/assets/img/metaImage.jpeg'
  ) {
    if (this.appService.isBrowser) {
      this.removePreviousTags();
    }
    this.titleService.setTitle(title);
    // update meta tags
    this.metaService.addTag({
      name: 'title',
      content: title
    });
    this.metaService.addTag({
      name: 'description',
      content: description
    });
    this.metaService.addTag({
      name: 'keywords',
      content: keywords
    });
    this.metaService.addTag({
      property: 'og:title',
      content: title
    });
    this.metaService.addTag({
      property: 'og:description',
      content: description
    });
    this.metaService.addTag({
      property: 'og:image',
      content: metaImageUrl
    });
    this.metaService.addTag({
      property: 'og:image:secure_url',
      content: metaImageUrl
    });
    this.metaService.addTag({
      property: 'og:url',
      content: url
    });
  }

  removePreviousTags() {
    this.metaService.removeTag('name=\'title\'');
    this.metaService.removeTag('name=\'description\'');
    this.metaService.removeTag('name=\'keywords\'');
    this.metaService.removeTag('property=\'og:title\'');
    this.metaService.removeTag('property=\'og:description\'');
    this.metaService.removeTag('property=\'og:image\'');
    this.metaService.removeTag('property=\'og:image:secure_url\'');
    this.metaService.removeTag('property=\'og:url\'');
  }

  createLinkForCanonicalURL() {
    const link: HTMLLinkElement = this.doc.createElement('link');
    link.setAttribute('rel', 'canonical');
    this.doc.head.appendChild(link);
    let url = this.doc.URL.split('?')[0];
    // to change the url When it come as IP Address.
    if (url.indexOf('//172') !== -1) {
      url = this.baseUrl;
    }
    link.setAttribute('href', url);
  }
}
