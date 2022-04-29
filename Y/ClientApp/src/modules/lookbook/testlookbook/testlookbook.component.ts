import { Component, OnInit } from '@angular/core';
import { LookbookService } from '../lookbook.service';

@Component({
  selector: 'app-testlookbook',
  templateUrl: './testlookbook.component.html',
  styleUrls: ['./testlookbook.component.scss']
})
export class TestlookbookComponent implements OnInit {
  constructor(
    private lookService: LookbookService
  ) { }
  public slides = [
    {
      alt: 'Hand of Fatima Charm',
      altSrc: 'https://files.y.jewelry/0031875_hand-of-fatima-charm.jpeg',
      attachment: null,
      id: 0,
      position: 0,
      src: 'https://files.y.jewelry/0031957_hand-of-fatima-charm.jpeg',
      title: 'Hand of Fatima Charm'
    },
    {
      alt: 'Hand of Fatima Charm',
      attachment: null,
      id: 1,
      position: 1,
      src: 'https://files.y.jewelry/0049028_img1_mobile.jpeg',
      title: 'Hand of Fatima Charm'
    },
    {
      alt: 'Hand of Fatima Charm',
      attachment: null,
      id: 2,
      position: 2,
      src: 'https://files.y.jewelry/0049027_img3_mobile.jpeg',
      title: 'Hand of Fatima Charm'
    },
    {
      alt: 'COVER IMAGE',
      attachment: null,
      id: 3,
      position: 4,
      src: 'https://files.y.jewelry/0049029_img2_mobile.jpeg',
      title: 'COVER IMAGE'
    }
  ];
  public Vslide: any;
public data: any = '';
 /****************************Timmer Setup***************************** */
 public intervalId = 0;
 public counterTimmer = 0;
  ngOnInit() {
    this.Vslide = this.slides[0];
    this.StartTimmer();
    this.lookService.test().subscribe((res: {Data: string; }) => {
      this.data = res.Data;
    });
  }
 StartTimmer() {
   // tslint:disable-next-line: variable-name
   const _self = this;
   _self.counterTimmer = 0;
   const intervalId = setInterval(() => {
     if (_self.counterTimmer < 100) {
       _self.counterTimmer = _self.counterTimmer + 1;
     }
     if (_self.counterTimmer === 100) {
       clearInterval(intervalId);
       if (_self.Vslide.id !== _self.slides[_self.slides.length - 1].id) {
           _self.rightSlide();
       }
     }
   }, 100);
 }

 leftSlide() {
   if (this.Vslide.id === 0) {
     this.Vslide = this.slides[this.slides.length - 1];
     return;
   }
   this.Vslide = this.slides[this.Vslide.id - 1];
 }
 rightSlide() {
   if (this.Vslide.id === this.slides[this.slides.length - 1].id) {
     this.Vslide = this.slides[0];
     this.counterTimmer = 0;
     clearInterval(this.intervalId);
     return;
   }
   this.Vslide = this.slides[this.Vslide.id + 1];
   this.StartTimmer();
 }
}
