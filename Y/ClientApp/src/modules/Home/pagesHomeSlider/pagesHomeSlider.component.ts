import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/services/app.service';
import { InViewportMetadata } from 'ng-in-viewport';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-pagesHomeSlider',
  templateUrl: './pagesHomeSlider.component.html',
  styleUrls: ['./pagesHomeSlider.component.scss']
})
export class PagesHomeSliderComponent implements OnInit {
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
  }[] = [{
    id: '1',
    src: 'https://files.y.jewelry/assets/img/2020/1-about.webp',
    mobileSrc: 'https://files.y.jewelry/assets/img/2020/1-about.webp',
    link: 'info/about',
    alt: 'info/about',
    title: '5 things about us',
    heading: '5 things about us',
    buttonText: 'Learn more',
    buttonLink: 'info/about',
    description: 'Discover how we design and produce the charms that will enter you life very soon!'
  }];
  public slide: {
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
  };
  public _responsive;
  public _nav;
  public padInit = false;
  customOptions: any = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 1000,
    navText: ['', ''],
    autoplay: true,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 3
      },
      940: {
        items: 3
      }
    },
    nav: false
  };
  @Input() isTopRadiusneed = false; 
  public slidesStore = [];
  mouseposX = 0;
  mouseposY = 0;
  public desktop = false;
  constructor(private appService: AppService, private router: Router) {
    this.desktop = this.appService.isBrowser;
    this.slide = this._banners[0];
   }

  ngOnInit() {

    // this._banners.push({
    //   id: '1',
    //   src: 'https://files.y.jewelry/assets/img/2020/1-about.webp',
    //   mobileSrc:'https://files.y.jewelry/assets/img/2020/1-about.webp',
    //   link: 'info/about',
    //   alt: 'info/about',
    //   title: '5 things about us',
    //   heading:'5 things about us',
    //   buttonText:'Learn More',
    //   buttonLink:'info/about',
    //   description:'Discover how we design and produce the charms that will enter you life very soon!'
    // });
    // this._banners.push({
    //   id: '2',
    //   src: 'https://files.y.jewelry/assets/img/testimonials/banner.jpg',
    //   mobileSrc: 'https://files.y.jewelry/assets/img/home/about_slide2.jpg',
    //   link: 'addtestimony/list',
    //   alt: 'addtestimony/list',
    //   title: 'thank you for spreading the love',
    //   heading:'thank you for spreading the love',
    //   buttonText:'read the reviews',
    //   buttonLink:'addtestimony/list',
    // tslint:disable-next-line: max-line-length
    //   description:' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam varius sapien elementum, sollicitudin nisi vel, placerat ligula.'
    // });
     
  }
  changeUrl(value) {
    const currentExt = value.substr(value.lastIndexOf('.'));
    return value.substr(0, value.lastIndexOf('.')) + '_mobile' + currentExt;
  }
  ngAfterContentChecked() {
    if (this.appService.isBrowser) {
      try {
        window.dispatchEvent(new Event('resize'));
      } catch (err) {
        // console.log(err);
      }
    }
  }

  mouseDown(event: MouseEvent) {
    this.mouseposX = event.clientX;
    this.mouseposY = event.clientY;
  }

  mouseUp(event: MouseEvent, link) {
    if (this.mouseposX === event.clientX && this.mouseposY === event.clientY) {
      this.router.navigate(['/', link]);
    }
  }
  LearnMore(url: string){
    this.router.navigateByUrl(url);
  }
  onIntersection($event) {
    const {
      [InViewportMetadata]: { entry },
      target
    } = $event;
    const ratio = entry.intersectionRatio;
    const vid = target;
    ratio >= 0.65 ? vid.play() : vid.pause();
  }
}
