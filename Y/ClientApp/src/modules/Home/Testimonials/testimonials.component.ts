import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AppService } from 'src/services/app.service';
import { TestimonialModel } from 'src/store/yjStoreModels/testimonials.model';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent implements OnInit, OnDestroy {
  @Input('testimonials')
  public testimonials:TestimonialModel[];
  public desktop:boolean;
  public model={} as TestimonialModel;
  constructor(private appService:AppService) { }
  ngOnInit() {
    this.desktop = this.appService.isBrowser;
    //console.log('testmonials ='+this.testimonials);
    var temp=this.testimonials[0];
    //this.model=new TestimonialModel();
    this.model.display_name=temp.display_name;
    this.model.customer_firstname=temp.customer_firstname;
    this.model.customer_lastname=temp.customer_lastname;
    this.model.review_text=temp.review_text;
    this.model.review_number=temp.review_number;;
    // for(let i=0;i<5;i++){
    //   if(this.model.review_number>i){
    //     this.ratingNumber[i]=true;
    //   }else{
    //     this.ratingNumber[i]=false;
    //   }
    // }
    this.model.review_Image=!temp.review_Image?"https://files.y.jewelry/homelastReviewInner.png":temp.review_Image; 

  } 

  ngOnDestroy() {}
}
