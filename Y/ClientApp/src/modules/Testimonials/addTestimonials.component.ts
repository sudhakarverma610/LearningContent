import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { SaveTestimonialModel } from 'src/store/yjStoreModels/testimonials.model';
import { catchError, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { TestimonialsService } from './testimonials.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/services/auth.service';
import { Customer } from 'src/store/Customer/customer.model';
import { Router } from '@angular/router';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-add-testimonials',
  templateUrl: './addTestimonials.component.html',
  styleUrls: ['./addTestimonials.component.scss']
})
export class AddTestimonialsComponent implements OnInit, OnDestroy {
  public newTestimony: SaveTestimonialModel;
  public APIResult: string;
  public UPDATE_SUCCESS_MSG = 'The testimony has been successfully updated';
  public rating = 0;
  public intialUploadText = 'Fancy joining a picture?';
  public intialUploadUrl = 'https://files.y.jewelry/testminoalupload.png';
  public UploadText: string;
  public UploadUrl: string;
  public form: FormGroup = new FormGroup({});
  public fileToUpload: any;
  public message: string;
  public loggedIn = false;
  public isSuccessscreen = false;
  public APIResultError: string;
  public isNameAviable: string;
  public errorrating = 0;
  public unsubscribeSubject: Subject<string> = new Subject();
  tempArrRating = [false, false, false, false, false];
  constructor(private testimonialsService: TestimonialsService,
              private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private appService: AppService) {
    this.form = this.fb.group({
      name: [null, Validators.required],
      rating: [null],
      review_text: [null, Validators.required],
      fileToUpload: [null]
    });
    this.UploadText = this.intialUploadText;
    this.UploadUrl = this.intialUploadUrl;
  }

  ngOnInit() {
    this.authService.loginStatusSubject
    .pipe(takeUntil(this.unsubscribeSubject))
    .subscribe(value => {
      if (!value) {
        this.openLoginPanier();
      }
    });
    this.authService.customerStatus()
   .subscribe(res => {
     let customername = '';
     if (res.displayName) {
      customername += res.displayName;
    }
     this.form.patchValue({name: customername});
   });
    this.testimonyModalInit();

  }
  openLoginPanier() {
    this.router.navigate(['/auth', 'login'], {
      queryParams: { returnUrl: '/addtestimony/add', type: 2 }
    });
  }
  testimonyModalInit() {
    this.newTestimony = new SaveTestimonialModel({
      title: 'Testimony',
      rating: 5,
      review_text: ''
    });
  }

  SendReview() {
    // console.log(this.form);
    if (this.rating === 0) {
      this.rating = 0;
      this.errorrating = -1;
      return;
    }
    this.errorrating = 0;
    this.form.patchValue({rating: this.rating, fileToUpload: this.fileToUpload});
    if (this.form.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('title', this.form.get('name').value);
    formData.append('ReviewText', this.form.get('review_text').value);
    formData.append('rating', this.form.get('rating').value);
    formData.append('formFile', this.fileToUpload);
    this.appService.loader.next(true);
    this.isNameAviable = '1';
    this.testimonialsService
    .saveTestinomial(formData)
    .pipe(
      catchError(error => {
        return of({
          success: false,
          error:
            'An error Occurred while updating the Testimony, we are working on it.'
        });
      })
    )
    .subscribe((response: { success: boolean; error: string }) => {
      if (response.success) {
        window.scrollTo(0, 0);
        this.isSuccessscreen = true;
        this.APIResult = this.UPDATE_SUCCESS_MSG; this.appService.loader.next(false);
      } else {
        this.APIResultError = response.error; this.appService.loader.next(false);
      }
      this.testimonyModalInit();
    });

    // this.testimonialsService.displayNameAvaible(this.form.get('name').value).subscribe(res=>{
    //   if(res.sucess)
    //   {
    //     this.isNameAviable = "-1";
    //     this.appService.loader.next(false);
    //      return;
    //   }else{
    //     this.isNameAviable="1";
    //     this.testimonialsService
    //     .saveTestinomial(formData)
    //     .pipe(
    //       catchError(error => {
    //         return of({
    //           success: false,
    //           error:
    //             'An error Occurred while updating the Testimony, we are working on it.'
    //         });
    //       })
    //     )
    //     .subscribe((response: { success: boolean; error: string }) => {
    //       if (response.success) {
    //         window.scrollTo(0,0);
    //         this.isSuccessscreen=true;
    //         this.APIResult = this.UPDATE_SUCCESS_MSG; this.appService.loader.next(false);
    //       } else {
    //         this.APIResultError = response.error; this.appService.loader.next(false);
    //       }
    //       this.testimonyModalInit();
    //     });
    //   }
    // })


  }
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
    if (!file.item(0)) {
      this.UploadText = this.intialUploadText;
      return;
     }
    const mimeType = file[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = 'Only images are supported.';
      return;
    }
    this.UploadText = this.fileToUpload.name;
    // Show image preview
   /* let reader = new FileReader();
    reader.onload = (event: any) => {
      this.UploadUrl = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
    */
  }

ChangeRatingValue(index: number) {
      for (let i = 0; i < 5; i++) {
        if (index >= i) {
          this.tempArrRating[i] = true;
        } else {

          this.tempArrRating[i] = false;
        }
      }
      this.rating = index + 1;
    // console.log(this.ratingnumber);
    }
  ngOnDestroy() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }
}
