import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  constructor() { }
  @Input() IsShow: boolean;
  /**
    * Alert Class alert-primary,alert-warning ...
    */
  @Input() AlertClass = 'alert-primary';
  @Output() Close = new EventEmitter<boolean>();
  ngOnInit() {
  }
  ShowHide() {
    this.Close.emit(false);
    //this.IsShow = false;
  }
}
