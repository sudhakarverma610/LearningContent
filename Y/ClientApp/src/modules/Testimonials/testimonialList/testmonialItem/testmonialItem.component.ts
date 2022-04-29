import { Component, Input, OnInit } from '@angular/core';
import { TestimonialModel } from 'src/store/yjStoreModels/testimonials.model';

@Component({
  selector: 'app-testmonialItem',
  templateUrl: './testmonialItem.component.html',
  styleUrls: ['./testmonialItem.component.scss']
})
export class TestmonialItemComponent implements OnInit {

  @Input('testmonial')  
  public model:TestimonialModel; 
  constructor() { }

  ngOnInit() { 
    // for(let i=0;i<5;i++){
    //   if(this.model.review_number>i){
    //     this.ratingNumber[i]=true;
    //   }else{
    //     this.ratingNumber[i]=false;
    //   }
    // }
  }

}
