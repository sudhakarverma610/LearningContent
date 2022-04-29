import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
 
@Component({
  selector: 'app-ratingComponent',
  templateUrl: './ratingComponent.component.html',
  styleUrls: ['./ratingComponent.component.scss']
})
export class RatingComponentComponent implements OnInit {
  constructor() { }
  tempArrRating = [false, false, false, false, false];
  // tslint:disable-next-line: variable-name
  _ratingNumber = 0;
  @Output() RatingNumberChangedEvent = new EventEmitter<number>();
  @Input()
  set ratenumber(value: number) {
    this.ChangeRatingValue(value - 1);
    // this._ratingNumber = value;
  }
  get ratenumber() {
    return this._ratingNumber;
  }

  ngOnInit() {
  }
  OnSelectedRatingClick(index: number) {
    this.RatingNumberChangedEvent.emit(index + 1);
  }

  ChangeRatingValue(index: number) {
    for (let i = 0; i < 5; i++) {
      if (index >= i) {
        this.tempArrRating[i] = true;
      } else {

        this.tempArrRating[i] = false;
      }
      this._ratingNumber = index + 1;
    }
  }
}
