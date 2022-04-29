export class SaveTestimonialModel {
  public title: string;
  public review_text: string;
  public rating: number;
  public displaycaptcha: boolean;
  public cancustomerleavereview: boolean;
  public successfully_added: boolean;
  public result: string;
  constructor(input: any) {
    this.title = input.title;
    this.review_text = input.review_text;
    this.rating = input.rating;
    this.displaycaptcha = input.displaycaptcha;
    this.cancustomerleavereview = input.cancustomerleavereview;
    this.successfully_added = input.successfully_added;
    this.result = input.result;
  }
}

export interface TestimonialModel {
  display_name:string;
  customer_firstname: string;
  customer_lastname: string;
  review_text: string;
  company: string;
  review_number:number;
  review_Image:string; 
  createdOnDate: string;
}

export interface TestimonialResponse {
  testimonials: TestimonialModel[];
}
export interface TestimonialResponseDto{
  testimonials: TestimonialModel[];
  TotalPages:number;
  count:number;
}