import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-Promotional',
  templateUrl: './Promotional.component.html',
  styleUrls: ['./Promotional.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PromotionalComponent implements OnInit {
  // tslint:disable-next-line: variable-name
  private _promotionalData: any;

  @Input()
  public promotionData: any;
  // set promotionData(input: any)  {
  //   if (input) {
  //     input.heading = this.getInnerHTMLValue(
  //       input.heading
  //       );
  //     input.subheading = this.getInnerHTMLValue(
  //         input.subheading
  //       );
  //   }
  //   this._promotionalData = input;
  // }
  // get promotionData() {
  //   return this._promotionalData;
  // }
  constructor(  private sanitizer: DomSanitizer
    ) { }
  ngOnInit() {
    // if (this.promotionData) {
    //   this.promotionData.heading = this.getInnerHTMLValue(
    //     this.promotionData.heading
    //     );
    //   this.promotionData.subheading = this.getInnerHTMLValue(
    //     this.promotionData.subheading
    //     );
    // }
  }
  // getInnerHTMLValue(value: any) {
  //   return this.sanitizer.bypassSecurityTrustHtml(
  //     value
  //     );
  // }


}
