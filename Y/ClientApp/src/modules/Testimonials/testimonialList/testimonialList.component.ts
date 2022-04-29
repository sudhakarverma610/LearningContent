import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppService } from 'src/services/app.service';
import { AuthService } from 'src/services/auth.service';
import { TestimonialModel, TestimonialResponse, TestimonialResponseDto } from 'src/store/yjStoreModels/testimonials.model';
import { TestimonialsService } from '../testimonials.service';

@Component({
  selector: 'app-testimonialList',
  templateUrl: './testimonialList.component.html',
  styleUrls: ['./testimonialList.component.scss']
})
export class TestimonialListComponent implements OnInit,OnDestroy {

  public testimonials: TestimonialModel[] = []; 
  public nextPage=2;
  public limit=12;
  loggedIn: boolean;
  
  public unsubscribeSubject: Subject<string> = new Subject();
  constructor(private route: ActivatedRoute, 
        private appService: AppService, 
        private router: Router,
        private testnomialService:TestimonialsService,
        private authService:AuthService) { }

  ngOnInit() {    
    //this.GetTestimoniesReviewUsingPage(this.nextPage,this.limit);
    const result:TestimonialResponseDto= this.route.snapshot.data.data;
    this.testimonials=result.testimonials;   
    if(result.TotalPages===1){
      this.nextPage=-1;
    }  
    this.authService.loginStatusSubject
    .pipe(takeUntil(this.unsubscribeSubject))
    .subscribe(value => {
      this.loggedIn = value;
    });
 }

 GetTestimoniesReviewUsingPage(pagenumber:number,limit:number )
  {
    this.appService.loader.next(true);
    this.testnomialService.getTestinomials(pagenumber,limit)
    .subscribe(result=>{
     this.testimonials= [...this.testimonials,...result.testimonials];       
     if(result.TotalPages==this.nextPage){
       this.nextPage=-1;
     }else{
       this.nextPage=this.nextPage+1;
     }
     this.appService.loader.next(false);
    });       
  }
  openLoginPanier() {
    this.router.navigate(["/auth", "login"], {
      queryParams: { returnUrl: "/addtestimony/add", type: 2 }
    });
  }
  ngOnDestroy() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }
}
