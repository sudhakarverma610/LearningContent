import { Component, OnInit, Input, AfterContentChecked, OnDestroy } from '@angular/core';
import { AppService } from 'src/services/app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carousel-holder',
  templateUrl: 'carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselHolderComponent implements OnInit,OnDestroy, AfterContentChecked {
  public _responsive;
  public _nav;
  public padInit: boolean = false;
  customOptions: any = {
    loop: true,
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
        items: 4
      }
    },
    nav: false
  };

  // tslint:disable-next-line: no-input-rename
  @Input('slidesStore')
  public slidesStore = [];

  // tslint:disable-next-line: no-input-rename
  @Input('carouselType')
  public carouselType;

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
          items: 2
        }
      };
    }
  }

  get responsive() {
    return this._responsive;
  }

  @Input('nav')
  set nav(Nav) {
    if (Nav) {
      // this.customOptions.navText = [
      //   '<img src='https://files.y.jewelry/assets/img/chevron-circle-left-solid.svg' alt='navLeft' width='29' height='29' />',
      //   '<img src='https://files.y.jewelry/assets/img/chevron-circle-right-solid.svg' alt='navRight' width='29' height='29' />'
      // ];
    }
  }

  mouseposX = 0;
  mouseposY = 0;
  dotactive=1;
  public intervalId:any;
  constructor(public appService: AppService, private router: Router) {

  } 

  ngOnInit() {
    this.StartTimmer();
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
  StartTimmer(){
    let self=this;
    this.intervalId = setInterval(() => {
      if (self.dotactive === self.slidesStore.length) {
          self.dotactive=1;
       } else {
         self.dotactive=self.dotactive + 1;
       }
       self.DotClick(self.dotactive);
    }, 3000);
  }
  DotClick(activeDot:number){
      this.dotactive=activeDot;
      let elmnt= document.getElementById('divWrapper');
      if(!elmnt)
        return;
      let maxScrollLeft = elmnt.scrollWidth - elmnt.clientWidth;
      if(maxScrollLeft===0)
      {
        return;
      }       
      let avgWidth= maxScrollLeft/this.slidesStore.length;
      if(activeDot===1)
          elmnt.scrollLeft=0;
      else
          elmnt.scrollLeft=avgWidth * activeDot;
 
  }
  DotChecker():boolean{
    let elmnt= document.getElementById('divWrapper');
    if(!elmnt)
      return false;
    let maxScrollLeft = elmnt.scrollWidth - elmnt.clientWidth;
    if(maxScrollLeft===0)
    {
      return false;
    }  
    return true;
  }
  ngOnDestroy(): void {
    const self = this;
    clearInterval(self.intervalId);
  }  
}
