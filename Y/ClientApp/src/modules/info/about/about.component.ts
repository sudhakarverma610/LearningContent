import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
// import { AboutService } from './about.service';
import { ActivatedRoute } from '@angular/router';
import { MetaService } from 'src/services/meta.service';
import { AppService } from 'src/services/app.service';
import { InViewportMetadata } from 'ng-in-viewport';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  encapsulation: ViewEncapsulation.None
  // providers: [AboutService]
})
export class AboutComponent implements OnDestroy, OnInit {
  public page;

  public textVisible = false;
  public slides:
  {
    id: number;
    src: string;
    title: string;
    class: string;
    img1Src: string;
    img2Src: string;
    img3Src: string;
    posterImage: string;
    footer: string;
    button: { text: string; method: any };
    content: any;
  }[] =
  [
    {
      id: 0,
      src: 'https://files.y.jewelry/assets/img/2020/00.mp4',
      posterImage: 'https://files.y.jewelry/assets/img/2020/about-us/poster/00.png',
      title: null,
      class: 'vs1',
      img1Src: 'https://files.y.jewelry/assets/img/2020/5.svg',
      img2Src: 'https://files.y.jewelry/assets/img/2020/begib_2.svg',
      img3Src: null,
      footer: null,
      button: null,
      content: null
    },
    {
      id: 1,
      src: 'https://files.y.jewelry/assets/img/2020/01.mp4',
      posterImage: 'https://files.y.jewelry/assets/img/2020/about-us/poster/11.png',
      title: 'Express yourself',
      class: 'vs2',
      img1Src: 'https://files.y.jewelry/assets/img/2020/1_1.svg',
      img2Src: 'https://files.y.jewelry/assets/img/2020/1_2.svg',
      img3Src: null,
      footer: 'You are unique, show your emotions!',
      button: null,
      content: {
        h1: 'Y is appropriation of yourself',
        subh1: 'We state a luxury of openness that celebrates the rich and precious hues of life.',
        buttontext: 'tell me y',
        buttonUrl: '/tellmey',
        isImageUp: true,
        imgUrl: 'https://files.y.jewelry/assets/img/2020/about-us/image29.png',
        // tslint:disable-next-line: max-line-length
        text: 'The bursts of joy succeeding to the silent resiliences. The hollow that shapes the full, both united in one movement. The flow of our multiple selves in motion. Our jewelry stands to embrace the ever-changing definition of precious that we embody: the realms of power we keep drawing.'
      }

    },
    {
      id: 2,
      src: 'https://files.y.jewelry/assets/img/2020/02.mp4',
      posterImage: 'https://files.y.jewelry/assets/img/2020/about-us/poster/22.png',
      title: 'Inspired by life',
      class: 'vs3',
      img1Src: 'https://files.y.jewelry/assets/img/2020/2_1.svg',
      img2Src: 'https://files.y.jewelry/assets/img/2020/by life.svg',
      img3Src: null,
      footer: 'Discover our creative process',
      button: null,
      content: {
        h1: 'Y is made of living material in all its plenitude',
        subh1: 'Our inspiration is made of living material, its spice, its troubles, its intensity and its overflow.',
        buttontext: 'Shop now',
        buttonUrl: '/',
        isImageUp: true,
        imgUrl: 'https://files.y.jewelry/assets/img/2020/about-us/image24.png',
        // tslint:disable-next-line: max-line-length
        text: 'All that makes us bloom: from the ordeals to the splendors. We put together the fragments of our very rich moments, to create a bridge between way of thinking, and mode of being.'

      }

    },
    {
      id: 3,
      src: 'https://files.y.jewelry/assets/img/2020/03.mp4',
      posterImage: 'https://files.y.jewelry/assets/img/2020/about-us/poster/33.png',
      title: 'Swiss Quality',
      class: 'vs4',
      img1Src: 'https://files.y.jewelry/assets/img/2020/Bright.svg',
      img2Src: 'https://files.y.jewelry/assets/img/2020/Quality.svg',
      img3Src: null,
      footer: 'All our products are Swiss-made in sterling silver',
      button: null,
      content: {
        h1: 'quality as standard of luxury',
        subh1: 'Quality is the uncompromised and inherent standard of luxury.',
        buttontext: 'Shop now',
        buttonUrl: '/',
        isImageUp: false,
        imgUrl: 'https://files.y.jewelry/assets/img/2020/about-us/image30.jpg',
        // tslint:disable-next-line: max-line-length
        text: 'This is the reliable value we want to pass on. For the unfortunate gestures and the most wonderful moves, our charms are life-proof: this is why all of our jewelry is ‘solid’ 925 silver, and 18K Gold when plated. Swarovski crystals are set to make it shine in light of brightness, and standing. '
      }

    },
    {
      id: 4,
      src: 'https://files.y.jewelry/assets/img/2020/04.mp4',
      posterImage: 'https://files.y.jewelry/assets/img/2020/about-us/poster/44.png',
      title: 'Fair',
      class: 'vs5',
      img1Src: 'https://files.y.jewelry/assets/img/2020/Fair.svg',
      img2Src: null,
      img3Src: null,
      footer: 'Discover how we think our prices policy',
      button: null,
      content: {
        h1: 'life on earth is a gift we won’t trash.',
        // tslint:disable-next-line: max-line-length
        subh1: 'Firmly rooted in the Earth ground, we keep equilibrium by ensuring clearness and sustainability through all our interactions. ',
        buttontext: 'Shop now',
        buttonUrl: '/',
        isImageUp: true,
        imgUrl: 'https://files.y.jewelry/assets/img/2020/about-us/pexels-min-an-12489361.png',
        // tslint:disable-next-line: max-line-length
        text: 'Our transportation is carbon neutral and we keep working hard on improvements to shift the balance. Rewarded by our partners’ loyalty since day one, we hold fairness and confidence in high regard.'
      }


    },
    {
      id: 5,
      src: 'https://files.y.jewelry/assets/img/2020/05.mp4',
      posterImage: 'https://files.y.jewelry/assets/img/2020/about-us/poster/55.png',
      title: 'Luxury made affordable',
      class: 'vs6',
      img1Src: 'https://files.y.jewelry/assets/img/2020/Luxury.svg',
      img2Src: 'https://files.y.jewelry/assets/img/2020/made.svg',
      img3Src: 'https://files.y.jewelry/assets/img/2020/affordable.png',
      footer: 'A luxury of openness.',
      button: null,
      content: {
        h1: 'emotional luxury to sublime existence',
        subh1: 'We consider luxury as a priceless quest for delight, appealing to aesthetics, emotions and individuality. ',
        buttontext: 'Shop now',
        buttonUrl: '/',
        isImageUp: false,
        imgUrl: 'https://files.y.jewelry/assets/img/2020/about-us/image31.png',
        // tslint:disable-next-line: max-line-length
        text: 'No extra costs involved, our entire quality chain is thus controlled with great care from design to delivery, free from fancy office or expensive store. We expelled the unnecessary from our vision to commit only the essential, and make our vision of luxury affordable. '
      }

    }
  ];
public Vslide: any = this.slides[0];
public PreviousVslide: {
  id: number;
  src: string;
  title: string;
  class: string;
  img1Src: string;
  img2Src: string;
  img3Src: string;
  footer: string;
  button: { text: string; method: any };
  content: any;
};
public NextVslide: {
  id: number;
  src: string;
  title: string;
  class: string;
  img1Src: string;
  img2Src: string;
  img3Src: string;
  footer: string;
  button: { text: string; method: any };
  content: any;
};
public intervalId = 0;
public counterTimmer = 0;
  constructor(
    private sanitizer: DomSanitizer,
   // private route: ActivatedRoute,
    private metaService: MetaService,
    private appService: AppService
  ) {
    this.Vslide = this.slides[0];
    this.setPreviousAndNextSlide();
    this.StartTimmer();
  }
  ngOnInit() {
    const self = this;
    this.slides[0].button = {
      text: 'begin',
      method: self.rightSlide,
    };
   /// const result = this.route.snapshot.data.data;
   // this.page = this.sanitizer.bypassSecurityTrustHtml(result);
    this.metaService.setMeta(
      'About Us | Y Jewelry',
      'Shop 925 sterling silver jewelry like charms, bracelets, neckchains, hoops, online. 100% Secure Payments. Fast Delivery. Order now.',
      'Sterling Silver Jewelry, Silver Jewellery, 925 Sterling Silver, Gold Plated Jewellery, Rose Gold Plated Jewelery',
      this.appService.baseUrl + 'about',
      'https://files.y.jewelry/assets/img/metaImage.jpeg'
    );
    this.Vslide = this.slides[0];
    this.appService.isBrowser ? window.scrollTo(0, 0) : console.log();
  }
  /****************************Timmer Setup***************************** */
  StartTimmer() {
    // tslint:disable-next-line: variable-name
    const _self = this;
    _self.counterTimmer = 0;
    const intervalId = setInterval(() => {
      if (_self.counterTimmer < 100 && !this.textVisible) {
        _self.counterTimmer = _self.counterTimmer + 1;
      }
      if (_self.counterTimmer === 100) {
        clearInterval(intervalId);
        if (_self.Vslide.id !== _self.slides[_self.slides.length - 1].id) {
            _self.rightSlide();
         }
      }
    }, 300);
  }

