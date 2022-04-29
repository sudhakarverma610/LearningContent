import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { AppService } from 'src/services/app.service';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss']
})
export class BannersComponent implements OnInit, OnDestroy {
  public _banners: {
    id: string;
    src: string;
    mobileSrc: string;
    link: string;
    alt: string;
    title: string;
    heading: string;
    buttonText: string;
    buttonLink: string;
    description: string;
  }[] = [];

  @Input()
  set banners(Banners: any) {
    if (Banners) {
      if (Banners.Link1) {
        this._banners.push({
          id: '1',
          src: Banners.Picture1Url,
          mobileSrc: Banners.Picture1Url,//this.changeUrl(Banners.Picture1Url),
          link: Banners.Link1,
          alt: Banners.AltText1,
          title: Banners.Text1,
          heading: Banners.AltText1,
          buttonText: Banners.ButtonText1,
          buttonLink: Banners.ButtonLink1,
          description: Banners.Description1
        });
      }
      if (Banners.Link2) {
        this._banners.push({
          id: '2',
          src: Banners.Picture2Url,
          mobileSrc: Banners.Picture2Url,//this.changeUrl(Banners.Picture2Url),
          link: Banners.Link2,
          alt: Banners.AltText2,
          title: Banners.Text2,
          heading: Banners.AltText2,
          buttonText: Banners.ButtonText2,
          buttonLink: Banners.ButtonLink2,
          description: Banners.Description2
        });
      }
      if (Banners.Link3) {
        this._banners.push({
          id: '3',
          src: Banners.Picture3Url,
          mobileSrc: Banners.Picture3Url,//this.changeUrl(Banners.Picture3Url),
          link: Banners.Link3,
          alt: Banners.AltText3,
          title: Banners.Text3,
          heading: Banners.AltText3,
          buttonText: Banners.ButtonText3,
          buttonLink: Banners.ButtonLink3,
          description: Banners.Description3
        });
      }
      if (Banners.Link4) {
        this._banners.push({
          id: '4',
          src: Banners.Picture4Url,
          mobileSrc:Banners.Picture4Url, ///this.changeUrl(Banners.Picture4Url),
          link: Banners.Link4,
          alt: Banners.AltText4,
          title: Banners.Text4,
          heading: Banners.AltText4,
          buttonText: Banners.ButtonText4,
          buttonLink: Banners.ButtonLink4,
          description: Banners.Description4
        });
      }
      if (Banners.Link5) {
        this._banners.push({
          id: '5',
          src: Banners.Picture5Url,
          mobileSrc: Banners.Picture5Url,//this.changeUrl(Banners.Picture5Url),
          link: Banners.Link5,
          alt: Banners.AltText5,
          title: Banners.Text5,
          heading: Banners.AltText5,
          buttonText: Banners.ButtonText5,
          buttonLink: Banners.ButtonLink5,
          description: Banners.Description5
        });
      }
      try {
        this._banners.sort((a, b) => Number(a.title) - Number(b.title));
      } catch (e) {}
    }
  }

  get banners() {
    return this._banners;
  }

  public desktop = false;

  constructor(private appService: AppService, public mediaObserver: MediaObserver) {
    this.desktop = this.appService.isBrowser;
  }

  ngOnInit() {}

  changeUrl(value) {
    const currentExt = value.substr(value.lastIndexOf('.'));
    return value.substr(0, value.lastIndexOf('.')) + '_mobile' + currentExt;
  }

  ngOnDestroy() {}
}
