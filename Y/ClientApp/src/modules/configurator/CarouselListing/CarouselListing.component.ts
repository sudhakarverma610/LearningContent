import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/services/app.service';
import { Product } from 'src/store/products/products.model';

@Component({
  selector: 'app-CarouselListing',
  templateUrl: './CarouselListing.component.html',
  styleUrls: ['./CarouselListing.component.scss']
})
export class CarouselListingComponent implements OnInit {
  // tslint:disable-next-line: variable-name
  public _responsive;
  public _nav;
  public _slideStore: any = [];
  public padInit = false;
  customOptions: any = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 60000,
    navText: ['', ''],
    autoplay: true,
    autoplayTimeout: 60000,
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
  public displayNoProducts = false;
  @Input('slidesStore')
  set slidesStore(input: any) {
    this._slideStore = input;
    if (!this._slideStore) {
      this.displayNoProducts = true;
    } else {
      this.displayNoProducts = false;
      this.Vslide = this._slideStore[0];
    }
  }
  get slidesStore() {
    return this._slideStore;
  }


  @Input('responsive')
  set responsive(input) {
    if (!input) {
      this.customOptions.responsive = {
        0: {
          items: 1
        },
        400: {
          items: 1
        },
        740: {
          items: 1
        },
        940: {
          items: 1
        }
      };
    }
  }
  @Output() OnProductClick = new EventEmitter<{index: any; category_sename: string, data: Product}>();

  get responsive() {
    return this._responsive;
  }

  @Input('nav')
  set nav(Nav) {
    if (Nav) {
    }
  }

  mouseposX = 0;
  mouseposY = 0;
  public Vslide: any;
  constructor(public appService: AppService, private router: Router) {}

  ngOnInit() {
   }
  ONProductClickChanged(eventData: {index: any, category_sename: string, data: Product}) {
    this.OnProductClick.emit(eventData);
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
  leftSlide(elmt: HTMLElement) {
    if (this.Vslide.id === 0) {
      this.Vslide = this.slidesStore[this.slidesStore.length - 1];
      this.ScollWidthDot(true, elmt);

      return;
    }
    this.Vslide = this.slidesStore[this.Vslide.id - 1];
    this.ScollWidthDot(true, elmt);
  }
  rightSlide(elmt: HTMLElement) {
    if (this.Vslide.id === this.slidesStore.length - 1) {
      this.Vslide = this.slidesStore[0];
      this.ScollWidthDot(false, elmt);
      return;
    }
    this.Vslide = this.slidesStore[this.Vslide.id + 1];
    this.ScollWidthDot(false, elmt);

  }
//   DotClick(activeDot:number){
//     this.dotactive=activeDot;
//     let elmnt= document.getElementById('divWrapper');
//     if(!elmnt)
//       return;
//     let maxScrollLeft = elmnt.scrollWidth - elmnt.clientWidth;
//     if(maxScrollLeft===0)
//     {
//       return;
//     }
//     let avgWidth= maxScrollLeft/this.slidesStore.length;
//     if(activeDot===1)
//         elmnt.scrollLeft=0;
//     else
//         elmnt.scrollLeft=avgWidth * activeDot;

// }
// DotChecker():boolean{
//   let elmnt= document.getElementById('divWrapper');
//   if(!elmnt)
//     return false;
//   let maxScrollLeft = elmnt.scrollWidth - elmnt.clientWidth;
//   if(maxScrollLeft===0)
//   {
//     return false;
//   }
//   return true;
// }
ScollWidthDot(isLeft= true, elmnt: HTMLElement) {
  if (!elmnt) {
    return;
  }
  const maxScrollLeft = elmnt.scrollWidth - elmnt.clientWidth;
  if (maxScrollLeft === 0) {
  return;
  }
  const scrollUnit = (maxScrollLeft / this.slidesStore.length);
  const leftScrollWidth = elmnt.scrollLeft;
  if (isLeft) {
    elmnt.scrollLeft = (leftScrollWidth + scrollUnit) > maxScrollLeft ? maxScrollLeft : (leftScrollWidth + scrollUnit);

  } else {
    elmnt.scrollLeft = (leftScrollWidth - scrollUnit) > maxScrollLeft ? maxScrollLeft : (leftScrollWidth - scrollUnit);
  }
  return;

}
ScollWidthDotWidthIndex(index, elmnt: HTMLElement) {
  if (!elmnt) {
    return;
  }
  const maxScrollLeft = elmnt.scrollWidth - elmnt.clientWidth;
  if (maxScrollLeft === 0) {
  return;
  }
  const scrollUnit = (maxScrollLeft / this.slidesStore.length);
  if (index === 0) {
    elmnt.scrollLeft = 0;
  } else if (index === (this.slidesStore.length - 1)) {
    elmnt.scrollLeft = maxScrollLeft;
  } else {
    elmnt.scrollLeft = scrollUnit * (index + 1);

  }
  return;

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
}