  leftSlide() {
    this.textVisible = false;
    if (this.Vslide.id === 0) {
      this.Vslide = this.slides[this.slides.length - 1];
      this.setPreviousAndNextSlide();
      return;
    }
    this.Vslide = this.slides[this.Vslide.id - 1];
    this.setPreviousAndNextSlide();
  }
  setPreviousAndNextSlide() {
    if (this.Vslide.id === 0) {
      this.PreviousVslide = this.slides[this.slides.length - 1];
      this.NextVslide = this.slides[this.Vslide.id + 1];
    } else if (this.Vslide.id === (this.slides.length - 1)) {
    this.PreviousVslide = this.slides[this.Vslide.id - 1];
    this.NextVslide = this.slides[0];
    } else {
    this.PreviousVslide = this.slides[this.Vslide.id - 1];
    this.NextVslide = this.slides[this.Vslide.id + 1];
    }
  }
  rightSlide() {
    this.textVisible = false;
    if (this.Vslide.id === this.slides[this.slides.length - 1].id) {
      this.Vslide = this.slides[0];
      this.counterTimmer = 0;
      clearInterval(this.intervalId);
      this.setPreviousAndNextSlide();
      return;
    }
    this.Vslide = this.slides[this.Vslide.id + 1];
    this.setPreviousAndNextSlide();
    this.StartTimmer();
  }
  onIntersection($event) {
    try {
      const {
        [InViewportMetadata]: { entry },
        target
      } = $event;
      const ratio = entry.intersectionRatio;
      const vid = target;
      let promiseVideo;
      if (ratio >= 0.65) {
        promiseVideo = vid.play();
      } else {
        if (promiseVideo !== undefined) {
          promiseVideo.then(_ => {
            // Automatic playback started!
            // Show playing UI.
            // We can now safely pause video...
            vid.pause();
          })
          .catch(error => {
            // Auto-play was prevented
            // Show paused UI.
            console.log('error in vidoe playing ');
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  scrollToText($event, id) {
    this.textVisible = true;
    setTimeout(() => {
      const element =  document.getElementById(id);
      if (element) {
        window.scrollTo(0, element.scrollHeight);
      }
    },
    300);
    $event.stopPropagation();
  }

  ngOnDestroy() { }
}
