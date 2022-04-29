import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lookbookladning',
  templateUrl: './lookbookladning.component.html',
  styleUrls: ['./lookbookladning.component.scss']
})
export class LookbookladningComponent implements OnInit {

  constructor() { }
  public lookbooks=[
    {
      id:0,
      mobileSrc:"https://files.y.jewelry/assets/img/2020/lookbooklanding/image+7.jpg",
      desktopSrc:"https://files.y.jewelry/assets/img/2020/lookbooklanding/image+7.jpg",
      alt:"Masoom × Y",
      url:"/masoomfory",
      display:1
    },
    {
      id:1,
      mobileSrc:"https://files.y.jewelry/assets/img/2020/lookbooklanding/image+8.jpg",
      desktopSrc:"https://files.y.jewelry/assets/img/2020/lookbooklanding/image+8.jpg",
      alt:"ibiza vacation",
      url:"/lookbook/ibiza"
    },
    {
      id:2,
      mobileSrc:"https://files.y.jewelry/assets/img/2020/lookbooklanding/image+9.jpg",
      desktopSrc:"https://files.y.jewelry/assets/img/2020/lookbooklanding/image+9.jpg",
      alt:"A day in paris",
      url:"/lookbook/paris"
    }
  ];
  ngOnInit() {
    let pos = 1;
    for (let i = 0; i < this.lookbooks.length; i++) {
      this.lookbooks[i].display = pos;      
      pos++;
      if (pos == 4) {
        pos = 1;
      }
    }
  }

}
